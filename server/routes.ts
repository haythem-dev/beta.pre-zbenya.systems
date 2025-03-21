import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { WebSocketServer, WebSocket } from 'ws';
import { insertContactMessageSchema, contactFormSchema, cvSubmissionFormSchema } from "@shared/schema";
import { sendContactEmail, sendCvSubmissionEmail } from "./email";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage2,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: function (req, file, cb) {
    // Accept only PDF, DOC, and DOCX files
    const allowedFileTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedFileTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission route
  app.post('/api/contact', async (req, res) => {
    try {
      // Validate request body
      const validatedData = contactFormSchema.parse(req.body);
      
      // Save contact message to storage
      const contactMessage = await storage.createContactMessage(validatedData);
      
      // Send email notification
      await sendContactEmail(contactMessage);
      
      res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: 'Invalid form data', errors: error.errors });
      } else {
        console.error('Contact form submission error:', error);
        res.status(500).json({ success: false, message: 'Failed to send message' });
      }
    }
  });
  
  // CV submission route
  app.post('/api/cv-submission', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }
      
      console.log('File uploaded successfully:', req.file);
      
      // Get form data
      const formData = {
        name: req.body.name,
        email: req.body.email,
        position: req.body.position,
        fileName: req.file.originalname,
        filePath: req.file.path
      };
      
      console.log('Form data:', formData);
      
      // Save CV submission to storage
      const cvSubmission = await storage.createCvSubmission(formData);
      
      // Send email notification with CV attachment
      await sendCvSubmissionEmail(cvSubmission, req.file.path);
      
      res.status(200).json({ success: true, message: 'CV submitted successfully' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: 'Invalid form data', errors: error.errors });
      } else {
        console.error('CV submission error:', error);
        res.status(500).json({ success: false, message: 'Failed to submit CV', error: error instanceof Error ? error.message : String(error) });
      }
    }
  });

  const httpServer = createServer(app);

  // Initialize WebSocket server for chat
  // Use a more specific path to avoid conflicts with Vite's WebSocket
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: '/api/chat-socket'
  });

  // Define chat message interface
  interface ChatMessage {
    type: 'chat' | 'system' | 'welcome';
    content: string;
    userName?: string;
    clientId?: string;
    timestamp: string;
    history?: ChatMessage[];
  }
  
  // Define client interface
  interface ChatClient {
    ws: WebSocket;
    userName: string;
  }
  
  // Track connected clients
  const clients = new Map<string, ChatClient>();
  
  // Simple chat messages storage (in-memory)
  const chatMessages: ChatMessage[] = [];
  const MAX_STORED_MESSAGES = 50;

  wss.on('connection', (ws) => {
    const clientId = Date.now().toString();
    let userName = 'Guest-' + clientId.slice(-4);
    
    // Store client connection
    clients.set(clientId, { ws, userName });
    
    console.log(`New chat client connected: ${userName}`);
    
    // Send welcome message and chat history to new client
    ws.send(JSON.stringify({
      type: 'welcome',
      clientId: clientId,
      userName: userName,
      history: chatMessages.slice(-20) // Send last 20 messages
    }));
    
    // Broadcast new user joined to all clients
    broadcastMessage({
      type: 'system' as const,
      content: `${userName} joined the chat`,
      timestamp: new Date().toISOString()
    }, clientId);
    
    // Handle incoming messages
    ws.on('message', (messageData) => {
      try {
        const message = JSON.parse(messageData.toString()) as {
          type: string;
          content?: string;
          userName?: string;
        };
        
        // Handle different message types
        switch (message.type) {
          case 'chat':
            if (typeof message.content === 'string') {
              // Add timestamp and user info
              const chatMessage: ChatMessage = {
                type: 'chat' as const,
                content: message.content,
                userName: userName,
                clientId: clientId,
                timestamp: new Date().toISOString()
              };
              
              // Store message
              chatMessages.push(chatMessage);
              if (chatMessages.length > MAX_STORED_MESSAGES) {
                chatMessages.shift(); // Remove oldest message
              }
              
              // Broadcast to all clients
              broadcastMessage(chatMessage);
            }
            break;
            
          case 'setName':
            if (message.userName && message.userName.trim()) {
              const oldName = userName;
              userName = message.userName.trim().substring(0, 20); // Limit name length
              
              const client = clients.get(clientId);
              if (client) {
                client.userName = userName;
                
                // Announce name change
                broadcastMessage({
                  type: 'system' as const,
                  content: `${oldName} changed their name to ${userName}`,
                  timestamp: new Date().toISOString()
                });
              }
            }
            break;
        }
      } catch (error) {
        console.error('Error processing chat message:', error);
      }
    });
    
    // Handle disconnection
    ws.on('close', () => {
      const client = clients.get(clientId);
      if (client) {
        console.log(`Chat client disconnected: ${client.userName}`);
        
        // Broadcast user left message
        broadcastMessage({
          type: 'system' as const,
          content: `${client.userName} left the chat`,
          timestamp: new Date().toISOString()
        });
        
        // Remove client
        clients.delete(clientId);
      }
    });
  });
  
  // Function to broadcast messages to all clients
  function broadcastMessage(message: ChatMessage, excludeClientId: string | null = null) {
    clients.forEach((client, clientId) => {
      // Don't send to excluded client (if specified)
      if (excludeClientId && clientId === excludeClientId) return;
      
      if (client.ws.readyState === WebSocket.OPEN) { // Check if connection is open
        client.ws.send(JSON.stringify(message));
      }
    });
  }

  return httpServer;
}

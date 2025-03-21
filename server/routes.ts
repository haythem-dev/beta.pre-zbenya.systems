import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
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
      
      // Get form data
      const formData = {
        name: req.body.name,
        email: req.body.email,
        position: req.body.position,
        fileName: req.file.originalname,
        filePath: req.file.path
      };
      
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
        res.status(500).json({ success: false, message: 'Failed to submit CV' });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

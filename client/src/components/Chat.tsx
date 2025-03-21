import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageSquare, Edit, User, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

type Message = {
  type: 'chat' | 'system' | 'welcome';
  content: string;
  userName?: string;
  clientId?: string;
  timestamp: string;
};

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [clientId, setClientId] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const webSocket = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Connect to WebSocket when component mounts
  useEffect(() => {
    // Create WebSocket connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/chat-socket`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      setIsConnected(true);
      console.log('Connected to chat server');
    };
    
    ws.onclose = () => {
      setIsConnected(false);
      console.log('Disconnected from chat server');
      
      // Try to reconnect after 3 seconds
      setTimeout(() => {
        console.log('Attempting to reconnect...');
        connectWebSocket();
      }, 3000);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: 'Connection Error',
        description: 'Could not connect to the chat server. Will try again shortly.',
        variant: 'destructive'
      });
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'welcome') {
          // Set client ID and username from server
          setClientId(data.clientId);
          setUserName(data.userName);
          setNewName(data.userName);
          
          // Add welcome message
          const welcomeMsg: Message = {
            type: 'system',
            content: `Welcome to the ZbenyaSystems live chat! You are connected as ${data.userName}.`,
            timestamp: new Date().toISOString()
          };
          
          // Add chat history
          setMessages(prev => [...(data.history || []), welcomeMsg]);
        } else {
          // Add new message to chat
          setMessages(prev => [...prev, data]);
          
          // Increment unread count if chat is not open
          if (!isOpen) {
            setUnreadCount(prev => prev + 1);
          }
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };
    
    webSocket.current = ws;
    
    // Cleanup function
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);
  
  // Function to reconnect
  const connectWebSocket = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/chat-socket`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      setIsConnected(true);
      console.log('Reconnected to chat server');
      toast({
        title: 'Connected',
        description: 'Successfully connected to chat server.',
        variant: 'default'
      });
    };
    
    ws.onclose = () => {
      setIsConnected(false);
      setTimeout(connectWebSocket, 3000);
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'welcome') {
          setClientId(data.clientId);
          setUserName(data.userName);
          setNewName(data.userName);
          
          const welcomeMsg: Message = {
            type: 'system',
            content: `Welcome back! You are reconnected as ${data.userName}.`,
            timestamp: new Date().toISOString()
          };
          
          setMessages(prev => [...(data.history || []), welcomeMsg]);
        } else {
          setMessages(prev => [...prev, data]);
          
          if (!isOpen) {
            setUnreadCount(prev => prev + 1);
          }
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };
    
    webSocket.current = ws;
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Reset unread count when opening chat
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);
  
  // Send message function
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !isConnected) return;
    
    const messageObj = {
      type: 'chat',
      content: newMessage
    };
    
    webSocket.current?.send(JSON.stringify(messageObj));
    setNewMessage('');
  };
  
  // Change username function
  const changeUserName = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newName.trim() || !isConnected) return;
    
    const nameChangeObj = {
      type: 'setName',
      userName: newName
    };
    
    webSocket.current?.send(JSON.stringify(nameChangeObj));
    setIsEditingName(false);
  };
  
  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          onClick={() => setIsOpen(true)} 
          size="lg" 
          className="rounded-full h-14 w-14 bg-primary shadow-lg"
        >
          <MessageSquare className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </div>
      
      {/* Chat Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md p-0 gap-0 max-h-[80vh] flex flex-col">
          <DialogHeader className="px-4 py-2 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Live Chat
                {!isConnected && (
                  <Badge variant="outline" className="text-red-500 text-xs">Disconnected</Badge>
                )}
              </DialogTitle>
              <div className="flex items-center gap-2">
                {isEditingName ? (
                  <form onSubmit={changeUserName} className="flex gap-1">
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      autoFocus
                      className="h-7 text-sm max-w-[150px]"
                      maxLength={20}
                    />
                    <Button 
                      type="submit" 
                      size="sm" 
                      className="h-7 px-2"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2"
                      onClick={() => {
                        setNewName(userName);
                        setIsEditingName(false);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </form>
                ) : (
                  <div className="flex items-center gap-1 text-sm">
                    <User className="h-3 w-3" />
                    <span>{userName}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0" 
                      onClick={() => setIsEditingName(true)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <DialogClose asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <X className="h-4 w-4" />
                  </Button>
                </DialogClose>
              </div>
            </div>
          </DialogHeader>
          
          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${
                  message.type === 'system' 
                    ? 'justify-center' 
                    : message.clientId === clientId 
                      ? 'justify-end' 
                      : 'justify-start'
                }`}>
                  {message.type === 'system' ? (
                    <div className="text-xs text-gray-500 bg-gray-100 py-1 px-3 rounded-full">
                      {message.content}
                    </div>
                  ) : message.clientId === clientId ? (
                    <div className="max-w-[80%]">
                      <div className="bg-primary text-primary-foreground p-3 rounded-lg rounded-tr-none">
                        {message.content}
                      </div>
                      <div className="text-xs text-right mt-1 text-gray-500">
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  ) : (
                    <div className="flex max-w-[80%]">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                          {message.userName?.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 mb-1">{message.userName}</span>
                          <div className="bg-gray-100 p-3 rounded-lg rounded-tl-none">
                            {message.content}
                          </div>
                        </div>
                        <div className="text-xs mt-1 text-gray-500">
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          {/* Message Input */}
          <CardFooter className="p-2 border-t">
            <form onSubmit={sendMessage} className="flex w-full gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={!isConnected}
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={!isConnected || !newMessage.trim()}
                className="bg-primary"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
import { users, type User, type InsertUser, type ContactMessage, type InsertContactMessage, type CvSubmission, type InsertCvSubmission } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contact form methods
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  getContactMessageById(id: number): Promise<ContactMessage | undefined>;
  
  // CV submission methods
  createCvSubmission(submission: InsertCvSubmission): Promise<CvSubmission>;
  getCvSubmissions(): Promise<CvSubmission[]>;
  getCvSubmissionById(id: number): Promise<CvSubmission | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contactMessages: Map<number, ContactMessage>;
  private cvSubmissions: Map<number, CvSubmission>;
  private userCurrentId: number;
  private contactCurrentId: number;
  private cvCurrentId: number;

  constructor() {
    this.users = new Map();
    this.contactMessages = new Map();
    this.cvSubmissions = new Map();
    this.userCurrentId = 1;
    this.contactCurrentId = 1;
    this.cvCurrentId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Contact message methods
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const id = this.contactCurrentId++;
    const newMessage: ContactMessage = { 
      ...message, 
      id, 
      createdAt: new Date() 
    };
    this.contactMessages.set(id, newMessage);
    return newMessage;
  }
  
  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }
  
  async getContactMessageById(id: number): Promise<ContactMessage | undefined> {
    return this.contactMessages.get(id);
  }
  
  // CV submission methods
  async createCvSubmission(submission: InsertCvSubmission): Promise<CvSubmission> {
    const id = this.cvCurrentId++;
    const newSubmission: CvSubmission = {
      ...submission,
      id,
      createdAt: new Date()
    };
    this.cvSubmissions.set(id, newSubmission);
    return newSubmission;
  }
  
  async getCvSubmissions(): Promise<CvSubmission[]> {
    return Array.from(this.cvSubmissions.values());
  }
  
  async getCvSubmissionById(id: number): Promise<CvSubmission | undefined> {
    return this.cvSubmissions.get(id);
  }
}

export const storage = new MemStorage();

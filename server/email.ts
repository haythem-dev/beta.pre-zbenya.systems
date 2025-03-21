import nodemailer from 'nodemailer';
import { type ContactMessage, type CvSubmission } from '@shared/schema';
import fs from 'fs';

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true' || false,
  auth: {
    user: process.env.EMAIL_USER || 'contact.beta.zbenyasystems@gmail.com',
    pass: process.env.EMAIL_PASSWORD
  }
});

// Function to send email for contact form submissions
export async function sendContactEmail(message: ContactMessage): Promise<void> {
  try {
    // Email to company about new contact form submission
    await transporter.sendMail({
      from: `"ZbenyaSystems Website" <${process.env.EMAIL_USER || 'contact.beta.zbenyasystems@gmail.com'}>`,
      to: process.env.CONTACT_EMAIL || 'contact.beta.zbenyasystems@gmail.com',
      subject: `New Contact Form Submission: ${message.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${message.name}</p>
        <p><strong>Email:</strong> ${message.email}</p>
        <p><strong>Subject:</strong> ${message.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.message.replace(/\n/g, '<br>')}</p>
        <p><em>This email was sent from the contact form on the ZbenyaSystems website.</em></p>
      `
    });

    // Confirmation email to user
    await transporter.sendMail({
      from: `"ZbenyaSystems" <${process.env.EMAIL_USER || 'contact.beta.zbenyasystems@gmail.com'}>`,
      to: message.email,
      subject: 'Thank you for contacting ZbenyaSystems',
      html: `
        <h2>Thank You for Contacting Us</h2>
        <p>Dear ${message.name},</p>
        <p>We have received your message regarding "${message.subject}" and will get back to you as soon as possible.</p>
        <p>Here's a copy of your message:</p>
        <p><em>${message.message.replace(/\n/g, '<br>')}</em></p>
        <p>Best regards,</p>
        <p>The ZbenyaSystems Team</p>
      `
    });

    console.log('Contact emails sent successfully');
  } catch (error) {
    console.error('Error sending contact email:', error);
    throw new Error('Failed to send email notifications');
  }
}

// Function to send email for CV submissions
export async function sendCvSubmissionEmail(submission: CvSubmission, filePath: string): Promise<void> {
  try {
    // Email to company about new CV submission
    await transporter.sendMail({
      from: `"ZbenyaSystems Website" <${process.env.EMAIL_USER || 'contact.beta.zbenyasystems@gmail.com'}>`,
      to: process.env.HR_EMAIL || 'contact.beta.zbenyasystems@gmail.com',
      subject: `New CV Submission for ${submission.position} Position`,
      html: `
        <h2>New CV Submission</h2>
        <p><strong>Name:</strong> ${submission.name}</p>
        <p><strong>Email:</strong> ${submission.email}</p>
        <p><strong>Position:</strong> ${submission.position}</p>
        <p><strong>CV File:</strong> ${submission.fileName}</p>
        <p><em>The CV file is attached to this email.</em></p>
      `,
      attachments: [
        {
          filename: submission.fileName,
          path: filePath
        }
      ]
    });

    // Confirmation email to applicant
    await transporter.sendMail({
      from: `"ZbenyaSystems HR" <${process.env.EMAIL_USER || 'contact.beta.zbenyasystems@gmail.com'}>`,
      to: submission.email,
      subject: 'Thank you for your application to ZbenyaSystems',
      html: `
        <h2>Application Received</h2>
        <p>Dear ${submission.name},</p>
        <p>Thank you for submitting your CV for the ${submission.position} position at ZbenyaSystems.</p>
        <p>Our HR team will review your application and contact you if your qualifications match our current needs.</p>
        <p>Best regards,</p>
        <p>HR Department</p>
        <p>ZbenyaSystems</p>
      `
    });

    console.log('CV submission emails sent successfully');
  } catch (error) {
    console.error('Error sending CV submission email:', error);
    throw new Error('Failed to send email notifications');
  }
}

// Verify SMTP connection on startup
export async function verifyEmailConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log('Email server connection verified successfully');
    return true;
  } catch (error) {
    console.error('Email server connection failed:', error);
    return false;
  }
}

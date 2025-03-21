import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, MapPin, Phone, Mail, Send, FileUp } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiRequest } from "@/lib/queryClient";
import { contactFormSchema, cvSubmissionFormSchema } from "@shared/schema";

export default function Contact() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);
  const [isCvSubmitting, setIsCvSubmitting] = useState(false);

  // Contact form
  const contactForm = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  // CV form
  const cvForm = useForm<z.infer<typeof cvSubmissionFormSchema>>({
    resolver: zodResolver(cvSubmissionFormSchema),
    defaultValues: {
      name: "",
      email: "",
      position: "",
      file: undefined
    }
  });

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      cvForm.setValue("file", selectedFile);
    }
  };

  // Remove selected file
  const removeFile = () => {
    setFile(null);
    cvForm.setValue("file", undefined);
  };

  // Submit contact form
  const onContactSubmit = async (data: z.infer<typeof contactFormSchema>) => {
    setIsContactSubmitting(true);
    try {
      await apiRequest('POST', '/api/contact', data);
      contactForm.reset();
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully. We'll get back to you soon.",
        variant: "default",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "There was an error sending your message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsContactSubmitting(false);
    }
  };

  // Submit CV form
  const onCvSubmit = async (data: z.infer<typeof cvSubmissionFormSchema>) => {
    setIsCvSubmitting(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('position', data.position);
      formData.append('file', data.file);

      // Use fetch directly for FormData
      const response = await fetch('/api/cv-submission', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }

      cvForm.reset();
      setFile(null);
      toast({
        title: "CV Submitted",
        description: "Your CV has been submitted successfully. We'll review it and get back to you soon.",
        variant: "default",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "There was an error submitting your CV. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsCvSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section py-16 bg-gray-50 scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-bold text-3xl mb-4">Contact Us</h2>
          <div className="w-20 h-1 bg-secondary mx-auto mb-6"></div>
          <p className="text-lg max-w-3xl mx-auto">
            Get in touch with our team for inquiries, project consultations, or to submit your CV for freelance opportunities.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-1/2">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-xl mb-4">Send us a message</h3>
              
              <Form {...contactForm}>
                <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={contactForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={contactForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={contactForm.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="How can we help you?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={contactForm.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Write your message here..." 
                            rows={4} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit"
                      className="bg-primary hover:bg-blue-700 text-white"
                      disabled={isContactSubmitting}
                    >
                      <span>Send Message</span>
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
          
          <div className="lg:w-1/2">
            {/* CV Upload */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="font-semibold text-xl mb-4">Submit Your CV</h3>
              
              <Form {...cvForm}>
                <form onSubmit={cvForm.handleSubmit(onCvSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={cvForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={cvForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={cvForm.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position of Interest <span className="text-red-500">*</span></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a position" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="frontend">Frontend Developer</SelectItem>
                            <SelectItem value="backend">Backend Developer</SelectItem>
                            <SelectItem value="fullstack">Full Stack Developer</SelectItem>
                            <SelectItem value="mobile">Mobile Developer</SelectItem>
                            <SelectItem value="ui-ux">UI/UX Designer</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={cvForm.control}
                    name="file"
                    render={({ field: { onChange, ...rest } }) => (
                      <FormItem>
                        <FormLabel>Upload CV (PDF, DOC, DOCX) <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <div className="flex flex-col gap-2">
                            <label 
                              htmlFor="cv-file" 
                              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                            >
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="text-gray-400 mb-2 h-6 w-6" />
                                <p className="mb-2 text-sm text-gray-500"><span className="font-medium">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500">PDF, DOC or DOCX (MAX. 5MB)</p>
                              </div>
                              <input 
                                id="cv-file" 
                                type="file" 
                                accept=".pdf,.doc,.docx" 
                                className="hidden" 
                                onChange={(e) => {
                                  handleFileChange(e);
                                }}
                                {...rest}
                              />
                            </label>
                            
                            {file && (
                              <div className="mt-2 text-sm text-gray-600 flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="font-medium truncate">{file.name}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-700 p-1 h-auto"
                                  onClick={removeFile}
                                >
                                  ✕
                                </Button>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit"
                      className="bg-secondary hover:bg-orange-700 text-white"
                      disabled={isCvSubmitting}
                    >
                      <span>Submit CV</span>
                      <FileUp className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
            
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-xl mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">Address</h4>
                    <p className="text-gray-600">123 Technology Park, Tunis, Tunisia</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">Email</h4>
                    <a href="mailto:contact@zbenyasystems.com" className="text-gray-600 hover:text-primary">contact@zbenyasystems.com</a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">Phone</h4>
                    <a href="tel:+21612345678" className="text-gray-600 hover:text-primary">+216 12 345 678</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cvSubmissionFormSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, MapPin, Phone, Mail, Send, FileUp } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiRequest } from "@/lib/queryClient";
import { contactFormSchema } from "@shared/schema";

// Modified CV form schema for frontend validation
const cvFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  position: z.string().min(1, { message: "Position is required" }),
  file: z.any().optional()
});

export default function Contact() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);
  const [isCvSubmitting, setIsCvSubmitting] = useState(false);
  // Contrôle des onglets pour la version mobile
  const [activeTab, setActiveTab] = useState<'contact' | 'cv'>('contact');

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
  const cvForm = useForm<z.infer<typeof cvFormSchema>>({
    resolver: zodResolver(cvFormSchema),
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
      console.log('Selected file:', selectedFile.name, selectedFile.type, selectedFile.size);
      
      // Validate file size and type
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(selectedFile.type)) {
        toast({
          title: "Error",
          description: "File must be PDF, DOC, or DOCX",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      cvForm.setValue("file", selectedFile);
    }
  };

  // Remove selected file
  const removeFile = () => {
    setFile(null);
    cvForm.setValue("file", null);
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
  const onCvSubmit = async (data: z.infer<typeof cvFormSchema>) => {
    setIsCvSubmitting(true);

    try {
      if (!file) {
        toast({
          title: "Error",
          description: "Please select a file to upload",
          variant: "destructive",
        });
        setIsCvSubmitting(false);
        return;
      }
      
      console.log('Submitting CV with file:', file.name, file.type, file.size);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('position', data.position);
      formData.append('file', file);

      // Use fetch directly for FormData
      const response = await fetch('/api/cv-submission', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('Submission result:', result);

      if (!response.ok) {
        throw new Error(result.message || `${response.status}: ${response.statusText}`);
      }

      cvForm.reset();
      setFile(null);
      toast({
        title: "CV Submitted",
        description: "Your CV has been submitted successfully. We'll review it and get back to you soon.",
        variant: "default",
      });
    } catch (error) {
      console.error('CV submission error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was an error submitting your CV. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsCvSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section py-12 md:py-16 bg-gray-50 scroll-mt-16">
      <div className="container mx-auto">
        <div className="text-center mb-8 md:mb-12 animate-fadeIn">
          <h2 className="font-bold text-2xl md:text-3xl mb-4">Contact Us</h2>
          <div className="w-16 md:w-20 h-1 bg-secondary mx-auto mb-4 md:mb-6"></div>
          <p className="text-base md:text-lg max-w-3xl mx-auto">
            Get in touch with our team for inquiries, project consultations, or to submit your CV for freelance opportunities.
          </p>
        </div>

        {/* Mobile tabs for forms (mobile only) */}
        <div className="md:hidden mb-6 flex border-b border-gray-200">
          <button 
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'contact' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('contact')}
          >
            Contact Us
          </button>
          <button 
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'cv' ? 'text-secondary border-b-2 border-secondary' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('cv')}
          >
            Submit CV
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
          {/* Contact Form - hidden on mobile when CV tab is active */}
          <div className={`w-full lg:w-1/2 ${activeTab === 'cv' ? 'hidden md:block' : ''} animate-slideUp`}>
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <h3 className="font-semibold text-lg md:text-xl mb-4">Send us a message</h3>

              <Form {...contactForm}>
                <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={contactForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm md:text-base">Full Name <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your name" 
                              className="h-10 md:h-11" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={contactForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm md:text-base">Email Address <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="your.email@example.com" 
                              className="h-10 md:h-11"
                              type="email"
                              inputMode="email"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={contactForm.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base">Subject <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="How can we help you?" 
                            className="h-10 md:h-11"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={contactForm.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base">Message <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Write your message here..." 
                            rows={4} 
                            className="resize-y min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button 
                      type="submit"
                      className="bg-primary hover:bg-blue-700 text-white w-full sm:w-auto"
                      disabled={isContactSubmitting}
                    >
                      {isContactSubmitting ? 'Sending...' : (
                        <>
                          <span>Send Message</span>
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>

            {/* Contact Information - Visible on mobile only in contact tab */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mt-6 md:hidden">
              <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">Address</h4>
                    <p className="text-gray-600">123 Technology Park, Tunis, Tunisia</p>
                  </div>
                </a>

                <a href="mailto:contact@zbenyasystems.com" className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">Email</h4>
                    <span className="text-gray-600 hover:text-primary">contact@zbenyasystems.com</span>
                  </div>
                </a>

                <a href="tel:+21612345678" className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">Phone</h4>
                    <span className="text-gray-600 hover:text-primary">+216 12 345 678</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className={`w-full lg:w-1/2 ${activeTab === 'contact' ? 'hidden md:block' : ''} animate-slideUp`}>
            {/* CV Upload Form */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 md:mb-8">
              <h3 className="font-semibold text-lg md:text-xl mb-4">Submit Your CV</h3>

              <Form {...cvForm}>
                <form onSubmit={cvForm.handleSubmit(onCvSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={cvForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm md:text-base">Full Name <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your name" 
                              className="h-10 md:h-11"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={cvForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm md:text-base">Email Address <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="your.email@example.com" 
                              className="h-10 md:h-11"
                              type="email"
                              inputMode="email"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={cvForm.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base">Position of Interest <span className="text-red-500">*</span></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-10 md:h-11">
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
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={cvForm.control}
                    name="file"
                    render={({ field: { onChange, ...rest } }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base">Upload CV (PDF, DOC, DOCX) <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <div className="flex flex-col gap-2">
                            <label 
                              htmlFor="cv-file" 
                              className="flex flex-col items-center justify-center w-full h-24 md:h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex flex-col items-center justify-center py-4 md:py-6">
                                <Upload className="text-gray-400 mb-2 h-5 w-5 md:h-6 md:w-6" />
                                <p className="mb-1 text-sm text-gray-500"><span className="font-medium">Click to upload</span> or drag and drop</p>
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
                                <span className="font-medium truncate max-w-[200px] md:max-w-[300px]">{file.name}</span>
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
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button 
                      type="submit"
                      className="bg-secondary hover:bg-orange-700 text-white w-full sm:w-auto"
                      disabled={isCvSubmitting}
                    >
                      {isCvSubmitting ? 'Submitting...' : (
                        <>
                          <span>Submit CV</span>
                          <FileUp className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>

            {/* Contact Information - Desktop version */}
            <div className="hidden md:block bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-xl mb-4">Contact Information</h3>
              <div className="space-y-6">
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="flex items-start hover:translate-x-1 transition-transform">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">Address</h4>
                    <p className="text-gray-600">123 Technology Park, Tunis, Tunisia</p>
                  </div>
                </a>

                <a href="mailto:contact@zbenyasystems.com" className="flex items-start hover:translate-x-1 transition-transform">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">Email</h4>
                    <span className="text-gray-600 hover:text-primary">contact@zbenyasystems.com</span>
                  </div>
                </a>

                <a href="tel:+21612345678" className="flex items-start hover:translate-x-1 transition-transform">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">Phone</h4>
                    <span className="text-gray-600 hover:text-primary">+216 12 345 678</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
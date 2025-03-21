import { Check } from "lucide-react";

export default function About() {
  const features = [
    "Custom Development",
    "Modern Technologies",
    "Client-Focused",
    "Agile Methodology"
  ];

  return (
    <section id="about" className="section py-16 bg-gray-50 scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-bold text-3xl mb-4">About ZbenyaSystems</h2>
          <div className="w-20 h-1 bg-secondary mx-auto mb-6"></div>
          <p className="text-lg max-w-3xl mx-auto">
            Learn about our mission, vision, and the talented team behind our successful software solutions.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-8">
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80" 
              alt="Our team" 
              className="rounded-lg shadow-lg w-full"
              width="600" 
              height="400"
            />
          </div>
          <div className="md:w-1/2">
            <h3 className="font-semibold text-2xl mb-4">Our Story</h3>
            <p className="mb-4">
              Founded in 2018, ZbenyaSystems has been at the forefront of providing innovative software solutions to businesses across various industries. Our team of experienced developers, designers, and project managers work collaboratively to deliver high-quality, scalable, and secure applications.
            </p>
            <p className="mb-6">
              We specialize in custom software development, web and mobile applications, and cutting-edge technologies like AI and machine learning. Our client-focused approach ensures that we deliver solutions that not only meet but exceed expectations.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 text-green-500 flex items-center justify-center mr-3">
                    <Check className="h-3 w-3" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { ArrowRight, Code, Globe, Database, Cog, Brain, Smartphone } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: <Code className="h-8 w-8" />,
      title: "Custom Software Development",
      description: "Tailored solutions designed specifically for your business requirements and processes.",
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Mobile App Development",
      description: "Native and cross-platform mobile applications for iOS and Android platforms.",
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Web Application Development",
      description: "Responsive and dynamic web applications using modern frameworks and technologies.",
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "Database Management",
      description: "Design, implementation, and optimization of database systems for efficient data management.",
    },
    {
      icon: <Cog className="h-8 w-8" />,
      title: "API Development & Integration",
      description: "Seamless integration with third-party services and custom API development.",
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI & Machine Learning",
      description: "Intelligent solutions leveraging artificial intelligence and machine learning technologies.",
    }
  ];

  return (
    <section id="services" className="section py-16 bg-white scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-bold text-3xl mb-4">Our Services</h2>
          <div className="w-20 h-1 bg-secondary mx-auto mb-6"></div>
          <p className="text-lg max-w-3xl mx-auto">
            We offer a comprehensive range of software development services tailored to meet your business needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="text-primary text-3xl mb-4">
                  {service.icon}
                </div>
                <h3 className="font-semibold text-xl mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                <a href="#contact" className="text-secondary hover:text-primary font-medium inline-flex items-center">
                  Learn More
                  <ArrowRight className="h-4 w-4 ml-2" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

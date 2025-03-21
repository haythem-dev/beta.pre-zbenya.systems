import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Freelance() {
  const freelanceServices = [
    {
      title: "Frontend Development",
      description: "Expert frontend developers specializing in React, Angular, Vue.js, and other modern frameworks.",
      skills: ["React", "Angular", "Vue.js"],
      rate: "From $45/hr"
    },
    {
      title: "Backend Development",
      description: "Skilled backend developers with expertise in Node.js, Python, Java, PHP, and more.",
      skills: ["Node.js", "Python", "Java"],
      rate: "From $50/hr"
    },
    {
      title: "UI/UX Design",
      description: "Creative designers who craft intuitive and visually appealing user interfaces and experiences.",
      skills: ["Figma", "Adobe XD", "Sketch"],
      rate: "From $40/hr"
    }
  ];

  return (
    <section id="freelance" className="section py-16 bg-primary text-white scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-bold text-3xl mb-4">Freelance Services</h2>
          <div className="w-20 h-1 bg-secondary mx-auto mb-6"></div>
          <p className="text-lg max-w-3xl mx-auto">
            Need specialized talent for your project? Our network of skilled freelancers can help with short-term or project-based work.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {freelanceServices.map((service, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md rounded-lg shadow-md overflow-hidden hover:bg-white/20 transition-colors">
              <div className="p-6">
                <h3 className="font-semibold text-xl mb-3">{service.title}</h3>
                <p className="text-gray-100 mb-4">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {service.skills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white/20 rounded-full text-sm">{skill}</span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">{service.rate}</span>
                  <Button
                    asChild
                    className="bg-secondary hover:bg-orange-700 text-white"
                    size="sm"
                  >
                    <a href="#contact" className="inline-flex items-center">
                      Hire Now <ArrowRight className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button
            asChild
            variant="outline"
            className="bg-white text-primary hover:bg-gray-100 font-bold py-3 px-8"
          >
            <a href="#contact">Browse All Freelancers</a>
          </Button>
        </div>
      </div>
    </section>
  );
}

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowDown } from "lucide-react";

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    const headerHeight = document.getElementById('header')?.offsetHeight || 0;

    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - headerHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Your Digital Innovation Partner
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              We transform ideas into elegant digital solutions. Let's build something amazing together.
            </p>
          </div>
          <div className="space-x-4">
            <Button onClick={() => window.location.href = '/contact'}>
              Get Started
              <ArrowRight className="h-4 w-4 ml-1 inline-block" />
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/services'}>
              Learn More
              <ArrowDown className="h-4 w-4 ml-1 inline-block" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
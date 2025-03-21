import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowDown } from "lucide-react";

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Optimize performance by lazy loading hero image
  useEffect(() => {
    // Mark as loaded after a small delay to ensure smooth transition
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Smooth scroll function for CTA buttons
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
    <section 
      id="home" 
      className="min-h-[90vh] flex items-center pt-16 pb-12 md:pt-24 md:pb-16 bg-gradient-to-br from-primary to-blue-800 text-white scroll-mt-16 overflow-hidden"
    >
      <div className="container mx-auto">
        {/* Mobile-first layout with reversed order on desktop */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Content - optimized for mobile viewing */}
          <div className="w-full md:w-1/2 order-2 md:order-1 animate-fadeIn">
            <h1 className="font-bold text-3xl sm:text-4xl lg:text-5xl mb-4 md:mb-6 leading-tight">
              Custom Software Solutions <span className="block mt-1">for Your Business</span>
            </h1>
            <p className="text-base md:text-lg mb-6 md:mb-8 text-gray-100 max-w-md">
              We build tailored software applications to streamline your operations and drive your business forward.
            </p>

            {/* Stack buttons vertically on mobile, horizontally on larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
              <Button 
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-white font-semibold px-8 py-4 text-lg shadow-lg hover:scale-105 transition-transform"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Demander un devis
              </Button>
                asChild
                size="lg"
                className="bg-secondary hover:bg-orange-700 text-white font-bold w-full flex items-center justify-center gap-2 transition-all duration-300 transform hover:translate-y-[-2px]"
                onClick={scrollToSection('contact')}
              >
                <a href="#contact">
                  Get in Touch
                  <ArrowRight className="h-4 w-4 ml-1 inline-block" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-transparent hover:bg-white/10 border border-white text-white font-bold w-full flex items-center justify-center gap-2 transition-all"
                onClick={scrollToSection('services')}
              >
                <a href="#services">
                  Our Services
                  <ArrowDown className="h-4 w-4 ml-1 inline-block" />
                </a>
              </Button>
            </div>
          </div>

          {/* Image container with loading optimization */}
          <div 
            className={`w-full md:w-1/2 order-1 md:order-2 transition-opacity duration-700 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="relative overflow-hidden rounded-lg shadow-xl mx-auto transform md:translate-y-0 transition-transform duration-500">
              {/* Responsive image with aspect ratio preservation */}
              <img 
                loading="eager"
                fetchpriority="high"
                src="https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80" 
                alt="Software development illustration" 
                className="w-full h-auto rounded-lg object-cover"
                width="600" 
                height="400"
                srcSet="https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80 400w,
                        https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80 600w"
                sizes="(max-width: 768px) 100vw, 50vw"
                onLoad={() => setIsLoaded(true)}
              />

              {/* Visual enhancement for mobile */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent pointer-events-none md:hidden"></div>
            </div>
          </div>
        </div>

        {/* Scroll indicator - visible only on mobile */}
        <div className="flex justify-center mt-8 md:hidden animate-bounce">
          <ArrowDown className="h-6 w-6 text-white/80" />
        </div>
      </div>
    </section>
  );
}
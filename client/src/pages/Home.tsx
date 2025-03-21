import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Freelance from "@/components/Freelance";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function Home() {
  useEffect(() => {
    // Back to top button functionality
    const toggleBackToTopBtn = () => {
      const backToTopBtn = document.getElementById("backToTop");
      if (backToTopBtn) {
        if (window.scrollY > 300) {
          backToTopBtn.classList.remove("hidden");
        } else {
          backToTopBtn.classList.add("hidden");
        }
      }
    };

    // Navigation highlight on scroll
    const highlightNavLink = () => {
      const scrollY = window.pageYOffset;
      const sections = document.querySelectorAll('section[id]');
      const navLinks = document.querySelectorAll('[data-nav-link]');
      
      sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = (section as HTMLElement).offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('border-secondary');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('border-secondary');
            }
          });
        }
      });
    };

    window.addEventListener('scroll', () => {
      highlightNavLink();
      toggleBackToTopBtn();
    });

    // Initialize on page load
    highlightNavLink();
    toggleBackToTopBtn();

    return () => {
      window.removeEventListener('scroll', () => {
        highlightNavLink();
        toggleBackToTopBtn();
      });
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Header />
      <Hero />
      <About />
      <Services />
      <Freelance />
      <Contact />
      <Footer />
      
      {/* Back to Top Button */}
      <Button 
        id="backToTop" 
        className="fixed bottom-6 right-6 p-3 rounded-full bg-primary text-white shadow-lg hidden hover:bg-blue-700 transition-colors" 
        onClick={scrollToTop}
        size="icon"
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
    </div>
  );
}

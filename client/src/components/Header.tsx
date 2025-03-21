import { useState, useEffect, useRef } from "react";
import { Menu, X, Home, Info, FileText, Briefcase, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const headerRef = useRef<HTMLElement>(null);

  // Preload critical resources and improve loading time
  useEffect(() => {
    // Implement intersection observer to detect active section
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5, // Trigger when 50% of section is visible
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          setActiveSection(id);
        }
      });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section[id]').forEach((section) => {
      sectionObserver.observe(section);
    });

    return () => {
      sectionObserver.disconnect();
    };
  }, []);

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      // Get current header height
      const headerHeight = headerRef.current?.offsetHeight || 0;
      setScrolled(window.scrollY > headerHeight);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Prevent background scrolling when menu is open
    if (!mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  const navLinks = [
    { href: "#home", label: "Home", icon: <Home className="h-4 w-4" /> },
    { href: "#about", label: "About", icon: <Info className="h-4 w-4" /> },
    { href: "#services", label: "Services", icon: <FileText className="h-4 w-4" /> },
    { href: "#freelance", label: "Freelance", icon: <Briefcase className="h-4 w-4" /> },
    { href: "#contact", label: "Contact", icon: <Mail className="h-4 w-4" /> }
  ];

  // Handle navigation click and scroll
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    // Close mobile menu if open
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
      document.body.style.overflow = 'auto';
    }
    
    // Get target element
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // Get header height to offset scroll position
      const headerHeight = headerRef.current?.offsetHeight || 0;
      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
      
      // Smooth scroll to target
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header 
      ref={headerRef}
      id="header" 
      className={`fixed w-full bg-white z-50 transition-all duration-300 ${
        scrolled ? 'shadow-md py-2' : 'py-3'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          {/* Logo - smaller on mobile */}
          <a 
            href="#home" 
            onClick={(e) => handleNavClick(e, "#home")}
            className="text-primary font-bold text-xl md:text-2xl"
          >
            <span className="text-secondary">Zbenya</span>Systems
          </a>
        </div>
        
        {/* Desktop Navigation - horizontal */}
        <nav className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <a 
              key={link.href} 
              href={link.href} 
              onClick={(e) => handleNavClick(e, link.href)}
              className={`font-medium transition-all duration-300 py-2 border-b-2 ${
                activeSection === link.href.substring(1) 
                  ? 'text-secondary border-secondary' 
                  : 'border-transparent hover:text-secondary hover:border-secondary/50'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>
        
        {/* Mobile Navigation Toggle - larger touch target */}
        <Button
          variant="ghost"
          size="sm"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden p-2"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? 
            <X className="h-7 w-7 text-secondary" /> : 
            <Menu className="h-7 w-7" />
          }
        </Button>
      </div>
      
      {/* Mobile Navigation Menu - full screen overlay for better UX */}
      <div 
        className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
        style={{ top: headerRef.current?.offsetHeight || 0 }}
      >
        <nav className="container mx-auto py-4 flex flex-col">
          {navLinks.map((link) => (
            <a 
              key={link.href} 
              href={link.href} 
              className={`flex items-center space-x-3 py-4 px-4 text-lg font-medium border-b border-gray-100 ${
                activeSection === link.href.substring(1) ? 'text-secondary' : ''
              }`}
              onClick={(e) => handleNavClick(e, link.href)}
            >
              <span className="text-primary">{link.icon}</span>
              <span>{link.label}</span>
            </a>
          ))}
          
          {/* Call to action in mobile menu */}
          <div className="mt-6 px-4">
            <Button 
              className="w-full bg-secondary hover:bg-secondary/90 text-white"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                document.body.style.overflow = 'auto';
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Contact Us Now
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}

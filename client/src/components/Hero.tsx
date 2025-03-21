import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section id="home" className="section pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-r from-primary to-blue-800 text-white scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl mb-6">
              Custom Software Solutions for Your Business
            </h1>
            <p className="text-lg mb-8 text-gray-100">
              We build tailored software applications to streamline your operations and drive your business forward.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                asChild
                className="bg-secondary hover:bg-orange-700 text-white font-bold py-3 px-6"
              >
                <a href="#contact">Get in Touch</a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="bg-transparent hover:bg-white/10 border border-white text-white font-bold py-3 px-6"
              >
                <a href="#services">Our Services</a>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80" 
              alt="Software development illustration" 
              className="rounded-lg shadow-xl mx-auto"
              width="600" 
              height="400"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

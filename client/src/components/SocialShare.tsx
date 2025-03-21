
import { Facebook, Twitter, LinkedIn, Instagram } from "lucide-react";
import { Button } from "./ui/button";
import { trackEvent } from "@vercel/analytics/react";

export default function SocialShare() {
  const shareUrl = window.location.href;
  const title = document.title;

  const share = (platform: string) => {
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${title}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${title}`,
      instagram: `https://instagram.com/share?url=${shareUrl}`,
    };
    
    // Track sharing event
    trackEvent('social_share', { platform });
    window.open(urls[platform as keyof typeof urls], '_blank');
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 social-buttons" role="region" aria-label="Social sharing">
      <Button variant="outline" size="icon" onClick={() => share('facebook')} aria-label="Share on Facebook">
        <Facebook className="h-4 w-4 hover:text-blue-600 transition-colors" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => share('twitter')} aria-label="Share on Twitter">
        <Twitter className="h-4 w-4 hover:text-sky-500 transition-colors" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => share('linkedin')} aria-label="Share on LinkedIn">
        <LinkedIn className="h-4 w-4 hover:text-blue-700 transition-colors" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => share('instagram')} aria-label="Share on Instagram">
        <Instagram className="h-4 w-4 hover:text-pink-600 transition-colors" />
      </Button>
    </div>
  );
}

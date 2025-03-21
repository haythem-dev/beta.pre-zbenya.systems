
import { Facebook, Twitter, LinkedIn, Share2 } from "lucide-react";
import { Button } from "./ui/button";

export default function SocialShare() {
  const shareUrl = window.location.href;
  const title = document.title;

  const share = (platform: string) => {
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${title}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${title}`,
    };
    
    window.open(urls[platform as keyof typeof urls], '_blank');
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
      <Button variant="outline" size="icon" onClick={() => share('facebook')}>
        <Facebook className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => share('twitter')}>
        <Twitter className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => share('linkedin')}>
        <LinkedIn className="h-4 w-4" />
      </Button>
    </div>
  );
}


import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";

interface ContentProps {
  section: string;
}

export default function DynamicContent({ section }: ContentProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['content', section],
    queryFn: async () => {
      const response = await fetch(`/api/content/${section}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
    );
  }

  return (
    <div className="prose dark:prose-invert">
      {data?.content}
    </div>
  );
}
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import { Carousel } from "./ui/carousel";
import { useInView } from "react-intersection-observer";

interface ContentProps {
  section: string;
  userType?: 'B2B' | 'B2C';
}

export default function DynamicContent({ section, userType = 'B2B' }: ContentProps) {
  const [ref, inView] = useInView();
  const [hasPlayed, setHasPlayed] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['content', section, userType],
    queryFn: async () => {
      const response = await fetch(`/api/content/${section}?type=${userType}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    }
  });

  useEffect(() => {
    if (inView && !hasPlayed) {
      setHasPlayed(true);
    }
  }, [inView]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
    );
  }

  return (
    <div 
      ref={ref}
      className={`prose dark:prose-invert transform transition-all duration-500 ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      {data?.content}
      {data?.videoUrl && (
        <div className="aspect-video">
          <video
            autoPlay={inView && !hasPlayed}
            muted
            loop
            playsInline
            className="w-full rounded-lg shadow-lg"
          >
            <source src={data.videoUrl} type="video/mp4" />
          </video>
        </div>
      )}
      {data?.carouselItems && (
        <Carousel items={data.carouselItems} />
      )}
    </div>
  );
}

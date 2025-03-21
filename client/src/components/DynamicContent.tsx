
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

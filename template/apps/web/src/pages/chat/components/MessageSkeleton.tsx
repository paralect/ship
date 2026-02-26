import { Skeleton } from '@/components/ui/skeleton';

const MessageSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="max-w-[80%] space-y-2">
          <Skeleton className="ml-auto h-4 w-32" />
          <Skeleton className="h-12 w-64 rounded-2xl" />
        </div>
      </div>

      <div className="flex justify-start">
        <div className="max-w-[80%] space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-32 w-80 rounded-2xl" />
        </div>
      </div>

      <div className="flex justify-end">
        <div className="max-w-[80%] space-y-2">
          <Skeleton className="ml-auto h-4 w-28" />
          <Skeleton className="h-8 w-48 rounded-2xl" />
        </div>
      </div>

      <div className="flex justify-start">
        <div className="max-w-[80%] space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-24 w-72 rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

export default MessageSkeleton;

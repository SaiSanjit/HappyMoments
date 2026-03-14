import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
    return (
        <div className={cn("animate-pulse bg-gray-200 rounded-lg", className)} />
    );
}

export function VendorCardSkeleton() {
    return (
        <div className="flex flex-col gap-3">
            <Skeleton className="aspect-square rounded-xl" />
            <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-10" />
            </div>
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/3 mt-1" />
        </div>
    );
}

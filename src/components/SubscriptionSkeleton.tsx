"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

const SubscriptionSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-2/3" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-1/3" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
};

export default SubscriptionSkeleton;

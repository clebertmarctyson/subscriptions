"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PlusIcon } from "lucide-react";
import { CreateSubscriptionDialog } from "@/components/CreateSubscriptionDialog";
import SubscriptionCard from "@/components/SubscriptionCard";
import SubscriptionSkeleton from "@/components/SubscriptionSkeleton";

import useSubscriptionStore from "@/lib/zustand";

import { Subscription, SubscriptionStatus } from "@/types";

type FilterStatus = "ALL" | SubscriptionStatus;

export default function App() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");
  const { subscriptions, fetchSubscriptions, isLoading } =
    useSubscriptionStore();

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const filteredSubscriptions = subscriptions?.filter(
    (subscription: Subscription) =>
      filterStatus === "ALL"
        ? true
        : subscription.status === (filterStatus as SubscriptionStatus)
  );

  const totalMonthlyCost = filteredSubscriptions?.reduce(
    (total: number, subscription: Subscription) =>
      total + Number(subscription.price),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br p-4 sm:p-8">
      <div className="flex flex-col items-center sm:flex-row justify-between my-16 gap-4">
        <CreateSubscriptionDialog>
          <Button variant="secondary" className="w-full sm:w-auto mb-4 sm:mb-0">
            <PlusIcon className="h-5 w-5 mr-2" />
            <span>Add Subscription</span>
          </Button>
        </CreateSubscriptionDialog>

        <div className="backdrop-blur-sm rounded-lg px-4 py-2 text-right">
          <span className="text-lg font-semibold mr-2">
            Total Monthly Cost:
          </span>
          <span className="text-2xl font-bold">
            ${totalMonthlyCost?.toFixed(2)}
          </span>
        </div>

        <Select
          value={filterStatus}
          onValueChange={(value: FilterStatus) => setFilterStatus(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Subscriptions</SelectItem>
            <SelectItem value={SubscriptionStatus.ACTIVE}>Active</SelectItem>
            <SelectItem value={SubscriptionStatus.INACTIVE}>
              Inactive
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          [...Array(3)].map((_, index) => <SubscriptionSkeleton key={index} />)
        ) : filteredSubscriptions?.length === 0 ? (
          <div className="col-span-full text-center">
            No subscriptions found
          </div>
        ) : (
          filteredSubscriptions?.map((subscription: Subscription) => (
            <SubscriptionCard
              key={subscription?.id}
              subscription={subscription}
            />
          ))
        )}
      </div>
    </div>
  );
}

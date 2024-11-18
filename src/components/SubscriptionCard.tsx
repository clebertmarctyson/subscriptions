"use client";

import { formatISO } from "date-fns";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { CalendarIcon, CreditCardIcon, Settings } from "lucide-react";

import { Subscription, SubscriptionStatus } from "@/types";

import EditSubscriptionDialog from "@/components/EditSubscriptionDialog";

import useSubscriptionStore from "@/lib/zustand";

type SubscriptionCardProps = {
  subscription: Subscription;
};

const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => {
  const { removeSubscription } = useSubscriptionStore();

  return (
    <Card
      className={`backdrop-blur-sm flex flex-col transition-all duration-300 hover:shadow-lg ${
        subscription?.status === "ACTIVE" && "border-l-2 border-green-500"
      }`}
    >
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">
            {subscription.name}
          </CardTitle>
          <Badge
            variant={
              subscription.status === SubscriptionStatus.ACTIVE
                ? "default"
                : "secondary"
            }
          >
            {subscription.status}
          </Badge>
        </div>
        <p className="text-2xl font-bold mt-2">
          ${Number(subscription.price).toFixed(2)}/month
        </p>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <div className="flex items-center text-sm">
          <CalendarIcon className="mr-2 h-4 w-4" />
          Next payment: {subscription.paymentDate.split("T")[0]}
        </div>
        <div className="flex items-center text-sm">
          <CreditCardIcon className="mr-2 h-4 w-4" />
          Auto-renew{" "}
          {subscription.status === SubscriptionStatus.ACTIVE
            ? "enabled"
            : "disabled"}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between space-x-2">
        <EditSubscriptionDialog subscription={subscription}>
          <Button variant="default" className="flex-1">
            <Settings className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </EditSubscriptionDialog>
        <Button
          variant="secondary"
          onClick={() =>
            subscription.cancelUrl &&
            window.open(subscription.cancelUrl, "_blank")
          }
          className="flex-1"
          disabled={!subscription.cancelUrl}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={() => removeSubscription(subscription?.id as string)}
        >
          Remove
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionCard;

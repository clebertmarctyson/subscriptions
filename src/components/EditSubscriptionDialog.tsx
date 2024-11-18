"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SubscriptionStatus, Subscription } from "@/types";
import useSubscriptionStore from "@/lib/zustand";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().positive("Price must be positive").min(0.01),
  paymentDate: z.string().optional(),
  status: z.enum([SubscriptionStatus.ACTIVE, SubscriptionStatus.INACTIVE]),
  cancelUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

type EditSubscriptionDialogProps = {
  children: React.ReactNode;
  subscription: Subscription;
};

const EditSubscriptionDialog = ({
  children,
  subscription,
}: EditSubscriptionDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateSubscription, subscriptions } = useSubscriptionStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: subscription.name,
      price: subscription.price,
      paymentDate: subscription.paymentDate,
      status: subscription.status,
      cancelUrl: subscription.cancelUrl || "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);

      const existingSubscription = subscriptions.find(
        (sub) =>
          sub.name.toLowerCase() === data.name.toLowerCase() &&
          sub.id !== subscription.id
      );

      if (existingSubscription) {
        toast({
          title: "Subscription already exists",
          description: "Please use a different name",
          variant: "destructive",
        });
        return;
      }

      const updatedSubscription = {
        ...subscription,
        ...data,
        paymentDate: data.paymentDate || new Date().toISOString().split("T")[0],
        price: Number(data.price),
      };

      await updateSubscription(updatedSubscription);

      toast({
        title: "Success",
        description: "Subscription updated successfully",
      });

      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update subscription",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Edit Subscription
          </DialogTitle>
          <DialogDescription>
            Make changes to your subscription here.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Date</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={SubscriptionStatus.ACTIVE}>
                        Active
                      </SelectItem>
                      <SelectItem value={SubscriptionStatus.INACTIVE}>
                        Inactive
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cancelUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cancel URL (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Subscription"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSubscriptionDialog;

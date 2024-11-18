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

type CreateSubscriptionDialogProps = {
  children: React.ReactNode;
};

export const CreateSubscriptionDialog = ({
  children,
}: CreateSubscriptionDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addSubscription, subscriptions } = useSubscriptionStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      paymentDate: "",
      status: SubscriptionStatus.ACTIVE,
      cancelUrl: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);

      const existingSubscription = subscriptions.find(
        (sub) => sub.name.toLowerCase() === data.name.toLowerCase()
      );

      if (existingSubscription) {
        toast({
          title: "Subscription already exists",
          description: "Please use a different name",
          variant: "destructive",
        });
        return;
      }

      const newSubscription: Omit<Subscription, "id" | "userId"> = {
        ...data,
        paymentDate: data.paymentDate as string,
        price: Number(data.price),
      };

      await addSubscription(newSubscription);

      toast({
        title: "Success",
        description: "Subscription created successfully",
      });

      setOpen(false);
      form.reset({
        name: "",
        price: 0,
        paymentDate: new Date().toISOString().split("T")[0],
        status: SubscriptionStatus.ACTIVE,
        cancelUrl: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create subscription",
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
            Add New Subscription
          </DialogTitle>
          <DialogDescription>
            Add a new subscription to track your payments.
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
                      {...form.register("price", {
                        valueAsNumber: true,
                      })}
                      type="number"
                      step="0.01"
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
              {isSubmitting ? "Creating..." : "Create Subscription"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

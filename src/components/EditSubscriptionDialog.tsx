"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(1, "Price must be greater than 0"),
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
  const { updateSubscription } = useSubscriptionStore();

  const [open, setOpen] = useState(false);

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

  const onSubmit = (data: FormValues) => {
    updateSubscription({ ...subscription, ...data });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-indigo-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Edit Subscription
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-indigo-200">Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-indigo-800/50 text-white border-indigo-700"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={() => (
                <FormItem>
                  <FormLabel className="text-indigo-200">Price</FormLabel>
                  <FormControl>
                    <Input
                      {...form.register("price", { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      className="bg-indigo-800/50 text-white border-indigo-700"
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
                  <FormLabel className="text-indigo-200">
                    Payment Date
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      className="bg-indigo-800/50 text-white border-indigo-700"
                    />
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
                  <FormLabel className="text-indigo-200">Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-indigo-800/50 text-white border-indigo-700">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-indigo-900 text-white">
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
                  <FormLabel className="text-indigo-200">
                    Cancel URL (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-indigo-800/50 text-white border-indigo-700"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Update Subscription
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSubscriptionDialog;

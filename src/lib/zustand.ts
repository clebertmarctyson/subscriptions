import { create } from "zustand";
import { Subscription } from "@/types";

interface SubscriptionStore {
  subscriptions: Subscription[];
  subscription: Subscription | null;
  isLoading: boolean;
  fetchSubscriptions: () => Promise<void>;
  addSubscription: (
    subscription: Omit<Subscription, "id" | "userId">
  ) => Promise<void>;
  setSubscription: (subscription: Subscription | null) => void;
  updateSubscription: (subscription: Subscription) => Promise<void>;
  removeSubscription: (id: string) => Promise<void>;
}

const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  subscriptions: [],
  subscription: null,
  isLoading: false,

  fetchSubscriptions: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/subscriptions");
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch subscriptions");
      }
      const data = await response.json();
      set({ subscriptions: data });
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  setSubscription: (subscription) => {
    set({ subscription });
  },

  addSubscription: async (subscription) => {
    try {
      const formattedSubscription = {
        ...subscription,
        paymentDate: subscription.paymentDate
          ? new Date(subscription.paymentDate)
          : new Date(),
        price: Number(subscription.price),
      };

      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedSubscription),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add subscription");
      }

      const newSubscription = await response.json();
      set((state) => ({
        subscriptions: [...state.subscriptions, newSubscription],
      }));
    } catch (error) {
      console.error("Error adding subscription:", error);
      throw error;
    }
  },

  updateSubscription: async (subscription) => {
    try {
      const formattedSubscription = {
        ...subscription,
        paymentDate: subscription.paymentDate
          ? new Date(subscription.paymentDate)
          : new Date().toLocaleDateString("en-CA"),
        price: Number(subscription.price),
      };

      const response = await fetch(`/api/subscriptions/${subscription.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedSubscription),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update subscription");
      }

      const updatedSubscription = await response.json();
      set((state) => ({
        subscriptions: state.subscriptions.map((sub) =>
          sub.id === subscription.id ? updatedSubscription : sub
        ),
      }));

      return updatedSubscription;
    } catch (error) {
      console.error("Error updating subscription:", error);
      throw error;
    }
  },

  removeSubscription: async (id) => {
    try {
      const response = await fetch(`/api/subscriptions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete subscription");
      }

      set((state) => ({
        subscriptions: state.subscriptions.filter((sub) => sub.id !== id),
      }));
    } catch (error) {
      console.error("Error removing subscription:", error);
      throw error;
    }
  },
}));

export default useSubscriptionStore;

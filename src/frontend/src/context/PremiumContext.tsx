import { loadStripe } from "@stripe/stripe-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

const STORAGE_KEY = "luxpdf_subscription";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

export interface SubscriptionData {
  email: string;
  trialStartedAt: number;
  trialEndsAt: number;
  status: "trialing" | "active" | "canceled";
  sessionId?: string;
}

interface PremiumContextType {
  subscription: SubscriptionData | null;
  isPremium: boolean;
  isTrialing: boolean;
  daysLeftInTrial: number;
  startTrial: (email: string) => void;
  createSubscription: (email: string) => Promise<{ clientSecret: string; subscriptionId: string }>;
  cancelTrial: () => void;
  restoreAccess: (email: string) => boolean;
}

const PremiumContext = createContext<PremiumContextType>({
  subscription: null,
  isPremium: false,
  isTrialing: false,
  daysLeftInTrial: 0,
  startTrial: () => { },
  createSubscription: async () => ({ clientSecret: "", subscriptionId: "" }),
  cancelTrial: () => { },
  restoreAccess: () => false,
});

function loadSubscription(): SubscriptionData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SubscriptionData;
  } catch {
    return null;
  }
}

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(
    loadSubscription,
  );

  // Check URL parameters for successful Stripe checkout
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const sessionId = query.get('session_id');
    const emailParam = query.get('email');

    if (sessionId) {
      if (sessionId === 'embedded_success') {
        const userEmail = emailParam || "premium_user@example.com";
        // Handle success from embedded PaymentElement
        const data: SubscriptionData = {
          email: userEmail, // Uses the real email passed through return_url
          trialStartedAt: Date.now(),
          trialEndsAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
          status: "trialing",
          sessionId,
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setSubscription(data);
        toast.success("Signature Trial Activated! Enjoy Premium features.");

        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        // Handle legacy redirect success
        const verifySession = async () => {
          try {
            const data: SubscriptionData = {
              email: "premium_user@example.com",
              trialStartedAt: Date.now(),
              trialEndsAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
              status: "trialing",
              sessionId,
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            setSubscription(data);
            toast.success("Signature Trial Activated! Enjoy Premium features.");

            window.history.replaceState({}, document.title, window.location.pathname);
          } catch (err) {
            console.error("Session verification failed:", err);
            toast.error("Could not verify your subscription. Please contact support.");
          }
        };

        verifySession();
      }
    }
  }, []);

  // Re-check every minute so expiry is reflected without reload
  useEffect(() => {
    const id = setInterval(() => {
      setSubscription(loadSubscription());
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  const isTrialing =
    subscription?.status === "trialing" &&
    (subscription?.trialEndsAt ?? 0) > Date.now();
  const isPremium = isTrialing || subscription?.status === "active";
  const daysLeftInTrial = isTrialing
    ? Math.max(
      0,
      Math.ceil(
        ((subscription?.trialEndsAt ?? 0) - Date.now()) /
        (1000 * 60 * 60 * 24),
      ),
    )
    : 0;

  const startTrial = useCallback(async (email: string) => {
    // Legacy redirect flow - kept for fallback
    try {
      const res = await fetch(`${API_URL}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || 'Failed to initialize secure checkout.');
        throw new Error(data.error || 'Failed to initialize secure checkout.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred. Please try again later.');
    }
  }, []);

  const createSubscription = useCallback(async (email: string) => {
    const res = await fetch(`${API_URL}/create-subscription`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create subscription");
    return data;
  }, []);

  const cancelTrial = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSubscription(null);
  }, []);

  const restoreAccess = useCallback((email: string): boolean => {
    const stored = loadSubscription();
    if (stored && stored.email.toLowerCase() === email.toLowerCase()) {
      setSubscription(stored);
      return true;
    }
    return false;
  }, []);

  return (
    <PremiumContext.Provider
      value={{
        subscription,
        isPremium,
        isTrialing,
        daysLeftInTrial,
        startTrial,
        createSubscription,
        cancelTrial,
        restoreAccess,
      }}
    >
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  return useContext(PremiumContext);
}

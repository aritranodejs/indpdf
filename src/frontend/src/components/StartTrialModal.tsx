import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Check, Crown, Lock } from "lucide-react";
import { useState } from "react";
import { usePremium } from "../context/PremiumContext";

interface StartTrialModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// In a real app, this key would come from env. Loading here for simplicity.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_TYooMQauvdEDq54NiTphI7jx");

function CheckoutForm({
  onSuccess,
  clientSecret,
  email,
}: {
  onSuccess: () => void;
  clientSecret: string;
  email: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const trialEndDate = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000,
  ).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const confirmFn = clientSecret.startsWith("seti_")
      ? stripe.confirmSetup
      : stripe.confirmPayment;

    const { error } = await confirmFn({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/?session_id=embedded_success&email=${encodeURIComponent(email)}`,
      },
    });

    if (error) {
      setErrorMessage(error.message || "An unexpected error occurred.");
    } else {
      // The return_url handles success state in PremiumContext
      onSuccess();
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {errorMessage && (
        <div className="text-xs text-destructive">{errorMessage}</div>
      )}
      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full rounded-xl bg-gradient-to-r from-crimson-dark via-crimson to-crimson-light py-7 text-sm font-black uppercase tracking-[0.2em] text-background shadow-crimson transition-all hover:shadow-crimson-sm disabled:opacity-50"
      >
        {isLoading ? "Processing..." : "Start 7-Day Free Trial"}
      </Button>
      <p className="text-center text-[10px] text-muted-foreground/60">
        No charge until {trialEndDate}. Cancel anytime before trial ends.
      </p>
    </form>
  );
}

export function StartTrialModal({
  open,
  onClose,
  onSuccess,
}: StartTrialModalProps) {
  const { createSubscription } = usePremium();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const handleEmailSubmit = async () => {
    if (!email.trim() || !email.includes("@")) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setIsLoading(true);
    try {
      const data = await createSubscription(email.trim());
      setClientSecret(data.clientSecret);
    } catch (err: any) {
      setEmailError(err.message || "Failed to initialize secure checkout.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setClientSecret("");
    setEmail("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        data-ocid="trial.dialog"
        className="max-w-md max-h-[90vh] overflow-y-auto border-crimson/20 bg-card p-0 text-foreground shadow-crimson-sm"
      >
        <div className="rounded-t-lg bg-gradient-to-r from-crimson-dark via-crimson to-crimson-light px-6 py-5">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/20">
                <Crown className="h-5 w-5 text-background" />
              </div>
              <div>
                <DialogTitle className="text-lg font-black text-background">
                  Start Your Free Trial
                </DialogTitle>
                <p className="text-xs font-medium text-background/80">
                  7 days free, then $9.99/month. Cancel anytime.
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="space-y-5 px-6 pb-6 pt-5">
          {!clientSecret ? (
            <>
              <div className="rounded-xl border border-crimson/20 bg-crimson/5 p-4 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-crimson/20">
                    <Check className="h-2.5 w-2.5 text-crimson" />
                  </div>
                  <span className="text-xs text-muted-foreground">7 days completely free</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-crimson/20">
                    <Check className="h-2.5 w-2.5 text-crimson" />
                  </div>
                  <span className="text-xs text-muted-foreground">Full access to all premium tools</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="trial-email"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Email Address
                </label>
                <Input
                  id="trial-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  className="border-border/60 bg-background/50 focus-visible:border-crimson/40 focus-visible:ring-crimson/20"
                />
                {emailError && (
                  <p className="text-xs text-destructive">{emailError}</p>
                )}
              </div>

              <Button
                type="button"
                className="w-full rounded-xl bg-gradient-to-r from-crimson-dark via-crimson to-crimson-light py-7 text-sm font-black uppercase tracking-[0.2em] text-background shadow-crimson transition-all hover:shadow-crimson-sm disabled:opacity-50"
                onClick={handleEmailSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Loading Secure Checkout..." : "Continue to Payment →"}
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-start gap-3 rounded-xl border border-crimson/20 bg-crimson/5 p-4 mb-4">
                <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-crimson/20">
                  <Lock className="h-3 w-3 text-crimson" />
                </div>
                <div className="flex-1">
                  <p className="text-xs leading-relaxed text-muted-foreground mb-2">
                    Complete your trial activation. Secure payment powered by <span className="text-foreground font-bold">Stripe</span>.
                  </p>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
                    alt="Stripe"
                    className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all"
                  />
                </div>
              </div>
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'night',
                    variables: { colorPrimary: '#e11d48', colorBackground: '#1e0a0f', colorText: '#fafafa' }
                  }
                }}
              >
                <CheckoutForm onSuccess={() => {
                  setClientSecret("");
                  if (onSuccess) onSuccess();
                  onClose();
                }} clientSecret={clientSecret} email={email} />
              </Elements>
            </>
          )}

          <button
            type="button"
            onClick={handleClose}
            className="w-full text-center text-xs text-muted-foreground/50 transition hover:text-muted-foreground"
          >
            Maybe later
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

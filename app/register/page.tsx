"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  Mail,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Store,
  WalletCards,
} from "lucide-react";

import Stepper, { Step } from "@/components/Stepper";
import Image from "next/image";
import Script from "next/script";
import { useRouter } from "next/navigation";
import Link from "next/link";

const BUSINESS_TYPES = [
  { value: "RESTAURANT", label: "Restaurant" },
  { value: "CAFE", label: "Cafe" },
  { value: "QSR", label: "Quick-service restaurant" },
  { value: "CLOUD_KITCHEN", label: "Cloud kitchen" },
  { value: "BAKERY", label: "Bakery" },
  { value: "FOOD_TRUCK", label: "Food truck" },
  { value: "OTHER", label: "Other" },
] as const;

const OPERATING_MODES = [
  { value: "DINE_IN", label: "Dine-in" },
  { value: "TAKEAWAY", label: "Takeaway" },
  { value: "DELIVERY_ONLY", label: "Delivery only" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "OTHER", label: "Other" },
] as const;

type FormErrors = {
  email?: string;
  password?: string;
  otp?: string;
  businessName?: string;
  businessType?: string;
  legalName?: string;
  outletName?: string;
  operatingMode?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  plan?: string;
};

type BusinessForm = {
  name: string;
  slug: string;
  businessType: (typeof BUSINESS_TYPES)[number]["value"] | "";
  legalName: string;
  gstin: string;
  firstLocation: {
    name: string;
    slug: string;
    operatingMode: (typeof OPERATING_MODES)[number]["value"] | "";
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
  };
};

type PaymentState = "ready" | "provisioning" | "failed";

type BackendPlanPrice = {
  id: string;
  amountMinor: number;
  currency: string;
  interval: "MONTH" | "YEAR";
  unit: "BUSINESS" | "LOCATION";
  priceType: "FIXED" | "STARTING_AT";
};

type BackendPlan = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  entitlements: { key: string; value: string }[];
  prices: BackendPlanPrice[];
};

declare global {
  interface Window {
    Razorpay?: new (options: {
      key: string;
      amount: number;
      currency: string;
      name: string;
      description: string;
      order_id: string;
      handler: (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => void;
      modal: { ondismiss: () => void };
    }) => { open: () => void };
  }
}

const initialBusiness: BusinessForm = {
  name: "",
  slug: "",
  businessType: "",
  legalName: "",
  gstin: "",
  firstLocation: {
    name: "",
    slug: "",
    operatingMode: "",
    addressLine1: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
  },
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatEntitlement(key: string, value: string) {
  const labels: Record<string, string> = {
    maxLocations: "Restaurant locations",
    maxReviewCards: "Google review cards",
    digitalQrMenu: "Digital QR menu",
    tableOrdering: "Table ordering",
    directCounterBilling: "Counter billing",
    whatsappBills: "WhatsApp bills",
    basicSalesReports: "Basic sales reports",
    aggregatorHub: "Delivery app orders in one place",
    unifiedKitchenDisplay: "Unified kitchen display",
    globalMenuKillSwitch: "Update menus across locations",
    recipeInventory: "Recipe and ingredient tracking",
    multiBusinessManagement: "Multiple business management",
    multiBrandManagement: "Multiple brand management",
    advancedRbac: "Team access controls",
    franchiseRoyaltyCalculations: "Franchise fee tracking",
    settlementReconciliation: "Delivery payout matching",
    centralRollups: "Central sales reports",
    dedicatedAccountManager: "Dedicated account manager",
    prioritySupport: "Priority support",
  };
  const label = labels[key] ?? key.replace(/([A-Z])/g, " $1");
  if (value === "true") return label;
  if (key === "maxLocations") {
    return value === "unlimited"
      ? "Unlimited restaurant locations"
      : `Up to ${value} restaurant locations`;
  }
  if (key === "maxReviewCards") return `${value} Google review cards`;
  return `${label}: ${value}`;
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [business, setBusiness] = useState<BusinessForm>(initialBusiness);
  const [selectedPlan, setSelectedPlan] = useState("growth");
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [resendIn, setResendIn] = useState(0);
  const [resent, setResent] = useState(false);
  const [paymentState, setPaymentState] = useState<PaymentState>("ready");
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [backendPlans, setBackendPlans] = useState<BackendPlan[]>([]);
  const [isRazorpayReady, setIsRazorpayReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);

  useEffect(() => {
    if (!resendIn) return;
    const timer = window.setInterval(
      () => setResendIn((current) => Math.max(0, current - 1)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [resendIn]);

  useEffect(() => {
    let mounted = true;

    async function loadPlans() {
      try {
        const response = await fetch("/api/plans");
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result?.error?.message || "Unable to load plans.");
        }
        if (mounted) setBackendPlans(result.data);
      } catch (error) {
        if (mounted) {
          setBackendError(
            error instanceof Error ? error.message : "Unable to load plans.",
          );
        }
      }
    }

    void loadPlans();
    return () => {
      mounted = false;
    };
  }, []);

  const passwordChecks = useMemo(
    () => [
      { label: "At least 8 characters", valid: password.length >= 8 },
      { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
      { label: "One number", valid: /\d/.test(password) },
    ],
    [password],
  );

  const activeBackendPlan = backendPlans.find((plan) => plan.slug === selectedPlan);
  const activePlan = activeBackendPlan;
  const activeBackendPrice = activeBackendPlan?.prices.find(
    (price) =>
      price.interval === (billingInterval === "monthly" ? "MONTH" : "YEAR"),
  );
  const activePlanAmount = activeBackendPrice?.amountMinor
    ? activeBackendPrice.amountMinor / 100
    : 0;
  const activePlanPriceId = activeBackendPrice?.id ?? "";

  const updateBusiness = <K extends keyof BusinessForm>(
    field: K,
    value: BusinessForm[K],
  ) => {
    setBusiness((current) => ({ ...current, [field]: value }));
  };

  const updateLocation = <K extends keyof BusinessForm["firstLocation"]>(
    field: K,
    value: BusinessForm["firstLocation"][K],
  ) => {
    setBusiness((current) => ({
      ...current,
      firstLocation: { ...current.firstLocation, [field]: value },
    }));
  };

  const validateAccount = () => {
    const nextErrors: FormErrors = {};
    if (!email.trim()) nextErrors.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      nextErrors.email = "Enter a valid email address.";
    if (!password) nextErrors.password = "Create a password to continue.";
    else if (passwordChecks.some((check) => !check.valid))
      nextErrors.password = "Use all three password requirements.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateOtp = () => {
    const nextErrors: FormErrors = {};
    if (!/^\d{6}$/.test(otp))
      nextErrors.otp = "Enter the 6-digit verification code.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateBusiness = () => {
    const nextErrors: FormErrors = {};
    if (business.name.trim().length < 2)
      nextErrors.businessName = "Add your business name.";
    if (!business.businessType)
      nextErrors.businessType = "Choose the business type.";
    if (business.firstLocation.name.trim().length < 2)
      nextErrors.outletName = "Add your first outlet name.";
    if (!business.firstLocation.operatingMode)
      nextErrors.operatingMode = "Choose how you operate.";
    if (business.firstLocation.addressLine1.trim().length < 3)
      nextErrors.addressLine1 = "Add the outlet address.";
    if (business.firstLocation.city.trim().length < 2)
      nextErrors.city = "Add the city.";
    if (business.firstLocation.state.trim().length < 2)
      nextErrors.state = "Add the state.";
    if (!/^[1-9][0-9]{5}$/.test(business.firstLocation.postalCode))
      nextErrors.postalCode = "Enter a valid 6-digit PIN code.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validatePlan = () => {
    const nextErrors: FormErrors = {};
    if (!activePlanPriceId)
      nextErrors.plan = "Plans are still loading. Please try again shortly.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleStepChange = async (nextStep: number) => {
    if (isSubmitting) return;
    if (nextStep < step) {
      setErrors({});
      setStep(nextStep);
      return;
    }
    if (nextStep === 2 && step === 1 && validateAccount()) {
      setIsSubmitting(true);
      setBackendError(null);
      try {
        const response = await fetch("/api/auth/register/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), password }),
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result?.error?.message || "Unable to start registration.");
        }
        setChallengeId(result.data.challengeId);
        setResendIn(60);
        setErrors({});
        setStep(2);
      } catch (error) {
        setBackendError(
          error instanceof Error ? error.message : "Unable to start registration.",
        );
      } finally {
        setIsSubmitting(false);
      }
    } else if (nextStep === 3 && step === 2 && validateOtp()) {
      if (!challengeId) {
        setBackendError("Your verification session expired. Please start again.");
        setStep(1);
        return;
      }
      setIsSubmitting(true);
      setBackendError(null);
      try {
        const response = await fetch("/api/auth/register/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ challengeId, code: otp }),
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result?.error?.message || "That verification code is not valid.");
        }
        setErrors({});
        setStep(3);
      } catch (error) {
        setErrors({
          otp: error instanceof Error ? error.message : "Verification failed.",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else if (nextStep === 4 && step === 3 && validateBusiness()) {
      setErrors({});
      setStep(4);
    } else if (nextStep === 5 && step === 4 && validatePlan()) {
      setErrors({});
      setStep(5);
    }
  };

  const handleReviewComplete = async () => {
    if (isSubmitting) return;
    if (!validatePlan()) return;
    setIsSubmitting(true);
    setBackendError(null);
    try {
      const response = await fetch("/api/onboarding/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(businessPayloadPreview),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result?.error?.message || "Unable to save your business details.");
      }

      const planResponse = await fetch(
        `/api/onboarding/drafts/${result.data.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planPriceId: activePlanPriceId }),
        },
      );
      const planResult = await planResponse.json();
      if (!planResponse.ok || !planResult.success) {
        throw new Error(planResult?.error?.message || "Unable to save your plan.");
      }

      setDraftId(result.data.id);
      setPaymentState("ready");
      setStep(6);
    } catch (error) {
      setBackendError(
        error instanceof Error ? error.message : "Unable to save onboarding.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendIn || isSubmitting) return;
    if (!challengeId) return;
    setIsSubmitting(true);
    setBackendError(null);
    try {
      const response = await fetch("/api/auth/register/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result?.error?.message || "Unable to resend the code.");
      }
      setChallengeId(result.data.challengeId);
      setResent(true);
      setResendIn(60);
      window.setTimeout(() => setResent(false), 2500);
    } catch (error) {
      setBackendError(
        error instanceof Error ? error.message : "Unable to resend the code.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckout = async () => {
    if (isSubmitting) return;
    if (!draftId) return;
    if (!window.Razorpay || !isRazorpayReady) {
      setBackendError("Payment checkout is still loading. Please try again.");
      return;
    }

    setIsSubmitting(true);
    setBackendError(null);
    try {
      const response = await fetch(`/api/onboarding/drafts/${draftId}/checkout`, {
        method: "POST",
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result?.error?.message || "Unable to start payment.");
      }

      const razorpay = new window.Razorpay({
        key: result.data.keyId,
        amount: result.data.amountMinor,
        currency: result.data.currency,
        name: "Urban Kitchen",
        description: "Restaurant onboarding",
        order_id: result.data.orderId,
        handler: (response) => {
          void confirmPaymentAndFinalize(draftId, response);
        },
        modal: { ondismiss: () => setIsSubmitting(false) },
      });

      razorpay.open();
    } catch (error) {
      setPaymentState("failed");
      setBackendError(
        error instanceof Error ? error.message : "Unable to start payment.",
      );
      setIsSubmitting(false);
    }
  };

  const confirmPaymentAndFinalize = async (
    onboardingDraftId: string,
    response: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    },
  ) => {
    try {
      const confirmation = await fetch(
        `/api/onboarding/drafts/${onboardingDraftId}/confirm-payment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          }),
        },
      );
      const result = await confirmation.json();
      if (!confirmation.ok || !result.success) {
        throw new Error(result?.error?.message || "Payment confirmation is pending.");
      }
      setPaymentState("provisioning");
      setIsSubmitting(false);
      await waitForFinalization(onboardingDraftId);
    } catch (error) {
      setPaymentState("failed");
      setBackendError(
        error instanceof Error
          ? error.message
          : "Payment confirmation is pending.",
      );
      setIsSubmitting(false);
    }
  };

  const waitForFinalization = async (onboardingDraftId: string) => {
    try {
      for (let attempt = 0; attempt < 15; attempt += 1) {
        await new Promise((resolve) => window.setTimeout(resolve, 2000));
        const response = await fetch(
          `/api/onboarding/drafts/${onboardingDraftId}/finalize`,
          { method: "POST" },
        );
        const result = await response.json();
        if (response.ok && result.success) {
          router.push("/dashboard");
          return;
        }
        if (response.status !== 409) break;
      }
    } catch {
      setBackendError(
        "Payment was received, but we could not confirm activation yet. Please refresh in a moment.",
      );
      return;
    }
    setBackendError(
      "Payment was received. Your workspace will be activated after secure payment confirmation.",
    );
  };

  const businessPayloadPreview = {
    name: business.name,
    slug: business.slug || slugify(business.name),
    businessType: business.businessType,
    legalName: business.legalName || undefined,
    gstin: business.gstin || undefined,
    firstLocation: {
      ...business.firstLocation,
      slug:
        business.firstLocation.slug || slugify(business.firstLocation.name),
    },
  };
  const onboardingDraftPreview = {
    ...businessPayloadPreview,
    planPriceId: activePlanPriceId,
  };

  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-slate-200 text-white lg:h-dvh lg:overflow-hidden">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setIsRazorpayReady(true)}
      />
      <div className="relative mx-auto flex min-h-dvh w-full lg:h-dvh">
        <div className="grid min-h-dvh w-full overflow-hidden bg-white shadow-2xl shadow-slate-900/15 lg:h-dvh lg:min-h-0 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="relative hidden space-y-4 h-dvh min-h-0 flex-col justify-between overflow-hidden bg-[#111827] p-10 lg:flex xl:p-14">
            <div className="relative">
              <div className="mb-10 flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-amber-400 text-[#16120b]">
                  <Image src="/Icon/apple-touch-icon.png" alt="Urban Kitchen Logo" width={40} height={40} />
                </div>
                <span className="text-lg font-semibold tracking-tight">
                  Urban Kitchen
                </span>
              </div>
              <p className="mb-5 max-w-sm text-sm font-medium uppercase tracking-[0.22em] text-amber-300/80">
                Build what matters
              </p>
              <h1 className="max-w-md text-4xl font-semibold leading-[1.08] tracking-tight text-white xl:text-[2.75rem]">
                Your next chapter starts with a clearer view.
              </h1>
              <p className="mt-6 max-w-md text-base leading-7 text-slate-300">
                Bring your operations, customers, and momentum into one calm,
                intelligent workspace.
              </p>
            </div>
            <div className="relative space-y-4">
              {[
                [
                  "01",
                  "One workspace",
                  "Everything your team needs, without the noise.",
                ],
                [
                  "02",
                  "Built for momentum",
                  "Simple tools that help good decisions happen faster.",
                ],
                [
                  "03",
                  "Ready to scale",
                  "Start focused and upgrade as your business grows.",
                ],
              ].map(([number, title, description]) => (
                <div
                  key={number}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-white/4 p-4 transition-colors hover:border-white/15 hover:bg-white/6"
                >
                  <span className="font-mono text-xs text-amber-300/80">
                    {number}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="mt-1 text-sm leading-5 text-slate-400">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
              <p className="pt-3 text-xs text-slate-500">
                Trusted by ambitious teams building for the long term.
              </p>
            </div>
          </section>

          <section className="flex min-h-190 flex-col justify-center overflow-y-auto bg-[#f8fafc] px-5 py-10 text-slate-950 scrollbar-gutter-stable sm:px-10 sm:py-12 xl:px-16 lg:h-dvh lg:min-h-0 lg:justify-start lg:py-14">
            <div className="mx-auto w-full max-w-140 pb-12 lg:pb-16">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="grid size-9 place-items-center rounded-lg bg-amber-400 text-[#16120b]">
                    <Sparkles size={18} />
                  </div>
                  <span className="font-semibold">Urban Kitchen</span>
                </div>
                <span className="text-xs text-slate-500">
                  Already a member?{" "}
                  <Link href="/login">
                    <span className="font-semibold text-slate-800">Sign in</span>
                  </Link>
                </span>
              </div>

              <div className="mb-6">
                <p className="mb-3 text-sm font-semibold text-amber-600">
                  {step >= 3 ? "Set up your workspace" : "Start your journey"}
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.15rem]">
                  {step >= 3 ? "Make it yours" : "Create your account"}
                </h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
                  {step >= 3
                    ? "Tell us a little about your business, then choose the plan that fits your next stage."
                    : "A couple of quick steps and you'll be ready to make more room for the work that matters."}
                </p>
              </div>

              {backendError && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">
                  {backendError}
                </div>
              )}

              <Stepper
                step={step}
                initialStep={1}
                onStepChange={handleStepChange}
                onFinalStepCompleted={handleReviewComplete}
                indicator="numbers"
                linear
                theme="light"
                frame={false}
                radius={18}
                width="100%"
                transition="slide"
                backButtonText="Back"
                nextButtonText={
                  step === 1
                    ? "Continue to verification"
                    : step === 2
                      ? "Verify email"
                      : step === 3
                        ? "Choose a plan"
                        : step === 4
                          ? "Review setup"
                          : "Continue to payment"
                }
                completeButtonText="Continue to payment"
                className="text-slate-900"
                stepContainerClassName="mb-7"
                contentClassName="min-h-[390px]"
                footerClassName="mt-5"
                completedContent={
                  <div className="min-h-97.5 pt-2">
                    {paymentState === "ready" && (
                      <div className="space-y-6">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                          <WalletCards size={23} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-semibold text-slate-950">
                            You&apos;re ready for checkout
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            Your workspace is configured. The next step will
                            securely hand off to payment.
                          </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Selected plan
                              </p>
                              <p className="mt-1 text-lg font-semibold text-slate-950">
                                {activePlan?.name ?? "Selected plan"}
                              </p>
                              <p className="mt-1 text-sm text-slate-500">
                                {billingInterval === "monthly"
                                  ? "Billed monthly"
                                  : "Billed annually"}
                              </p>
                            </div>
                            <p className="text-lg font-semibold text-slate-950">
                              {formatPrice(activePlanAmount)}
                              <span className="text-xs font-normal text-slate-500">
                                /{billingInterval === "monthly" ? "mo" : "yr"}
                              </span>
                            </p>
                          </div>
                          <div className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-600">
                            <span className="font-medium text-slate-800">
                              {business.name || "Your business"}
                            </span>
                            <span className="mx-2 text-slate-300">·</span>
                            {business.firstLocation.name || "First outlet"}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleCheckout}
                          disabled={isSubmitting}
                          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          {isSubmitting
                            ? "Opening secure checkout..."
                            : "Continue to secure checkout"}{" "}
                          <WalletCards size={17} />
                        </button>
                        <p className="text-center text-xs text-slate-400">
                          You will review the final amount in Razorpay before
                          any payment is made.
                        </p>
                      </div>
                    )}
                    {paymentState === "provisioning" && (
                      <div className="flex min-h-97.5 flex-col items-center justify-center text-center">
                        <div className="mb-5 grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                          <Loader2 size={34} strokeWidth={1.8} className="animate-spin" />
                        </div>
                        <h3 className="text-2xl font-semibold text-slate-950">
                          Setting up your workspace
                        </h3>
                        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                          Payment confirmed. We are creating your secure
                          restaurant workspace and applying your plan. This
                          can take up to a minute.
                        </p>
                        <div className="mt-6 flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-700">
                          <ShieldCheck size={15} /> Payment confirmed securely
                        </div>
                      </div>
                    )}
                    {paymentState === "failed" && (
                      <div className="flex min-h-97.5 flex-col items-center justify-center text-center">
                        <div className="mb-5 grid size-16 place-items-center rounded-full bg-red-100 text-red-600">
                          <RefreshCw size={30} />
                        </div>
                        <h3 className="text-2xl font-semibold text-slate-950">
                          Payment needs another try
                        </h3>
                        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                          Your setup is safe. You can retry checkout without
                          losing your business details or selected plan.
                        </p>
                        <button
                          type="button"
                          onClick={() => setPaymentState("ready")}
                          className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
                        >
                          Try checkout again
                        </button>
                      </div>
                    )}
                  </div>
                }
              >
                <Step
                  title="Account"
                  description="Your login details"
                  icon={<Mail size={14} />}
                >
                  <div className="space-y-5 pt-2">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-950">
                        Let&apos;s get you started
                      </h3>
                      <p className="mt-1.5 text-sm leading-6 text-slate-500">
                        Use an email you check regularly. We&apos;ll verify it
                        in the next step.
                      </p>
                    </div>
                    <Field
                      label="Work email"
                      error={errors.email}
                      icon={<Mail size={18} />}
                    >
                      <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@company.com"
                        autoComplete="email"
                        className={inputClass}
                      />
                    </Field>
                    <Field
                      label="Create a password"
                      error={errors.password}
                      icon={<LockKeyhole size={18} />}
                      trailing={
                        <button
                          type="button"
                          onClick={() => setShowPassword((visible) => !visible)}
                          className="rounded-md p-1 text-slate-400 transition hover:text-slate-700"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      }
                    >
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Create a strong password"
                        autoComplete="new-password"
                        className={inputClass}
                      />
                    </Field>
                    <span className="grid grid-cols-3 gap-2">
                      {passwordChecks.map((check) => (
                        <span
                          key={check.label}
                          className={`flex items-center gap-1 text-[11px] ${check.valid ? "text-emerald-600" : "text-slate-400"}`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${check.valid ? "bg-emerald-500" : "bg-slate-300"}`}
                          />
                          {check.label}
                        </span>
                      ))}
                    </span>
                    <p className="flex items-start gap-2 text-xs leading-5 text-slate-500">
                      <ShieldCheck
                        size={15}
                        className="mt-0.5 shrink-0 text-emerald-600"
                      />
                      Your details are encrypted and never shared without your
                      permission.
                    </p>
                  </div>
                </Step>

                <Step
                  title="Verify"
                  description="Confirm your email"
                  icon={<KeyRound size={14} />}
                >
                  <div className="space-y-6 pt-2">
                    <div>
                      <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-amber-100 text-amber-600">
                        <Mail size={23} />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-950">
                        Check your inbox
                      </h3>
                      <p className="mt-1.5 text-sm leading-6 text-slate-500">
                        We sent a 6-digit code to{" "}
                        <span className="font-semibold text-slate-700">
                          {email || "your email"}
                        </span>
                        . Enter it below to confirm your account.
                      </p>
                    </div>
                    <Field
                      label="Verification code"
                      error={errors.otp}
                      icon={<KeyRound size={18} />}
                    >
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otp}
                        onChange={(event) =>
                          setOtp(event.target.value.replace(/\D/g, ""))
                        }
                        placeholder="000000"
                        autoComplete="one-time-code"
                        className={`${inputClass} text-lg font-semibold tracking-[0.45em] placeholder:font-normal placeholder:tracking-[0.35em]`}
                      />
                    </Field>
                    <div className="flex items-center justify-between gap-4 text-xs">
                      <span className="text-slate-500">
                        {resent
                          ? "A new code is ready in your inbox."
                          : "Didn't receive it?"}
                      </span>
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={resendIn > 0}
                        className="inline-flex items-center gap-1.5 font-semibold text-amber-600 transition hover:text-amber-700 disabled:cursor-not-allowed disabled:text-slate-400"
                      >
                        <RefreshCw
                          size={13}
                          className={resent ? "animate-spin" : ""}
                        />
                        {resendIn > 0
                          ? `Resend in ${resendIn}s`
                          : "Resend code"}
                      </button>
                    </div>
                  </div>
                </Step>

                <Step
                  title="Business"
                  description="Your workspace"
                  icon={<Building2 size={14} />}
                >
                  <div className="space-y-5 pt-2">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-950">
                        Tell us about your business
                      </h3>
                      <p className="mt-1.5 text-sm leading-6 text-slate-500">
                        We&apos;ll use this to shape your workspace. You can
                        change these details later.
                      </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field
                        label="Business name"
                        error={errors.businessName}
                        icon={<Building2 size={17} />}
                      >
                        <input
                          value={business.name}
                          onChange={(event) => {
                            const name = event.target.value;
                            setBusiness((current) => ({
                              ...current,
                              name,
                              slug: slugify(name),
                            }));
                          }}
                          placeholder="e.g. Urban Kitchen"
                          className={inputClass}
                        />
                      </Field>
                      <SelectField
                        label="Business type"
                        value={business.businessType}
                        onChange={(value) =>
                          updateBusiness(
                            "businessType",
                            value as BusinessForm["businessType"],
                          )
                        }
                        options={BUSINESS_TYPES}
                        error={errors.businessType}
                      />
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="mb-4 flex items-center gap-2">
                        <Store size={17} className="text-amber-600" />
                        <p className="text-sm font-semibold text-slate-800">
                          Your first outlet
                        </p>
                        <span className="text-xs text-slate-400">
                          Required to get started
                        </span>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field
                          label="Outlet name"
                          error={errors.outletName}
                          icon={<Store size={17} />}
                        >
                          <input
                            value={business.firstLocation.name}
                            onChange={(event) =>
                              updateLocation("name", event.target.value)
                            }
                            placeholder="e.g. Main Street"
                            className={inputClass}
                          />
                        </Field>
                        <SelectField
                          label="Operating mode"
                          value={business.firstLocation.operatingMode}
                          onChange={(value) =>
                            updateLocation(
                              "operatingMode",
                              value as BusinessForm["firstLocation"]["operatingMode"],
                            )
                          }
                          options={OPERATING_MODES}
                          error={errors.operatingMode}
                        />
                      </div>
                      <div className="mt-4">
                        <Field
                          label="Address"
                          error={errors.addressLine1}
                          icon={<MapPin size={17} />}
                        >
                          <input
                            value={business.firstLocation.addressLine1}
                            onChange={(event) =>
                              updateLocation("addressLine1", event.target.value)
                            }
                            placeholder="Street address"
                            className={inputClass}
                          />
                        </Field>
                      </div>
                      <div className="mt-4 grid gap-4 sm:grid-cols-3">
                        <Field label="City" error={errors.city}>
                          <input
                            value={business.firstLocation.city}
                            onChange={(event) =>
                              updateLocation("city", event.target.value)
                            }
                            placeholder="Mumbai"
                            className={inputClass}
                          />
                        </Field>
                        <Field label="State" error={errors.state}>
                          <input
                            value={business.firstLocation.state}
                            onChange={(event) =>
                              updateLocation("state", event.target.value)
                            }
                            placeholder="Maharashtra"
                            className={inputClass}
                          />
                        </Field>
                        <Field label="PIN code" error={errors.postalCode}>
                          <input
                            inputMode="numeric"
                            maxLength={6}
                            value={business.firstLocation.postalCode}
                            onChange={(event) =>
                              updateLocation(
                                "postalCode",
                                event.target.value.replace(/\D/g, ""),
                              )
                            }
                            placeholder="400001"
                            className={inputClass}
                          />
                        </Field>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400">
                      Workspace slug preview:{" "}
                      <span className="font-mono text-slate-600">
                        {businessPayloadPreview.slug || "your-business"}
                      </span>
                    </p>
                  </div>
                </Step>

                <Step
                  title="Plan"
                  description="Choose your fit"
                  icon={<WalletCards size={14} />}
                >
                  <div className="space-y-5 pt-2">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-950">
                          Choose the right plan for your restaurant
                        </h3>
                        <p className="mt-1.5 text-sm leading-5 text-slate-500">
                          See exactly what you get today, then move up when your
                          business needs more.
                        </p>
                      </div>
                      <div className="flex shrink-0 rounded-lg border border-slate-200 bg-white p-1 text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => setBillingInterval("monthly")}
                          className={`rounded-md px-2.5 py-1.5 ${billingInterval === "monthly" ? "bg-slate-950 text-white" : "text-slate-500"}`}
                        >
                          Monthly
                        </button>
                        <button
                          type="button"
                          onClick={() => setBillingInterval("yearly")}
                          className={`rounded-md px-2.5 py-1.5 ${billingInterval === "yearly" ? "bg-slate-950 text-white" : "text-slate-500"}`}
                        >
                          Yearly
                        </button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {backendPlans.map((plan) => {
                        const price = plan.prices.find(
                          (entry) =>
                            entry.interval ===
                            (billingInterval === "monthly" ? "MONTH" : "YEAR"),
                        );
                        const active = selectedPlan === plan.slug;
                        const isUnavailable = !price;

                        return (
                          <button
                            type="button"
                            key={plan.id}
                            onClick={() => price && setSelectedPlan(plan.slug)}
                            disabled={isUnavailable}
                            aria-pressed={active}
                            className={`relative w-full rounded-2xl border p-5 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-200 ${
                              active
                                ? "border-amber-400 bg-amber-50/70 shadow-md shadow-amber-100 ring-2 ring-amber-100"
                                : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                            }`}
                          >
                            {plan.slug === "growth" && (
                              <span className="absolute -top-3 right-4 rounded-full bg-amber-400 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-950">
                                Most popular
                              </span>
                            )}
                            <span className="flex items-start justify-between gap-4">
                              <span className="min-w-0">
                                <span className="flex items-center gap-2 text-lg font-semibold text-slate-950">
                                  <span
                                    className={`grid size-5 shrink-0 place-items-center rounded-full ${active ? "bg-amber-500 text-white" : "border border-slate-300 text-transparent"}`}
                                  >
                                    <Check size={13} />
                                  </span>
                                  {plan.name}
                                </span>
                                <span className="mt-2 block text-sm font-medium leading-5 text-slate-700">
                                  {plan.description}
                                </span>
                                <span className="mt-1.5 block text-xs leading-5 text-slate-500">
                                  {price?.unit === "LOCATION"
                                    ? "Priced for each restaurant location"
                                    : "A clear fit for your restaurant business"}
                                </span>
                              </span>
                              <span className="shrink-0 text-right">
                                <span className="block text-xl font-semibold text-slate-950">
                                  {price
                                    ? formatPrice(price.amountMinor / 100)
                                    : "Custom pricing"}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {price
                                    ? `per ${billingInterval === "monthly" ? "month" : "year"}${price.unit === "LOCATION" ? " / location" : ""}`
                                    : "Contact us"}
                                </span>
                              </span>
                            </span>
                            <span className="mt-5 block border-t border-slate-200/80 pt-4">
                              <span className="mb-3 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                                What&apos;s included
                              </span>
                              <span className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
                                {plan.entitlements.map((entitlement) => (
                                  <span
                                    key={entitlement.key}
                                    className="flex items-start gap-2 text-sm leading-5 text-slate-600"
                                  >
                                    <Check
                                      size={15}
                                      className="mt-0.5 shrink-0 text-emerald-600"
                                    />
                                    {formatEntitlement(
                                      entitlement.key,
                                      entitlement.value,
                                    )}
                                  </span>
                                ))}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {errors.plan && (
                      <p className="text-xs font-medium text-red-600">
                        {errors.plan}
                      </p>
                    )}
                    <p className="text-xs leading-5 text-slate-400">
                      Prices are shown in INR and will be confirmed before
                      payment. Taxes, if applicable, are calculated at checkout.
                    </p>
                  </div>
                </Step>

                <Step
                  title="Review"
                  description="Confirm your setup"
                  icon={<CheckCircle2 size={14} />}
                >
                  <div
                    className="space-y-5 pt-2"
                    data-plan-price-id={onboardingDraftPreview.planPriceId}
                  >
                    <div>
                      <h3 className="text-xl font-semibold text-slate-950">
                        Review your workspace
                      </h3>
                      <p className="mt-1.5 text-sm text-slate-500">
                        Everything looks good? Continue to the secure payment
                        handoff.
                      </p>
                    </div>
                    <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
                      <SummaryRow
                        icon={<Building2 size={17} />}
                        label="Business"
                        value={business.name || "Not added"}
                        detail={
                          business.businessType
                            ? BUSINESS_TYPES.find(
                                (type) => type.value === business.businessType,
                              )?.label
                            : undefined
                        }
                      />
                      <SummaryRow
                        icon={<Store size={17} />}
                        label="First outlet"
                        value={business.firstLocation.name || "Not added"}
                        detail={business.firstLocation.city || undefined}
                      />
                      <SummaryRow
                        icon={<WalletCards size={17} />}
                        label="Plan"
                        value={activePlan?.name ?? "Not selected"}
                        detail={
                          activeBackendPrice
                            ? `${formatPrice(activePlanAmount)} / ${billingInterval === "monthly" ? "month" : "year"}`
                            : "Custom pricing"
                        }
                      />
                    </div>
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs leading-5 text-emerald-800">
                      <span className="font-semibold">What happens next:</span>{" "}
                      we&apos;ll save your onboarding draft, open secure
                      checkout, and only activate your workspace after payment
                      is confirmed.
                    </div>
                  </div>
                </Step>
              </Stepper>

              <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5 text-xs text-slate-500">
                <span>{step > 5 ? "Setup ready" : `Step ${step} of 5`}</span>
                <span className="flex items-center gap-1.5">
                  <LockKeyhole size={13} /> Secure signup
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

const inputClass =
  "h-11 min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400";

function Field({
  label,
  error,
  icon,
  trailing,
  children,
}: {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>
      <span
        className={`flex items-center gap-3 rounded-xl border bg-white px-3.5 transition focus-within:ring-4 ${error ? "border-red-300 focus-within:border-red-400 focus-within:ring-red-100" : "border-slate-200 focus-within:border-amber-400 focus-within:ring-amber-100"}`}
      >
        {icon && <span className="shrink-0 text-slate-400">{icon}</span>}
        {children}
        {trailing}
      </span>
      {error && (
        <span className="mt-1.5 block text-xs font-medium text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>
      <span
        className={`relative flex items-center rounded-xl border bg-white transition focus-within:ring-4 ${error ? "border-red-300 focus-within:border-red-400 focus-within:ring-red-100" : "border-slate-200 focus-within:border-amber-400 focus-within:ring-amber-100"}`}
      >
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full appearance-none bg-transparent px-3.5 pr-9 text-sm text-slate-900 outline-none"
        >
          <option value="">Select one</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 text-slate-400"
        />
      </span>
      {error && (
        <span className="mt-1.5 block text-xs font-medium text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}

function SummaryRow({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="flex items-center gap-3 p-4">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs text-slate-400">{label}</span>
        <span className="block truncate text-sm font-semibold text-slate-900">
          {value}
        </span>
      </span>
      {detail && (
        <span className="shrink-0 text-right text-xs text-slate-500">
          {detail}
        </span>
      )}
    </div>
  );
}

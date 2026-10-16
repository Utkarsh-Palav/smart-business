"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, Suspense, useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type FieldErrors = {
  email?: string;
  password?: string;
};

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const callbackUrl = searchParams.get("callbackUrl");

    if (
      !callbackUrl ||
      !callbackUrl.startsWith("/") ||
      callbackUrl.startsWith("//")
    ) {
      return;
    }

    const safeCallbackUrl = callbackUrl;
    let cancelled = false;

    async function recoverSession() {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }).catch(() => null);

      if (response?.ok && !cancelled) {
        router.replace(safeCallbackUrl);
        router.refresh();
      }
    }

    void recoverSession();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  function validate() {
    const nextErrors: FieldErrors = {};
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      nextErrors.email = "Enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Enter your password.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });
      const result = await response.json();
      console.log("Login result:", result);

      if (!response.ok || !result.success) {
        throw new Error(result?.error?.message || "Unable to sign in.");
      }

      const callbackUrl = searchParams.get("callbackUrl");
      const destination =
        callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//")
          ? callbackUrl
          : "/dashboard";

      router.push(destination);
      router.refresh();
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-dvh bg-slate-200 text-slate-950 lg:h-dvh lg:overflow-hidden">
      <div className="mx-auto grid min-h-dvh w-full bg-white shadow-2xl shadow-slate-900/15 lg:h-dvh lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative hidden h-dvh min-h-0 flex-col justify-between overflow-hidden bg-[#111827] p-10 text-white lg:flex xl:p-14">
          <div className="relative z-10">
            <Link href="/" className="mb-16 flex w-fit items-center gap-3">
              <span className="grid size-10 place-items-center overflow-hidden rounded-xl bg-amber-400 text-[#16120b]">
                <Image
                  src="/Icon/apple-touch-icon.png"
                  alt=""
                  width={40}
                  height={40}
                />
              </span>
              <span className="text-lg font-semibold tracking-tight">
                Urban Kitchen
              </span>
            </Link>

            <p className="mb-5 text-sm font-medium uppercase tracking-[0.22em] text-amber-300/80">
              Welcome back
            </p>
            <h1 className="max-w-lg text-4xl font-semibold leading-[1.08] tracking-tight xl:text-5xl">
              Good operations make room for great hospitality.
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
              Pick up where you left off and keep your restaurant running
              smoothly, from the first order to the final review.
            </p>
          </div>

          <div className="relative z-10 space-y-3">
            {[
              "See the health of your restaurant at a glance",
              "Keep menus, orders, and teams in sync",
              "Make every guest interaction count",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/4 px-4 py-3.5 text-sm text-slate-300"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-amber-400 text-slate-950">
                  <Check size={14} strokeWidth={3} />
                </span>
                {item}
              </div>
            ))}
            <p className="pt-4 text-xs text-slate-500">
              A calmer way to run the work behind every great table.
            </p>
          </div>
        </section>

        <section className="flex min-h-dvh items-center overflow-y-auto bg-[#f8fafc] px-5 py-10 sm:px-10 lg:h-dvh lg:min-h-0 xl:px-20">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-10 flex items-center justify-between lg:hidden">
              <Link href="/" className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center overflow-hidden rounded-lg bg-amber-400 text-[#16120b]">
                  <Sparkles size={18} />
                </span>
                <span className="font-semibold">Urban Kitchen</span>
              </Link>
              <Link
                href="/register"
                className="text-xs font-semibold text-slate-600 hover:text-slate-950"
              >
                Create account
              </Link>
            </div>

            <div className="mb-8">
              <div className="mb-6 hidden size-12 place-items-center rounded-2xl bg-amber-100 text-amber-700 lg:grid">
                <LockKeyhole size={23} />
              </div>
              <p className="mb-3 text-sm font-semibold text-amber-600">
                Your workspace is waiting
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.15rem]">
                Sign in to Urban Kitchen
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Manage your restaurant with clarity and confidence.
              </p>
            </div>

            {serverError && (
              <div
                role="alert"
                className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm leading-5 text-red-700"
              >
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">
                  Email address
                </span>
                <span
                  className={`flex h-12 items-center gap-3 rounded-xl border bg-white px-3.5 transition focus-within:ring-4 ${
                    errors.email
                      ? "border-red-300 focus-within:border-red-400 focus-within:ring-red-100"
                      : "border-slate-200 focus-within:border-amber-400 focus-within:ring-amber-100"
                  }`}
                >
                  <Mail size={18} className="shrink-0 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (errors.email) setErrors((current) => ({ ...current, email: undefined }));
                    }}
                    placeholder="you@restaurant.com"
                    autoComplete="email"
                    autoFocus
                    className="min-w-0 flex-1 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400"
                  />
                </span>
                {errors.email && (
                  <span className="mt-1.5 block text-xs font-medium text-red-600">
                    {errors.email}
                  </span>
                )}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">
                  Password
                </span>
                <span
                  className={`flex h-12 items-center gap-3 rounded-xl border bg-white px-3.5 transition focus-within:ring-4 ${
                    errors.password
                      ? "border-red-300 focus-within:border-red-400 focus-within:ring-red-100"
                      : "border-slate-200 focus-within:border-amber-400 focus-within:ring-amber-100"
                  }`}
                >
                  <LockKeyhole size={18} className="shrink-0 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      if (errors.password) setErrors((current) => ({ ...current, password: undefined }));
                    }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="min-w-0 flex-1 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="rounded-md p-1 text-slate-400 transition hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </span>
                {errors.password && (
                  <span className="mt-1.5 block text-xs font-medium text-red-600">
                    {errors.password}
                  </span>
                )}
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Signing you in..." : "Sign in"}
                {!isSubmitting && <ArrowRight size={17} />}
              </button>
            </form>

            <div className="my-7 flex items-center gap-3 text-xs text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              <span>New to Urban Kitchen?</span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <Link
              href="/register"
              className="flex h-12 w-full items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-100"
            >
              Create your account
            </Link>

            <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
              <ShieldCheck size={14} className="text-emerald-600" />
              Your account and restaurant data are protected.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}

-- CreateEnum
CREATE TYPE "OnboardingPaymentStatus" AS ENUM ('CREATED', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'CANCELED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "WebhookEventStatus" AS ENUM ('RECEIVED', 'PROCESSED', 'IGNORED', 'FAILED');

-- CreateTable
CREATE TABLE "BusinessOnboardingPaymentAttempt" (
    "id" TEXT NOT NULL,
    "draftId" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'RAZORPAY',
    "orderId" TEXT NOT NULL,
    "paymentId" TEXT,
    "amountMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "status" "OnboardingPaymentStatus" NOT NULL DEFAULT 'CREATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessOnboardingPaymentAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RazorpayWebhookEvent" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "WebhookEventStatus" NOT NULL DEFAULT 'RECEIVED',
    "error" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RazorpayWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessOnboardingPaymentAttempt_orderId_key" ON "BusinessOnboardingPaymentAttempt"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessOnboardingPaymentAttempt_paymentId_key" ON "BusinessOnboardingPaymentAttempt"("paymentId");

-- CreateIndex
CREATE INDEX "BusinessOnboardingPaymentAttempt_draftId_status_idx" ON "BusinessOnboardingPaymentAttempt"("draftId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "RazorpayWebhookEvent_eventId_key" ON "RazorpayWebhookEvent"("eventId");

-- CreateIndex
CREATE INDEX "RazorpayWebhookEvent_eventType_status_idx" ON "RazorpayWebhookEvent"("eventType", "status");

-- AddForeignKey
ALTER TABLE "BusinessOnboardingPaymentAttempt" ADD CONSTRAINT "BusinessOnboardingPaymentAttempt_draftId_fkey" FOREIGN KEY ("draftId") REFERENCES "BusinessOnboardingDraft"("id") ON DELETE CASCADE ON UPDATE CASCADE;

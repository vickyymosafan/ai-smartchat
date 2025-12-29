"use client";

/**
 * useOnboarding Hook
 *
 * Manages onboarding flow state with localStorage persistence.
 * Tracks current step and completion status.
 */

import * as React from "react";
import {
  getOnboardingCompleted,
  setOnboardingCompleted,
  getOnboardingStep,
  setOnboardingStep,
  resetOnboardingStorage,
} from "@/lib/storage/user-preferences";

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: "install" | "none";
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Selamat Datang di Smartchat",
    description: "Asisten AI yang siap membantu Anda kapan saja, di mana saja.",
    action: "none",
  },
  {
    id: "features",
    title: "Tanyakan Apa Saja",
    description: "Dapatkan jawaban instan untuk pertanyaan pendidikan, bisnis, dan lainnya.",
    action: "none",
  },
  {
    id: "install",
    title: "Install Aplikasi",
    description: "Akses lebih cepat langsung dari home screen tanpa membuka browser.",
    action: "install",
  },
  {
    id: "ready",
    title: "Siap Memulai!",
    description: "Mulai percakapan pertama Anda dengan AI sekarang.",
    action: "none",
  },
];

export interface OnboardingState {
  /** Whether onboarding has been completed */
  isCompleted: boolean;
  /** Whether onboarding dialog should be shown */
  isOpen: boolean;
  /** Current step index (0-based) */
  currentStep: number;
  /** Total number of steps */
  totalSteps: number;
  /** Current step data */
  currentStepData: OnboardingStep;
  /** Whether currently on first step */
  isFirstStep: boolean;
  /** Whether currently on last step */
  isLastStep: boolean;
}

export interface OnboardingReturn extends OnboardingState {
  /** Go to next step */
  nextStep: () => void;
  /** Go to previous step */
  prevStep: () => void;
  /** Skip onboarding entirely */
  skipOnboarding: () => void;
  /** Complete onboarding */
  completeOnboarding: () => void;
  /** Reset onboarding (for testing) */
  resetOnboarding: () => void;
  /** Open onboarding dialog manually */
  openOnboarding: () => void;
  /** Close onboarding dialog */
  closeOnboarding: () => void;
}

export function useOnboarding(): OnboardingReturn {
  const [isCompleted, setIsCompleted] = React.useState(true); // Default true to prevent flash
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(0);

  const totalSteps = ONBOARDING_STEPS.length;
  const currentStepData = ONBOARDING_STEPS[currentStep] || ONBOARDING_STEPS[0];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  // Check completion status on mount
  React.useEffect(() => {
    const completed = getOnboardingCompleted();
    setIsCompleted(completed);

    if (!completed) {
      // Restore saved step if any
      const savedStep = getOnboardingStep();
      setCurrentStep(savedStep);
      // Auto-open if not completed
      setIsOpen(true);
    }
  }, []);

  // Save step progress
  React.useEffect(() => {
    if (!isCompleted) {
      setOnboardingStep(currentStep);
    }
  }, [currentStep, isCompleted]);

  const nextStep = React.useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const prevStep = React.useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const completeOnboarding = React.useCallback(() => {
    setOnboardingCompleted(true);
    setIsCompleted(true);
    setIsOpen(false);
    setCurrentStep(0);
  }, []);

  const skipOnboarding = React.useCallback(() => {
    completeOnboarding();
  }, [completeOnboarding]);

  const resetOnboarding = React.useCallback(() => {
    resetOnboardingStorage();
    setIsCompleted(false);
    setCurrentStep(0);
    setIsOpen(true);
  }, []);

  const openOnboarding = React.useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeOnboarding = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isCompleted,
    isOpen,
    currentStep,
    totalSteps,
    currentStepData,
    isFirstStep,
    isLastStep,
    nextStep,
    prevStep,
    skipOnboarding,
    completeOnboarding,
    resetOnboarding,
    openOnboarding,
    closeOnboarding,
  };
}

export default useOnboarding;

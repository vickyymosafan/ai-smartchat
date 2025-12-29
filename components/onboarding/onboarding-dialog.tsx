"use client";

/**
 * Onboarding Dialog
 *
 * Step-by-step wizard for first-time users.
 * Shows app introduction and PWA install prompt.
 */

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { useOnboarding, ONBOARDING_STEPS } from "@/hooks/useOnboarding";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { IOSInstallDialog } from "@/components/pwa/ios-install-dialog";
import {
  MessageSquare,
  Sparkles,
  Download,
  Rocket,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Icons for each step
const STEP_ICONS: Record<string, React.ElementType> = {
  welcome: MessageSquare,
  features: Sparkles,
  install: Download,
  ready: Rocket,
};

// Colors for each step
const STEP_COLORS: Record<string, string> = {
  welcome: "from-blue-500 to-cyan-500",
  features: "from-purple-500 to-pink-500",
  install: "from-green-500 to-emerald-500",
  ready: "from-orange-500 to-yellow-500",
};

export function OnboardingDialog() {
  const {
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
    closeOnboarding,
  } = useOnboarding();

  const {
    isInstallable,
    promptInstall,
    showIOSInstructions,
    isInstalled,
  } = usePWAInstall();

  const [showIOSDialog, setShowIOSDialog] = React.useState(false);
  const [isInstalling, setIsInstalling] = React.useState(false);

  const IconComponent = STEP_ICONS[currentStepData.id] || MessageSquare;
  const gradientColor = STEP_COLORS[currentStepData.id] || "from-blue-500 to-cyan-500";

  // Handle install action on install step
  const handleInstallAction = React.useCallback(async () => {
    if (showIOSInstructions) {
      setShowIOSDialog(true);
      return;
    }

    if (isInstallable) {
      setIsInstalling(true);
      try {
        await promptInstall();
      } finally {
        setIsInstalling(false);
      }
    }
  }, [isInstallable, promptInstall, showIOSInstructions]);

  // Handle next/complete
  const handleNext = React.useCallback(() => {
    if (isLastStep) {
      completeOnboarding();
    } else {
      nextStep();
    }
  }, [isLastStep, completeOnboarding, nextStep]);

  // Determine if install step should show install button
  const showInstallButton =
    currentStepData.action === "install" &&
    !isInstalled &&
    (isInstallable || showIOSInstructions);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && closeOnboarding()}>
        <DialogContent
          className="sm:max-w-md p-0 gap-0 overflow-hidden"
          showCloseButton
        >
          {/* Visually hidden title for accessibility */}
          <VisuallyHidden.Root asChild>
            <DialogTitle>{currentStepData.title}</DialogTitle>
          </VisuallyHidden.Root>

          {/* Header with gradient background */}
          <div
            className={cn(
              "relative h-48 flex items-center justify-center bg-linear-to-br",
              gradientColor
            )}
          >
            {/* Skip button */}
            <button
              onClick={skipOnboarding}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
              aria-label="Lewati onboarding"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Icon */}
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
              <IconComponent className="h-10 w-10 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 pt-8 text-center">
            <h2 className="text-xl font-semibold mb-2">
              {currentStepData.title}
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              {currentStepData.description}
            </p>

            {/* Install button (only on install step) */}
            {showInstallButton && (
              <Button
                onClick={handleInstallAction}
                disabled={isInstalling}
                className="mb-6 w-full"
                size="lg"
              >
                {isInstalling ? (
                  "Menginstall..."
                ) : showIOSInstructions ? (
                  "Lihat Cara Install"
                ) : (
                  "Install Sekarang"
                )}
              </Button>
            )}

            {/* Already installed message */}
            {currentStepData.action === "install" && isInstalled && (
              <div className="mb-6 p-3 rounded-lg bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 text-sm">
                ✓ Aplikasi sudah terinstall
              </div>
            )}

            {/* Step indicators */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {ONBOARDING_STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    index === currentStep
                      ? "w-6 bg-primary"
                      : index < currentStep
                        ? "bg-primary/50"
                        : "bg-muted"
                  )}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={isFirstStep}
                className={cn(isFirstStep && "invisible")}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Kembali
              </Button>

              <Button onClick={handleNext}>
                {isLastStep ? "Mulai" : "Lanjut"}
                {!isLastStep && <ChevronRight className="h-4 w-4 ml-1" />}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* iOS Install Dialog */}
      <IOSInstallDialog open={showIOSDialog} onOpenChange={setShowIOSDialog} />
    </>
  );
}

export default OnboardingDialog;

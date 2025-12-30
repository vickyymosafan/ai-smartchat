"use client";

/**
 * Onboarding Tour Component
 *
 * Uses driver.js to create a step-by-step tour with arrow indicators.
 * Replaces the static modal-based onboarding.
 */

import * as React from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useTheme } from "next-themes";

export function OnboardingTour() {
  const { isCompleted, completeOnboarding } = useOnboarding();
  const { theme } = useTheme();

  React.useEffect(() => {
    // If already completed, do nothing
    if (isCompleted) return;

    // Small delay to ensure all elements are mounted
    const timer = setTimeout(() => {
      const driverObj = driver({
        showProgress: true,
        allowClose: false, // Force completion for first time users, or set to true
        animate: true,
        doneBtnText: "Mulai",
        nextBtnText: "Lanjut",
        prevBtnText: "Kembali",
        progressText: "{{current}} dari {{total}}",
        steps: [
          {
            element: "#sidebar-logo", // Target Sidebar Logo
            popover: {
              title: "Selamat Datang di Smartchat",
              description: "Asisten AI pintar untuk membantu aktivitas harimu. Mari kita mulai tur singkat.",
              side: "right",
              align: "start",
            },
          },
          {
            element: "#new-chat-btn", // Target New Chat Button
            popover: {
              title: "Percakapan Baru",
              description: "Klik di sini untuk memulai sesi percakapan baru dengan AI.",
              side: "right",
              align: "center",
            },
          },
          {
            element: "#settings-trigger", // Target Settings
            popover: {
              title: "Pengaturan & Tampilan",
              description: "Atur tema, instal aplikasi (PWA), dan sesuaikan preferensi lainnya di sini.",
              side: "bottom",
              align: "end",
            },
          },
          {
            element: "#chat-input", // Target Chat Input
            popover: {
              title: "Mulai Bertanya",
              description: "Ketik pertanyaanmu atau gunakan input suara untuk mulai berinteraksi.",
              side: "top",
              align: "center",
            },
          },
        ],
        onDestroyStarted: () => {
          // Verify completion only if user clicked "Done" or closed it properly
          // driver.js doesn't strictly distinguish "close" vs "done" in onDestroy without custom logic
          // but for now, we assume if the tour ends, we mark it as complete
          completeOnboarding();
          driverObj.destroy();
        },
      });

      driverObj.drive();
    }, 1000); // Wait 1s for layout to stabilize

    return () => clearTimeout(timer);
  }, [isCompleted, completeOnboarding]);

  // Render nothing, as driver.js manipulates the DOM directly
  return null;
}

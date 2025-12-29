/**
 * User Preferences Storage
 *
 * LocalStorage abstraction for user preferences like onboarding state.
 * Provides type-safe access with fallback values.
 */

const STORAGE_KEYS = {
  ONBOARDING_COMPLETED: "smartchat_onboarding_completed",
  ONBOARDING_STEP: "smartchat_onboarding_step",
} as const;

/**
 * Check if localStorage is available
 */
function isStorageAvailable(): boolean {
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get onboarding completion status
 */
export function getOnboardingCompleted(): boolean {
  if (!isStorageAvailable()) return true; // Skip onboarding if no storage
  return localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED) === "true";
}

/**
 * Set onboarding completion status
 */
export function setOnboardingCompleted(completed: boolean): void {
  if (!isStorageAvailable()) return;
  localStorage.setItem(
    STORAGE_KEYS.ONBOARDING_COMPLETED,
    completed ? "true" : "false"
  );
}

/**
 * Get current onboarding step (for resuming)
 */
export function getOnboardingStep(): number {
  if (!isStorageAvailable()) return 0;
  const step = localStorage.getItem(STORAGE_KEYS.ONBOARDING_STEP);
  return step ? parseInt(step, 10) : 0;
}

/**
 * Set current onboarding step
 */
export function setOnboardingStep(step: number): void {
  if (!isStorageAvailable()) return;
  localStorage.setItem(STORAGE_KEYS.ONBOARDING_STEP, step.toString());
}

/**
 * Reset onboarding state (for testing)
 */
export function resetOnboardingStorage(): void {
  if (!isStorageAvailable()) return;
  localStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
  localStorage.removeItem(STORAGE_KEYS.ONBOARDING_STEP);
}

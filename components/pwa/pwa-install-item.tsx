"use client";

/**
 * PWA Install Item
 *
 * Dropdown menu item for PWA installation.
 * Shows different states based on device/browser capabilities.
 */

import * as React from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { IOSInstallDialog } from "./ios-install-dialog";
import {
  Download,
  CheckCircle2,
  Share,
  XCircle,
  Loader2,
} from "lucide-react";

export function PWAInstallItem() {
  const {
    isInstalled,
    isInstallable,
    isSupported,
    isLoading,
    platform,
    browser,
    promptInstall,
    showIOSInstructions,
  } = usePWAInstall();

  const [showIOSDialog, setShowIOSDialog] = React.useState(false);
  const [isInstalling, setIsInstalling] = React.useState(false);

  // Handle install click
  const handleInstall = React.useCallback(async () => {
    setIsInstalling(true);
    try {
      await promptInstall();
    } finally {
      setIsInstalling(false);
    }
  }, [promptInstall]);

  // Loading state
  if (isLoading) {
    return (
      <DropdownMenuItem disabled className="text-muted-foreground">
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Memeriksa...
      </DropdownMenuItem>
    );
  }

  // Already installed
  if (isInstalled) {
    return (
      <DropdownMenuItem disabled className="text-green-600 dark:text-green-400">
        <CheckCircle2 className="h-4 w-4 mr-2" />
        Sudah Terinstall
        <span className="ml-auto text-xs">✓</span>
      </DropdownMenuItem>
    );
  }

  // iOS Safari - show manual instructions
  if (showIOSInstructions) {
    return (
      <>
        <DropdownMenuItem onClick={() => setShowIOSDialog(true)}>
          <Share className="h-4 w-4 mr-2" />
          Cara Install
        </DropdownMenuItem>
        <IOSInstallDialog
          open={showIOSDialog}
          onOpenChange={setShowIOSDialog}
        />
      </>
    );
  }

  // Can install (beforeinstallprompt available)
  if (isInstallable) {
    return (
      <DropdownMenuItem onClick={handleInstall} disabled={isInstalling}>
        {isInstalling ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Download className="h-4 w-4 mr-2" />
        )}
        {isInstalling ? "Menginstall..." : "Install Aplikasi"}
      </DropdownMenuItem>
    );
  }

  // Not supported (Firefox, or beforeinstallprompt not fired yet)
  if (!isSupported || browser === "firefox") {
    return (
      <DropdownMenuItem disabled className="text-muted-foreground">
        <XCircle className="h-4 w-4 mr-2" />
        Tidak Didukung
      </DropdownMenuItem>
    );
  }

  // Waiting for beforeinstallprompt (Chrome/Edge but not yet fired)
  // This can happen if the user dismissed the prompt before
  return (
    <DropdownMenuItem disabled className="text-muted-foreground">
      <Download className="h-4 w-4 mr-2" />
      Install Tersedia
      <span className="ml-auto text-xs text-muted-foreground">Segera</span>
    </DropdownMenuItem>
  );
}

export default PWAInstallItem;

"use client";

/**
 * iOS Install Dialog
 *
 * Shows step-by-step instructions for installing PWA on iOS Safari.
 * iOS doesn't support beforeinstallprompt, so manual installation is required.
 */

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share, Plus, SquareArrowOutUpRight } from "lucide-react";

interface IOSInstallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface StepProps {
  number: number;
  children: React.ReactNode;
}

function Step({ number, children }: StepProps) {
  return (
    <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
      <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
        {number}
      </div>
      <div className="flex-1 pt-1 text-sm text-foreground">{children}</div>
    </div>
  );
}

export function IOSInstallDialog({ open, onOpenChange }: IOSInstallDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SquareArrowOutUpRight className="h-5 w-5" />
            Install di iOS Safari
          </DialogTitle>
          <DialogDescription>
            Ikuti langkah berikut untuk menambahkan aplikasi ke Home Screen
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <Step number={1}>
            <span className="flex items-center gap-2 flex-wrap">
              Tap tombol
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-background border">
                <Share className="h-4 w-4" />
                Share
              </span>
              di toolbar Safari (bawah layar)
            </span>
          </Step>

          <Step number={2}>
            <span className="flex items-center gap-2 flex-wrap">
              Scroll ke bawah dan pilih
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-background border">
                <Plus className="h-4 w-4" />
                Add to Home Screen
              </span>
            </span>
          </Step>

          <Step number={3}>
            <span>
              Tap{" "}
              <span className="font-semibold text-primary">Add</span> di pojok
              kanan atas untuk menyelesaikan instalasi
            </span>
          </Step>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Mengerti</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default IOSInstallDialog;

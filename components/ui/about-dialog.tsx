"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"

interface AboutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AboutDialog({ open, onOpenChange }: AboutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image src="/UMJ.webp" alt="Logo" width={40} height={40} className="rounded-lg" />
            Smartchat AI Assistant
          </DialogTitle>
          <DialogDescription>
            Asisten AI untuk membantu Anda dengan berbagai pertanyaan dan kebutuhan informasi.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Tentang</h4>
            <p className="text-sm text-muted-foreground">
              Smartchat AI Assistant adalah chatbot yang dirancang untuk memberikan bantuan, saran, dan menjawab
              pertanyaan Anda dengan cepat dan akurat.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Fitur</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Percakapan AI yang natural</li>
              <li>• Dukungan markdown lengkap</li>
              <li>• Riwayat percakapan</li>
              <li>• Musik latar yang menyenangkan</li>
              <li>• Mode gelap dan terang</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Versi</h4>
            <p className="text-sm text-muted-foreground">1.0.0</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

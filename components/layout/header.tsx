"use client"
import { Button } from "@/components/ui/button"
import { MobileNav } from "./mobile-nav"
import { useTheme } from "@/components/providers/theme-provider"
import { Menu, Sun, Moon, Settings, Palette, Circle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { PWAInstallItem } from "@/components/pwa"

interface HeaderProps {
  isSidebarCollapsed: boolean
  onToggleSidebar: () => void
  onOpenAbout: () => void
}

export function Header({ isSidebarCollapsed, onToggleSidebar, onOpenAbout }: HeaderProps) {
  const { theme, setTheme, colorScheme, setColorScheme } = useTheme()

  return (
    <header className="h-14 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        {/* Mobile Nav */}
        <div className="md:hidden">
          <MobileNav onOpenAbout={onOpenAbout} />
        </div>

        {/* Desktop Sidebar Toggle */}
        {isSidebarCollapsed && (
          <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="hidden md:flex">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Buka sidebar</span>
          </Button>
        )}

        <h1 className="text-lg font-semibold">Chat</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Settings Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button id="settings-trigger" variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Pengaturan</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {/* PWA Install Section */}
            <DropdownMenuLabel>Aplikasi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <PWAInstallItem />

            {/* Display Mode Section */}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Tampilan</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="h-4 w-4 mr-2" />
              Mode Terang
              {theme === "light" && <span className="ml-auto text-xs">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="h-4 w-4 mr-2" />
              Mode Gelap
              {theme === "dark" && <span className="ml-auto text-xs">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <Settings className="h-4 w-4 mr-2" />
              Sistem
              {theme === "system" && <span className="ml-auto text-xs">✓</span>}
            </DropdownMenuItem>

            {/* Color Scheme Section */}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Skema Warna</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setColorScheme("default")}>
              <Palette className="h-4 w-4 mr-2 text-cyan-500" />
              Default
              {colorScheme === "default" && <span className="ml-auto text-xs">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setColorScheme("ungu")}>
              <Palette className="h-4 w-4 mr-2 text-purple-500" />
              Ungu
              {colorScheme === "ungu" && <span className="ml-auto text-xs">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setColorScheme("netral")}>
              <Circle className="h-4 w-4 mr-2 text-gray-500" />
              Netral
              {colorScheme === "netral" && <span className="ml-auto text-xs">✓</span>}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

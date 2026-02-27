"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { GlobeIcon } from "@/components/simple-icons"
import { useLanguage } from "@/hooks/use-language"

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <GlobeIcon className="h-4 w-4" />
          <span>{language === "es" ? "Español" : "English"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("es")}>Español</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

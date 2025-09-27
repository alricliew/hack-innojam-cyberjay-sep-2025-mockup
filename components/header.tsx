'use client'

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import Link from "next/link"

export default function Header() {
  const [isChecked, setIsChecked] = useState(false)

  return (
    <header className="w-full border-b bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo on the left */}
        <Link href="/">
          <div className="text-xl font-bold">
            LOGO
          </div>
        </Link>


        {/* Right side: Switch + Login button */}
        <div className="flex items-center space-x-4">
            
            <Switch
              color=""
              checked={isChecked}
              onCheckedChange={setIsChecked}

            />
            <Label htmlFor="mode">Provider Mode</Label>
            <Link href="/auth">
              <Button variant="default" >
                Login
              </Button>
            </Link>

        </div>
      </div>
    </header>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import MaterialIcon from "@/components/ui/material-icon"

export default function ProfilePage() {
  const [contactNumber, setContactNumber] = useState("+1 (555) 012-3456")
  const [address, setAddress] = useState("4510 Logistics Park Dr, Suite 200\nGreen Bay, WI 54301\nUnited States")

  return (
    <div className="px-8 lg:px-12 py-10">
      <div className="grid grid-cols-12 gap-8">
        {/* Main Form — 8 cols */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="bg-popover rounded-xl p-8 border border-border">
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Business Name</Label>
                  <div className="bg-silver-two px-4 py-3 rounded-lg text-foreground font-medium border-l-4 border-primary">
                    Drova Logistics International Ltd.
                  </div>
                  <p className="text-[10px] text-muted-foreground italic">Contact support to change legal entity name.</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Registration Number</Label>
                  <div className="bg-silver-two px-4 py-3 rounded-lg text-foreground font-medium">
                    REG-990-221-DLO
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Tax ID</Label>
                  <div className="bg-silver-two px-4 py-3 rounded-lg text-foreground font-medium">
                    TX-4455-88921
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Contact Number</Label>
                  <Input
                    type="text"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="bg-silver-two focus-visible:ring-secondary/20 focus-visible:border-secondary"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Business Address</Label>
                  <Textarea
                    rows={4}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="bg-silver-two focus-visible:ring-secondary/20 focus-visible:border-secondary"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button variant="default" size="default">
                  Save Changes
                </Button>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden bg-primary text-white p-8 rounded-xl min-h-[200px] flex items-center">
            <div className="relative z-10 max-w-md">
              <h3 className="text-2xl font-bold mb-2">Sustainable Logistics</h3>
              <p className="text-white/80 text-sm">Your business profile is linked to our carbon-offsetting program. Keep your fleet data updated to maintain your &apos;Green Partner&apos; status.</p>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-20">
              <MaterialIcon name="eco" size={160} color="white" />
            </div>
          </div>
        </div>

        {/* Right Sidebar — 4 cols */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-popover rounded-xl p-8 border-t-4 border-secondary border border-border">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-foreground tracking-tight">Verification Status</h4>
              <MaterialIcon name="verified" size={24} color="var(--secondary)" />
            </div>
            <div className="flex items-center gap-4 bg-secondary/10 p-4 rounded-lg mb-6">
              <div className="shrink-0 w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                <MaterialIcon name="check_circle" size={24} color="var(--secondary)" />
              </div>
              <div>
                <p className="font-bold text-secondary">Fully Verified</p>
                <p className="text-xs text-secondary/70">Last updated: Oct 24, 2023</p>
              </div>
            </div>
            <ul className="space-y-3 text-sm">
              {["Legal Document ID", "Operational License", "Proof of Address"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-muted-foreground">
                  <MaterialIcon name="check" size={16} color="var(--secondary)" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-silver-two rounded-xl p-6 border border-border">
            <h4 className="text-xs font-extrabold text-primary mb-4 flex items-center gap-2 uppercase tracking-wider">
              <MaterialIcon name="support_agent" size={16} color="var(--primary)" />
              Need Help?
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Contact our partner support team for assistance with profile changes, documentation, or compliance questions.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

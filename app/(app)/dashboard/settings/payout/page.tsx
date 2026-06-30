"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectPopup, SelectItem } from "@/components/ui/select"
import MaterialIcon from "@/components/ui/material-icon"

const bankOptions = ["Access Bank", "Zenith Bank", "GTBank", "Standard Chartered"]

export default function PayoutPage() {
  const [selectedBank, setSelectedBank] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [verificationText, setVerificationText] = useState("Awaiting Input")
  const [verificationIcon, setVerificationIcon] = useState("pending_actions")
  const [verificationBg, setVerificationBg] = useState("bg-popover")

  const handleAccountChange = (val: string) => {
    setAccountNumber(val)
    if (val.length === 10) {
      setVerificationText("Ready to Verify")
      setVerificationIcon("check_circle")
      setVerificationBg("bg-secondary/10")
    } else if (val.length > 0) {
      setVerificationText("Entering digits...")
      setVerificationIcon("hourglass_top")
      setVerificationBg("bg-popover")
    } else {
      setVerificationText("Awaiting Input")
      setVerificationIcon("pending_actions")
      setVerificationBg("bg-popover")
    }
  }

  return (
    <div className="px-8 lg:px-12 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Linked Account & Schedule */}
        <div className="lg:col-span-5 space-y-12">
          {/* Linked Settlement Account Card — credit card style */}
          <section>
            <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
              <MaterialIcon name="account_balance" size={24} color="var(--primary)" />
              Linked Settlement Account
            </h3>
            <div className="bg-primary text-white rounded-xl p-8 border border-primary/60 relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-secondary rounded-full blur-3xl opacity-20" />
              <div className="relative z-10 flex flex-col gap-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white/60 uppercase tracking-wider">Primary Bank</p>
                    <p className="text-xl font-bold text-white">Access Bank</p>
                  </div>
                  <div className="bg-white/10 text-chart-2 px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/10">
                    <MaterialIcon name="verified" size={14} color="var(--chart-2)" />
                    <span className="text-xs font-bold">Active</span>
                  </div>
                </div>
                <div className="space-y-4 pt-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white/60 uppercase tracking-wider">ACCOUNT NAME</span>
                    <span className="text-base font-medium text-white">Speedex Logistics Ltd</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white/60 uppercase tracking-wider">ACCOUNT NUMBER</span>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold tracking-[0.2em] text-white/90">0023****1234</span>
                      <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/10">
                        <MaterialIcon name="content_copy" size={20} color="white" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="pt-4 flex gap-4">
                  <Button variant="ghost" size="sm" className="text-chart-2 font-bold bg-white/10 hover:bg-white/20 hover:text-chart-2">
                    <MaterialIcon name="edit" size={16} color="var(--chart-2)" />
                    Modify Account
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Settlement Schedule */}
          <section>
            <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
              <MaterialIcon name="schedule" size={24} color="var(--primary)" />
              Settlement Schedule
            </h3>
            <div className="bg-popover p-8 rounded-xl border border-dashed border-border/80">
              <div className="flex items-start gap-6">
                <div className="bg-primary/10 p-4 rounded-xl text-primary">
                  <MaterialIcon name="event_available" size={32} color="var(--primary)" />
                </div>
                <div className="space-y-2">
                  <p className="text-base font-bold text-primary">Automated Weekly Payout</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your earnings are settled automatically every <span className="text-primary font-bold">Friday at 4:00 PM</span> to your primary linked account.
                  </p>
                  <div className="pt-4 flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {["MON", "TUE", "WED", "THU", "FRI"].map((day, i) => (
                        <div
                          key={day}
                          className={`w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold ${
                            i === 4
                              ? "bg-secondary text-white shadow-lg shadow-secondary/30"
                              : "bg-silver-two text-muted-foreground"
                          }`}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-muted-foreground">4 Days remaining</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Add New Payout Method */}
        <div className="lg:col-span-7">
          <section className="sticky top-24">
            <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
              <MaterialIcon name="add_circle" size={24} color="var(--primary)" />
              Add New Payout Method
            </h3>
            <div className="bg-popover p-10 rounded-xl border border-border">
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Bank Name */}
                  <div className="flex flex-col gap-4">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      Bank Name
                    </Label>
                    <Select value={selectedBank} onValueChange={setSelectedBank}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select participating bank" />
                      </SelectTrigger>
                      <SelectPopup>
                        {bankOptions.map((b) => (
                          <SelectItem key={b} value={b}>{b}</SelectItem>
                        ))}
                      </SelectPopup>
                    </Select>
                  </div>

                  {/* Account Number */}
                  <div className="flex flex-col gap-4">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      Account Number
                    </Label>
                    <Input
                      value={accountNumber}
                      onChange={(e) => handleAccountChange(e.target.value)}
                      placeholder="10-digit number"
                      maxLength={10}
                      className="bg-silver-two focus-visible:ring-secondary/20 focus-visible:border-secondary"
                    />
                  </div>
                </div>

                {/* Verification Status */}
                <div className="flex flex-col gap-4">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Verification Status
                  </Label>
                  <div className="flex items-center gap-4 bg-silver-two p-5 rounded-lg border border-border">
                    <div className={`w-10 h-10 rounded-full ${verificationBg} flex items-center justify-center text-secondary`}>
                      <MaterialIcon name={verificationIcon} size={20} color="var(--secondary)" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-primary">{verificationText}</p>
                      <p className="text-xs text-muted-foreground">Verified instantly via secure banking API</p>
                    </div>
                  </div>
                </div>

                {/* Info Notice */}
                <div className="bg-silver-two p-6 rounded-lg flex gap-4 border-l-4 border-primary">
                  <MaterialIcon name="info" size={20} color="var(--primary)" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    By adding a new payout method, you agree to our <a className="text-primary font-bold underline" href="#">Settlement Terms</a>. New accounts may take up to 24 hours to be fully authorized for large volume transfers.
                  </p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center gap-6">
                  <Button variant="default" size="default">
                    Verify &amp; Link Account
                  </Button>
                  <Button variant="ghost">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>

            {/* Info Banner */}
            <div className="mt-12 bg-primary p-6 rounded-xl text-primary-foreground flex items-center gap-4">
              <MaterialIcon name="security" size={24} color="var(--chart-2)" />
              <p className="text-sm leading-relaxed opacity-90">Your security is our priority. Multi-layer encryption on every transfer.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

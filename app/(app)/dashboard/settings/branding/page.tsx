"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import MaterialIcon from "@/components/ui/material-icon"

export default function BrandingPage() {
  const [description, setDescription] = useState(
    "At Speedex Courier, we leverage the Drova ecosystem to provide lightning-fast last-mile logistics. Our fleet is committed to sustainable delivery practices and absolute transparency. With over 15 years of industry experience, we ensure your goods arrive not just on time, but with care."
  )
  const [instagram, setInstagram] = useState("speedex_logistics")
  const [twitter, setTwitter] = useState("")
  const [linkedin, setLinkedin] = useState("speedex-couriers-intl")
  const [emailBranding, setEmailBranding] = useState(true)

  return (
    <div className="px-8 lg:px-12 py-10">
      <div className="grid grid-cols-12 gap-8">
        {/* Brand Assets — 7 cols */}
        <section className="col-span-12 lg:col-span-7 space-y-8">
          <div className="bg-popover p-8 rounded-xl border border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-primary">Brand Assets</h2>
              <span className="text-xs font-medium text-secondary bg-secondary/10 px-3 py-1 rounded-full">Primary Identity</span>
            </div>

            <div className="flex items-start gap-8 mb-10">
              <div className="relative group">
                <div className="w-32 h-32 bg-silver-two rounded-2xl flex items-center justify-center border-2 border-dashed border-border hover:border-secondary transition-colors overflow-hidden">
                  <MaterialIcon name="image" size={48} color="var(--muted-foreground)" />
                </div>
                <Button variant="default" size="icon" className="absolute -bottom-2 -right-2 rounded-lg shadow-md hover:scale-110 transition-transform">
                  <MaterialIcon name="edit" size={16} color="white" />
                </Button>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Company Logo</Label>
                <p className="text-sm text-muted-foreground mb-4">Upload a high-resolution PNG or SVG. Recommended 512x512px.</p>
                <div className="flex gap-3">
                  <Button variant="secondary" size="sm">Replace Logo</Button>
                  <Button variant="destructive" size="sm">Remove</Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Storefront Cover</Label>
              <div className="w-full h-48 rounded-xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">
                  <div className="bg-white/90 px-6 py-2 rounded-full flex items-center gap-2 font-bold text-primary">
                    <MaterialIcon name="image" size={18} color="var(--primary)" />
                    Change Cover
                  </div>
                </div>
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
              </div>
            </div>
          </div>

          <div className="bg-popover p-8 rounded-xl border border-border">
            <h2 className="text-lg font-bold text-primary mb-6">Business Description</h2>
            <div className="space-y-4">
              <Label className="text-sm text-muted-foreground uppercase tracking-widest font-bold block">About Your Storefront</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="bg-silver-two focus-visible:ring-secondary/20 focus-visible:border-secondary"
              />
              <div className="flex justify-end">
                <p className="text-xs text-muted-foreground italic">{description.length} / 500 characters</p>
              </div>
            </div>
          </div>
        </section>

        {/* Color & Social Sidebar — 5 cols */}
        <aside className="col-span-12 lg:col-span-5 space-y-8">
          <div className="bg-popover p-8 rounded-xl border border-border">
            <h2 className="text-lg font-bold text-primary mb-6">Visual Theme</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-silver-two rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary shadow-inner" />
                  <div>
                    <p className="font-bold text-sm">Primary Brand</p>
                    <p className="text-xs font-mono text-muted-foreground uppercase">#00281d</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-secondary">
                  <MaterialIcon name="colorize" size={20} color="var(--muted-foreground)" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-silver-two rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary shadow-inner" />
                  <div>
                    <p className="font-bold text-sm">Action Accent</p>
                    <p className="text-xs font-mono text-muted-foreground uppercase">#256d00</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-secondary">
                  <MaterialIcon name="colorize" size={20} color="var(--muted-foreground)" />
                </Button>
              </div>
              <div className="pt-4 border-t border-border/60">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <Checkbox
                    checked={emailBranding}
                    onCheckedChange={(checked) => setEmailBranding(!!checked)}
                  />
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    Apply branding to automated emails
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-popover p-8 rounded-xl border border-border">
            <h2 className="text-lg font-bold text-primary mb-6">Social Integration</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Instagram</Label>
                <div className="flex items-center bg-silver-two rounded-lg px-4 py-2 gap-3">
                  <span className="text-muted-foreground opacity-50 text-sm">instagram.com/</span>
                  <Input
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="bg-transparent border-0 focus-visible:ring-0 p-0 text-sm font-medium h-auto shadow-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-widest font-bold">X (Twitter)</Label>
                <div className="flex items-center bg-silver-two rounded-lg px-4 py-2 gap-3">
                  <span className="text-muted-foreground opacity-50 text-sm">x.com/</span>
                  <Input
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="username"
                    className="bg-transparent border-0 focus-visible:ring-0 p-0 text-sm font-medium h-auto shadow-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-widest font-bold">LinkedIn Business</Label>
                <div className="flex items-center bg-silver-two rounded-lg px-4 py-2 gap-3">
                  <span className="text-muted-foreground opacity-50 text-sm">linkedin.com/company/</span>
                  <Input
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="bg-transparent border-0 focus-visible:ring-0 p-0 text-sm font-medium h-auto shadow-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary p-6 rounded-xl text-primary-foreground flex items-center justify-between">
            <div className="flex items-center gap-4">
              <MaterialIcon name="info" size={20} color="var(--secondary)" />
              <p className="text-sm font-medium">Unsaved changes detected</p>
            </div>
            <Button variant="secondary" size="sm">
              Save Changes
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}

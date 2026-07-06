"use client"

import { useEffect, useRef, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import MaterialIcon from "@/components/ui/material-icon"
import { business, upload } from "@/services/router"
import axios from "axios"
import { toast } from "sonner"

export default function BrandingPage() {
  const queryClient = useQueryClient()
  const { data: profileResponse } = business.getProfile.useQuery()
  const profile = profileResponse?.data

  const [description, setDescription] = useState("")
  const [emailBranding, setEmailBranding] = useState(true)

  const [logoUrl, setLogoUrl] = useState("")
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null)
  const [coverUrl, setCoverUrl] = useState("")
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null)
  const [logoProgress, setLogoProgress] = useState(0)
  const [coverProgress, setCoverProgress] = useState(0)

  const logoInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (profile?.businessDescription) {
      setDescription(profile.businessDescription)
    }
    if (profile?.businessLogo) {
      setLogoUrl(profile.businessLogo)
    }
    if (profile?.coverImage) {
      setCoverUrl(profile.coverImage)
    }
  }, [profile])

  const { mutate: uploadLogoMutation, isPending: isUploadingLogo } =
    upload.logo.useMutation({
      onSuccess: (response) => {
        setLogoProgress(0)
        if (response.data?.url) {
          setLogoUrl(response.data.url)
        }
      },
      onError: () => {
        setLogoProgress(0)
        toast.error("Logo upload failed. Please try again.")
        setLogoPreviewUrl(null)
      },
    })

  const { mutate: uploadCoverMutation, isPending: isUploadingCover } =
    upload.cover.useMutation({
      onSuccess: (response) => {
        setCoverProgress(0)
        if (response.data?.url) {
          setCoverUrl(response.data.url)
        }
      },
      onError: () => {
        setCoverProgress(0)
        toast.error("Cover upload failed. Please try again.")
        setCoverPreviewUrl(null)
      },
    })

  const handleLogoSelect = (file: File | null) => {
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo must be under 2MB.")
      return
    }

    setLogoPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
    uploadLogoMutation({ file, onProgress: setLogoProgress })
  }

  const handleCoverSelect = (file: File | null) => {
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Cover image must be under 2MB.")
      return
    }

    setCoverPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
    uploadCoverMutation({ file, onProgress: setCoverProgress })
  }

  const handleRemoveLogo = () => {
    setLogoPreviewUrl(null)
    setLogoUrl("")
    if (logoInputRef.current) logoInputRef.current.value = ""
  }

  const isDirty =
    !!profile &&
    (description !== (profile.businessDescription ?? "") ||
      logoUrl !== (profile.businessLogo ?? "") ||
      coverUrl !== (profile.coverImage ?? ""))

  const { mutate: saveProfile, isPending: isSaving } =
    business.profileEdit.useMutation({
      onSuccess: (response) => {
        toast.success(response.message || "Branding updated")
        queryClient.invalidateQueries({ queryKey: business.getProfile.getKey() })
      },
      onError: (error) => {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message
          : undefined
        toast.error(message || "Unable to update branding. Try again.")
      },
    })

  const handleSave = () => {
    if (!profile) return
    saveProfile({
      businessName: profile.businessName,
      businessDescription: description,
      businessAddress: profile.businessAddress,
      businessState: profile.businessState,
      location: profile.location,
      deliveryScope: profile.deliveryScope,
      fleetSize: profile.fleetSize,
      businessRegistrationNumber: profile.businessRegistrationNumber,
      taxIdentificationNumber: profile.taxIdentificationNumber,
      bvn: profile.bvn,
      contactNumber: profile.contactNumber,
      businessLogo: logoUrl,
      coverImage: coverUrl,
      operatingHours: profile.operatingHours,
    })
  }

  const logoSrc = logoPreviewUrl || logoUrl || null
  const coverSrc = coverPreviewUrl || coverUrl || null

  return (
    <div className="px-4 sm:px-8 lg:px-12 py-10">
      <div className="grid grid-cols-12 gap-8">
        {/* Brand Assets — 7 cols */}
        <section className="col-span-12 lg:col-span-7 space-y-8">
          <div className="bg-popover p-5 sm:p-8 rounded-xl border border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-primary">Brand Assets</h2>
              <span className="text-xs font-medium text-secondary bg-secondary/10 px-3 py-1 rounded-full">Primary Identity</span>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8 mb-10">
              <div className="relative group shrink-0">
                <div className="w-32 h-32 bg-silver-two rounded-2xl flex items-center justify-center border-2 border-dashed border-border hover:border-secondary transition-colors overflow-hidden relative">
                  {logoSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logoSrc} alt="Business logo" className="w-full h-full object-cover" />
                  ) : (
                    <MaterialIcon name="image" size={48} color="var(--muted-foreground)" />
                  )}
                  {isUploadingLogo && (
                    <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center gap-1.5 z-10 px-3">
                      <p className="text-xs font-semibold text-primary">{logoProgress}%</p>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all duration-150"
                          style={{ width: `${logoProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="default"
                  size="icon"
                  className="absolute -bottom-2 -right-2 rounded-lg shadow-md hover:scale-110 transition-transform"
                  onClick={() => logoInputRef.current?.click()}
                >
                  <MaterialIcon name="edit" size={16} color="white" />
                </Button>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleLogoSelect(e.target.files?.[0] ?? null)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Company Logo</Label>
                <p className="text-sm text-muted-foreground mb-4">Upload a high-resolution PNG or SVG. Recommended 512x512px.</p>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={isUploadingLogo}
                  >
                    Replace Logo
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveLogo}
                    disabled={isUploadingLogo || !logoSrc}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Storefront Cover</Label>
              <label className="w-full h-48 rounded-xl overflow-hidden relative group cursor-pointer block">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
                  <div className="bg-white/90 px-6 py-2 rounded-full flex items-center gap-2 font-bold text-primary">
                    <MaterialIcon name="image" size={18} color="var(--primary)" />
                    Change Cover
                  </div>
                </div>
                {coverSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coverSrc} alt="Storefront cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
                )}
                {isUploadingCover && (
                  <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center gap-1.5 z-20 px-6">
                    <p className="text-xs font-semibold text-primary">{coverProgress}%</p>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className="bg-primary h-1.5 rounded-full transition-all duration-150"
                        style={{ width: `${coverProgress}%` }}
                      />
                    </div>
                  </div>
                )}
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleCoverSelect(e.target.files?.[0] ?? null)}
                />
              </label>
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

        {/* Color Sidebar — 5 cols */}
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

          {isDirty && (
            <div className="bg-primary p-6 rounded-xl text-primary-foreground flex items-center justify-between">
              <div className="flex items-center gap-4">
                <MaterialIcon name="info" size={20} color="var(--secondary)" />
                <p className="text-sm font-medium">Unsaved changes detected</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSave}
                disabled={isSaving || isUploadingLogo || isUploadingCover}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

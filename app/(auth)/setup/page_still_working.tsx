"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import {
  ShieldCheck,
  Briefcase,
  SlidersHorizontal,
  Fingerprint,
  Check,
  Lock,
  Phone,
  MapPin,
  HelpCircle,
  User,
  ArrowRight,
  ArrowLeft,
  Info,
  Bike,
  Car,
  Truck,
  Package,
  ChevronDown,
  BadgeCheck,
  Upload,
  Store,
  Rocket,
  Eye,
  Globe,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────────

type ServiceTypes = {
  express: boolean;
  standard: boolean;
  scheduled: boolean;
};
type VehicleTypes = {
  motorcycle: boolean;
  bicycle: boolean;
  car: boolean;
  van: boolean;
};
type PackageCaps = {
  small: boolean;
  medium: boolean;
  large: boolean;
  heavy: boolean;
};

// ─── Top Navigation ─────────────────────────────────────────────────────────────

function TopNav({ step }: { step: number }) {
  const navLabels = [
    "Verification",
    "Business Details",
    "Operations",
    "Identity",
  ];
  return (
    <header className="bg-white border-b border-border px-4 md:px-8 h-14 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4 md:gap-10">
        <span className="text-xl font-bold tracking-tight">Drova</span>
        <nav className="hidden md:flex items-center gap-6">
          {navLabels.map((label, i) => (
            <span
              key={label}
              className={cn(
                "text-sm font-medium py-1 transition-colors",
                i + 1 === step
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground",
              )}
            >
              {label}
            </span>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <button className="size-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <HelpCircle size={15} />
        </button>
        <button className="size-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <User size={15} />
        </button>
      </div>
    </header>
  );
}

// ─── Sidebar (steps 2–4) ────────────────────────────────────────────────────────

function Sidebar({ step }: { step: number }) {
  const items = [
    { id: 1, label: "Verification", Icon: ShieldCheck },
    { id: 2, label: "Business Details", Icon: Briefcase },
    { id: 3, label: "Operations", Icon: SlidersHorizontal },
    { id: 4, label: "Identity", Icon: Fingerprint },
  ];
  return (
    <aside className="hidden md:flex w-56 bg-white border-r border-border py-6 px-3 flex-col shrink-0">
      <div className="px-3 mb-5">
        <p className="text-base font-bold">Onboarding</p>
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-0.5">
          Setup your business
        </p>
      </div>
      <nav className="flex flex-col gap-0.5">
        {items.map(({ id, label, Icon }) => (
          <div
            key={id}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              id === step
                ? "bg-primary text-primary-foreground"
                : id < step
                  ? "text-foreground"
                  : "text-muted-foreground",
            )}
          >
            <Icon size={16} />
            {label}
          </div>
        ))}
      </nav>
    </aside>
  );
}

// ─── Stepper components ─────────────────────────────────────────────────────────

function CircleStepper({ currentStep }: { currentStep: number }) {
  const steps = [
    { id: 1, label: "VERIFY" },
    { id: 2, label: "BUSINESS" },
    { id: 3, label: "OPS" },
    { id: 4, label: "ID" },
  ];
  return (
    <div className="flex items-center mb-10 flex-wrap gap-2">
      {steps.map(({ id, label }, i, arr) => (
        <React.Fragment key={id}>
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "size-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all",
                id < currentStep
                  ? "bg-primary text-primary-foreground border-primary"
                  : id === currentStep
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white text-muted-foreground border-border",
              )}
            >
              {id < currentStep ? <Check size={16} /> : id}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {label}
            </span>
          </div>
          {i < arr.length - 1 && (
            <div
              className={cn(
                "h-0.5 w-24 mb-5 mx-0.5 transition-colors",
                id < currentStep ? "bg-primary" : "bg-border",
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function LabeledStepper({ currentStep }: { currentStep: number }) {
  const steps = [
    { id: 1, label: "Verification" },
    { id: 2, label: "Business Details" },
    { id: 3, label: "Operations" },
    { id: 4, label: "Identity" },
  ];
  return (
    <div className="flex flex-wrap items-center mb-8 gap-2">
      {steps.map(({ id, label }, i, arr) => (
        <React.Fragment key={id}>
          <div className="flex items-center gap-2 shrink-0">
            <div
              className={cn(
                "size-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                id < currentStep
                  ? "bg-primary text-primary-foreground"
                  : id === currentStep
                    ? "bg-secondary text-white"
                    : "bg-muted text-muted-foreground border border-border",
              )}
            >
              {id < currentStep ? <Check size={14} /> : id}
            </div>
            <span
              className={cn(
                "text-sm font-semibold hidden sm:block",
                id === currentStep
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {label}
            </span>
          </div>
          {i < arr.length - 1 && (
            <div
              className={cn(
                "h-0.5 flex-1 mx-2 transition-colors",
                id < currentStep ? "bg-secondary" : "bg-border",
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function ProgressStepper() {
  const labels = ["VERIFICATION", "BUSINESS", "OPERATIONS", "IDENTITY"];
  return (
    <div className="mb-6">
      <div className="h-1.5 bg-border rounded-full overflow-hidden mb-3">
        <div className="h-full bg-primary rounded-full w-full" />
      </div>
      <div className="flex justify-between flex-wrap gap-1">
        {labels.map((label, i) => (
          <div key={label} className="flex items-center gap-1">
            {i < 3 && <Check size={12} className="text-primary" />}
            <span
              className={cn(
                "text-[10px] font-semibold uppercase tracking-wider",
                i < 3 ? "text-primary" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step1: Verification ───────────────────────────────────────────────────────

function Step1({
  otp,
  setOtp,
  onNext,
}: {
  otp: string;
  setOtp: (v: string) => void;
  onNext: () => void;
}) {
  return (
    <main className="flex-1 flex flex-col items-center py-10 px-4 md:px-8 overflow-y-auto">
      <CircleStepper currentStep={1} />

      <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-md w-full max-w-2xl">
        <div className="w-full md:w-52 bg-primary flex flex-col justify-between p-8 shrink-0">
          <div>
            <div className="w-8 h-1 bg-secondary rounded-full mb-6" />
            <h2 className="text-white font-bold text-2xl leading-snug">
              Securing
              <br />
              your
              <br />
              journey.
            </h2>
            <p className="text-white/60 text-sm mt-4 leading-relaxed">
              Verification ensures every partner in the Drova network is trusted
              and verified.
            </p>
          </div>
          <div className="flex items-center gap-2 mt-6">
            <div className="flex -space-x-2">
              <div className="size-7 rounded-full bg-amber-300 border-2 border-primary" />
              <div className="size-7 rounded-full bg-sky-300 border-2 border-primary" />
              <div className="size-7 rounded-full bg-rose-300 border-2 border-primary" />
            </div>
            <p className="text-white/80 text-xs leading-tight">
              Trusted by 2k+
              <br />
              businesses
            </p>
          </div>
        </div>

        <div className="flex-1 bg-white p-10 flex flex-col items-center justify-center">
          <div className="size-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
            <ShieldCheck size={30} className="text-secondary" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Verify your email.</h3>
          <p className="text-muted-foreground text-sm text-center mb-8 leading-relaxed">
            We&apos;ve sent a 6-digit code to your email
            <br />
            address. Enter it below to proceed.
          </p>

          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup className="flex gap-2 flex-wrap justify-center">
              {Array.from({ length: 6 }).map((_, i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="size-12 rounded-xl border-2 text-base font-bold"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          <Button
            onClick={onNext}
            className="w-full mt-8 h-12 text-base font-semibold rounded-xl"
          >
            Verify & Continue
            <ArrowRight size={18} className="ml-2" />
          </Button>

          <p className="text-muted-foreground text-sm mt-5 text-center">
            Didn&apos;t receive a code?{" "}
            <button className="text-primary font-semibold hover:underline">
              Resend Code
            </button>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-8 text-muted-foreground text-[11px] font-semibold uppercase tracking-widest">
        <Lock size={12} />
        End-to-end encrypted verification
      </div>
    </main>
  );
}

// ─── Step2: Business Details ────────────────────────────────────────────────────

function Step2({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [businessName, setBusinessName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [address, setAddress] = useState("");

  return (
    <main className="flex-1 flex flex-col items-center py-10 px-4 md:px-8 overflow-y-auto">
      <LabeledStepper currentStep={2} />

      <div className="flex flex-col md:flex-row w-full max-w-3xl gap-6">
        <aside className="w-full md:w-60 bg-primary text-white p-6 rounded-2xl flex flex-col justify-between shrink-0">
          <div>
            <h2 className="font-bold text-xl mb-2">Business Info</h2>
            <p className="text-white/70 text-sm leading-relaxed">
              Fill in your official business details to continue setup.
            </p>
          </div>
          <div className="flex items-center gap-2 mt-6">
            <Store size={24} />
            <span className="text-xs text-white/80">Trusted by hundreds of businesses</span>
          </div>
        </aside>

        <div className="flex-1 bg-white p-6 rounded-2xl flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <Label htmlFor="business-name">Business Name</Label>
              <Input
                id="business-name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Drova Logistics"
              />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="business-email">Business Email</Label>
              <Input
                id="business-email"
                type="email"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                placeholder="e.g. hello@drova.com"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <Label htmlFor="address">Business Address</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter full address"
              rows={3}
            />
          </div>

          <div className="flex justify-between mt-6 flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2 w-full md:w-auto"
            >
              <ArrowLeft size={16} /> Back
            </Button>
            <Button onClick={onNext} className="flex items-center gap-2 w-full md:w-auto">
              Continue <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Step3: Operations ─────────────────────────────────────────────────────────

function Step3({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [services, setServices] = useState<ServiceTypes>({
    express: false,
    standard: false,
    scheduled: false,
  });
  const [vehicles, setVehicles] = useState<VehicleTypes>({
    motorcycle: false,
    bicycle: false,
    car: false,
    van: false,
  });
  const [packages, setPackages] = useState<PackageCaps>({
    small: false,
    medium: false,
    large: false,
    heavy: false,
  });

  return (
    <main className="flex-1 flex flex-col items-center py-10 px-4 md:px-8 overflow-y-auto">
      <ProgressStepper />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
          <h4 className="font-semibold mb-2">Services Offered</h4>
          {(
            [
              { key: "express", label: "Express Delivery" },
              { key: "standard", label: "Standard Delivery" },
              { key: "scheduled", label: "Scheduled Delivery" },
            ] as const
          ).map(({ key, label }) => (
            <Checkbox
              key={key}
              checked={services[key]}
              onCheckedChange={(val) => setServices({ ...services, [key]: !!val })}
            >
              {label}
            </Checkbox>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
          <h4 className="font-semibold mb-2">Vehicle Types</h4>
          {(
            [
              { key: "motorcycle", label: "Motorcycle", Icon: Bike },
              { key: "bicycle", label: "Bicycle", Icon: Bike },
              { key: "car", label: "Car", Icon: Car },
              { key: "van", label: "Van", Icon: Truck },
            ] as const
          ).map(({ key, label, Icon }) => (
            <Checkbox
              key={key}
              checked={vehicles[key]}
              onCheckedChange={(val) => setVehicles({ ...vehicles, [key]: !!val })}
              className="flex items-center gap-2"
            >
              <Icon size={16} /> {label}
            </Checkbox>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
          <h4 className="font-semibold mb-2">Package Capacities</h4>
          {(
            [
              { key: "small", label: "Small" },
              { key: "medium", label: "Medium" },
              { key: "large", label: "Large" },
              { key: "heavy", label: "Heavy" },
            ] as const
          ).map(({ key, label }) => (
            <Checkbox
              key={key}
              checked={packages[key]}
              onCheckedChange={(val) => setPackages({ ...packages, [key]: !!val })}
            >
              {label}
            </Checkbox>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-6 flex-wrap gap-2 w-full max-w-4xl">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2 w-full md:w-auto">
          <ArrowLeft size={16} /> Back
        </Button>
        <Button onClick={onNext} className="flex items-center gap-2 w-full md:w-auto">
          Continue <ArrowRight size={16} />
        </Button>
      </div>
    </main>
  );
}

// ─── Step4: Identity ───────────────────────────────────────────────────────────

function Step4({ onBack }: { onBack: () => void }) {
  const [idType, setIdType] = useState("");
  const [idFile, setIdFile] = useState<File | null>(null);

  return (
    <main className="flex-1 flex flex-col items-center py-10 px-4 md:px-8 overflow-y-auto">
      <LabeledStepper currentStep={4} />

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl">
        <aside className="w-full md:w-60 bg-primary text-white p-6 rounded-2xl flex flex-col justify-between shrink-0">
          <h2 className="font-bold text-xl mb-2">Identity Verification</h2>
          <p className="text-white/70 text-sm">
            Upload a government-issued ID to verify your identity and complete onboarding.
          </p>
          <BadgeCheck size={28} className="mt-4" />
        </aside>

        <div className="flex-1 bg-white p-6 rounded-2xl flex flex-col gap-6">
          <div className="flex flex-col">
            <Label htmlFor="id-type">Select ID Type</Label>
            <select
              id="id-type"
              value={idType}
              onChange={(e) => setIdType(e.target.value)}
              className="mt-1 border rounded-lg p-2"
            >
              <option value="">Select ID</option>
              <option value="passport">Passport</option>
              <option value="driver">Driver's License</option>
              <option value="national">National ID</option>
            </select>
          </div>

          <div className="flex flex-col">
            <Label htmlFor="id-upload">Upload ID</Label>
            <input
              id="id-upload"
              type="file"
              onChange={(e) => setIdFile(e.target.files?.[0] || null)}
              className="mt-1"
            />
          </div>

          <div className="flex justify-between mt-6 flex-wrap gap-2">
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2 w-full md:w-auto">
              <ArrowLeft size={16} /> Back
            </Button>
            <Button onClick={() => alert("Onboarding complete!")} className="flex items-center gap-2 w-full md:w-auto">
              Finish <Rocket size={16} />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Main SetupPage ────────────────────────────────────────────────────────────

export default function SetupPage() {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <TopNav step={step} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar step={step} />
        {step === 1 && <Step1 otp={otp} setOtp={setOtp} onNext={nextStep} />}
        {step === 2 && <Step2 onNext={nextStep} onBack={prevStep} />}
        {step === 3 && <Step3 onNext={nextStep} onBack={prevStep} />}
        {step === 4 && <Step4 onBack={prevStep} />}
      </div>
    </div>
  );
}
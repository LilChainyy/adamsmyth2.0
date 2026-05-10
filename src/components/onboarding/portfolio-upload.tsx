"use client";

import { useState } from "react";
import { Keyboard, Upload } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CSVUpload } from "@/components/onboarding/CSVUpload";
import { ManualEntry } from "@/components/onboarding/manual-entry";

type Step = "choose" | "manual" | "csv";

export function PortfolioUpload() {
  const [step, setStep] = useState<Step>("choose");

  return (
    <div className="flex flex-col gap-6">
      {/* Progress indicator */}
      <div className="flex items-center gap-2">
        <div className={`flex size-6 items-center justify-center rounded-full text-xs font-bold ${
          step === "choose" ? "bg-amber-700 text-white" : "bg-amber-200 text-amber-800"
        }`}>
          1
        </div>
        <div className="h-0.5 flex-1 bg-amber-200">
          <div className={`h-full bg-amber-700 transition-all ${
            step !== "choose" ? "w-full" : "w-0"
          }`} />
        </div>
        <div className={`flex size-6 items-center justify-center rounded-full text-xs font-bold ${
          step !== "choose" ? "bg-amber-700 text-white" : "bg-amber-200 text-amber-800"
        }`}>
          2
        </div>
      </div>
      <p className="text-xs text-stone-500">
        Step {step === "choose" ? "1" : "2"} of 2
      </p>

      {step === "choose" && (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-bold text-stone-800">
              Let&apos;s start by adding your stocks
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              We&apos;ll use these to personalize your learning journey.
            </p>
          </div>

          <Card
            className="cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => setStep("manual")}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-amber-100 p-2">
                  <Keyboard className="size-5 text-amber-700" />
                </div>
                <div>
                  <CardTitle>Type them in</CardTitle>
                  <CardDescription>Manually add your stock tickers</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card
            className="cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => setStep("csv")}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-amber-100 p-2">
                  <Upload className="size-5 text-amber-700" />
                </div>
                <div>
                  <CardTitle>Upload CSV</CardTitle>
                  <CardDescription>Import from your brokerage export</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      )}

      {step === "manual" && (
        <ManualEntry onBack={() => setStep("choose")} />
      )}

      {step === "csv" && (
        <CSVUpload onBack={() => setStep("choose")} />
      )}
    </div>
  );
}

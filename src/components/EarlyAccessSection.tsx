import { useState } from "react";
import { motion } from "framer-motion";
import { Server, Terminal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const hearAboutOptions = [
  "Twitter/X",
  "LinkedIn",
  "Friend/Referral",
  "Startup Event",
  "News Article",
  "Other",
];

const useCaseOptions = [
  "AI/ML Training",
  "Inference",
  "Rendering",
  "General Compute",
  "Data Processing",
  "Other",
];

const budgetOptions = [
  "Under $500",
  "$500–$2K",
  "$2K–$10K",
  "$10K+",
  "Not sure yet",
];

const hardwareTypes = ["GPU", "CPU", "Storage", "Mixed"];

const inputClass =
  "w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 transition-shadow";

const selectClass =
  "w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 transition-shadow appearance-none";

const labelClass = "block text-sm font-medium text-foreground mb-1.5";

const EarlyAccessSection = () => {
  const [tab, setTab] = useState<"provider" | "renter">("provider");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = { role: tab };
    formData.forEach((value, key) => {
      if (key === "hardwareType") {
        const existing = data[key];
        if (Array.isArray(existing)) {
          existing.push(value);
        } else if (existing) {
          data[key] = [existing, value];
        } else {
          data[key] = [value];
        }
      } else {
        data[key] = value;
      }
    });
    console.log("Early Access Submission:", data);
    toast({
      title: "You're on the list!",
      description: "We'll be in touch within 48 hours.",
    });
    e.currentTarget.reset();
  };

  return (
    <section id="early-access" className="bg-background py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl"
        >
          <h2 className="text-center text-3xl font-bold text-foreground">
            Join the Waitlist
          </h2>
          <p className="mt-3 text-center text-base text-muted-foreground">
            Be among the first to access decentralized compute in Saudi Arabia.
          </p>

          {/* Tabs */}
          <div className="mt-10 flex border-b border-border">
            <button
              type="button"
              onClick={() => setTab("provider")}
              className={`flex items-center gap-2 px-5 pb-3 text-sm font-medium transition-colors ${
                tab === "provider"
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Server size={16} />
              I Have Hardware
            </button>
            <button
              type="button"
              onClick={() => setTab("renter")}
              className={`flex items-center gap-2 px-5 pb-3 text-sm font-medium transition-colors ${
                tab === "renter"
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Terminal size={16} />
              I Need Compute
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Shared fields */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className={labelClass}>Full Name *</label>
                <input id="fullName" name="fullName" type="text" required className={inputClass} placeholder="Your full name" />
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>Email *</label>
                <input id="email" name="email" type="email" required className={inputClass} placeholder="you@company.com" />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className={labelClass}>Phone</label>
                <input id="phone" name="phone" type="tel" className={inputClass} placeholder="+966" />
              </div>
              <div>
                <label htmlFor="company" className={labelClass}>Company / Organization</label>
                <input id="company" name="company" type="text" className={inputClass} placeholder="Your company" />
              </div>
            </div>

            {tab === "provider" ? (
              /* Provider-specific fields */
              <>
                <div>
                  <label htmlFor="city" className={labelClass}>City *</label>
                  <input id="city" name="city" type="text" required className={inputClass} placeholder="e.g. Riyadh, Jeddah" />
                </div>

                <div>
                  <label className={labelClass}>Hardware Type *</label>
                  <div className="flex flex-wrap gap-4 mt-1">
                    {hardwareTypes.map((hw) => (
                      <label key={hw} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                        <input
                          type="checkbox"
                          name="hardwareType"
                          value={hw}
                          className="h-4 w-4 rounded border-border bg-muted text-primary accent-primary"
                        />
                        {hw}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="gpuModels" className={labelClass}>GPU Models</label>
                    <input id="gpuModels" name="gpuModels" type="text" className={inputClass} placeholder="e.g. RTX 4090, A100" />
                  </div>
                  <div>
                    <label htmlFor="units" className={labelClass}>Number of Units</label>
                    <input id="units" name="units" type="number" min="1" className={inputClass} placeholder="e.g. 10" />
                  </div>
                </div>

                <div>
                  <label htmlFor="powerCost" className={labelClass}>Monthly Power Cost (SAR)</label>
                  <input id="powerCost" name="powerCost" type="number" min="0" className={inputClass} placeholder="e.g. 5000" />
                </div>
              </>
            ) : (
              /* Renter-specific fields */
              <>
                <div>
                  <label htmlFor="useCase" className={labelClass}>Use Case *</label>
                  <select id="useCase" name="useCase" required className={selectClass} defaultValue="">
                    <option value="" disabled>Select use case</option>
                    {useCaseOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="gpuPreference" className={labelClass}>GPU Preference</label>
                    <input id="gpuPreference" name="gpuPreference" type="text" className={inputClass} placeholder="e.g. A100, H100, RTX 4090" />
                  </div>
                  <div>
                    <label htmlFor="budget" className={labelClass}>Estimated Monthly Budget</label>
                    <select id="budget" name="budget" className={selectClass} defaultValue="">
                      <option value="" disabled>Select budget range</option>
                      {budgetOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Shared bottom fields */}
            <div>
              <label htmlFor="hearAbout" className={labelClass}>How did you hear about us?</label>
              <select id="hearAbout" name="hearAbout" className={selectClass} defaultValue="">
                <option value="" disabled>Select one</option>
                {hearAboutOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="message" className={labelClass}>Message / Notes</label>
              <textarea
                id="message"
                name="message"
                rows={3}
                className={inputClass}
                placeholder="Anything else you'd like us to know?"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground transition-all hover:brightness-110 hover:shadow-[0_0_30px_hsl(37_91%_55%/0.25)]"
            >
              Request Early Access
            </button>

            <p className="text-center text-xs text-muted-foreground">
              We'll reach out within 48 hours.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default EarlyAccessSection;

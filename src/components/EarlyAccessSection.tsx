import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Server, Terminal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import { useGPUDetection } from "@/contexts/GPUContext";
import { ENERGY } from "@/lib/gpu-data";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { isKnown, gpuDisplayName, gpuInfo, detectedGPU } = useGPUDetection();
  const { t, lang } = useLanguage();

  useEffect(() => {
    if (!isKnown || !gpuInfo) return;
    const gpuInput = document.getElementById("gpuModels") as HTMLInputElement | null;
    if (gpuInput && !gpuInput.value) gpuInput.value = gpuDisplayName;
    const gpuCheckbox = document.querySelector('input[name="hardwareType"][value="GPU"]') as HTMLInputElement | null;
    if (gpuCheckbox && !gpuCheckbox.checked) gpuCheckbox.checked = true;
    const powerInput = document.getElementById("powerCost") as HTMLInputElement | null;
    if (powerInput && !powerInput.value) {
      const monthlyCostSAR = Math.round((gpuInfo.tdp * 1.3 / 1000) * ENERGY.dc1 * 720 * 3.75);
      powerInput.value = String(monthlyCostSAR);
    }
  }, [isKnown, gpuInfo, gpuDisplayName, tab]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const email = (formData.get("email") as string).trim();
    const fullName = (formData.get("fullName") as string).trim();

    const { count } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true })
      .eq("email", email);

    if (count && count > 0) {
      toast({
        title: t("waitlist.already_registered"),
        description: t("waitlist.already_registered_desc"),
        variant: "destructive",
      });
      setSubmitting(false);
      return;
    }

    const hwTypes = formData.getAll("hardwareType") as string[];

    const insertData = {
      type: tab,
      full_name: fullName,
      email,
      phone: (formData.get("phone") as string) || null,
      company: (formData.get("company") as string) || null,
      heard_from: (formData.get("hearAbout") as string) || null,
      message: (formData.get("message") as string) || null,
      location_city: tab === "provider" ? ((formData.get("city") as string) || null) : null,
      hardware_type: tab === "provider" && hwTypes.length > 0 ? hwTypes : null,
      gpu_models: tab === "provider" ? ((formData.get("gpuModels") as string) || null) : null,
      num_units: tab === "provider" && formData.get("units") ? Number(formData.get("units")) : null,
      monthly_power_cost_sar: tab === "provider" && formData.get("powerCost") ? Number(formData.get("powerCost")) : null,
      use_case: tab === "renter" ? ((formData.get("useCase") as string) || null) : null,
      gpu_preference: tab === "renter" ? ((formData.get("gpuPreference") as string) || null) : null,
      monthly_budget: tab === "renter" ? ((formData.get("budget") as string) || null) : null,
    };

    const { error } = await supabase.from("waitlist").insert([insertData]);

    if (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
      setSubmitting(false);
      return;
    }

    supabase.functions.invoke("notify-signup", { body: { record: insertData } }).catch(console.error);
    await trackEvent("form_submit", { type: tab, email, lang });

    toast({
      title: t("waitlist.on_the_list"),
      description: t("waitlist.be_in_touch"),
    });

    form.reset();
    setSubmitting(false);
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
            {t("waitlist.title")}
          </h2>
          <p className="mt-3 text-center text-base text-muted-foreground">
            {t("waitlist.subtitle")}
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
              {t("waitlist.i_have_hardware")}
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
              {t("waitlist.i_need_compute")}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className={labelClass}>{t("waitlist.full_name")} *</label>
                <input id="fullName" name="fullName" type="text" required className={inputClass} placeholder={t("placeholder.full_name")} />
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>{t("waitlist.email")} *</label>
                <input id="email" name="email" type="email" required className={inputClass} placeholder={t("placeholder.company_email")} />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className={labelClass}>{t("waitlist.phone")}</label>
                <input id="phone" name="phone" type="tel" className={inputClass} placeholder={t("placeholder.phone")} />
              </div>
              <div>
                <label htmlFor="company" className={labelClass}>{t("waitlist.company")}</label>
                <input id="company" name="company" type="text" className={inputClass} placeholder={t("placeholder.company")} />
              </div>
            </div>

            {tab === "provider" ? (
              <>
                <div>
                  <label htmlFor="city" className={labelClass}>{t("waitlist.city")} *</label>
                  <input id="city" name="city" type="text" required className={inputClass} placeholder={t("placeholder.city")} />
                </div>

                <div>
                  <label className={labelClass}>{t("waitlist.hardware_type")} *</label>
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
                    <label htmlFor="gpuModels" className={labelClass}>{t("waitlist.gpu_models")}</label>
                    <input id="gpuModels" name="gpuModels" type="text" className={inputClass} placeholder={t("placeholder.gpu_models")} />
                  </div>
                  <div>
                    <label htmlFor="units" className={labelClass}>{t("waitlist.num_units")}</label>
                    <input id="units" name="units" type="number" min="1" className={inputClass} placeholder={t("placeholder.units")} />
                  </div>
                </div>

                <div>
                  <label htmlFor="powerCost" className={labelClass}>{t("waitlist.power_cost")}</label>
                  <input id="powerCost" name="powerCost" type="number" min="0" className={inputClass} placeholder={t("placeholder.power_cost")} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="useCase" className={labelClass}>{t("waitlist.use_case")} *</label>
                  <select id="useCase" name="useCase" required className={selectClass} defaultValue="">
                    <option value="" disabled>{t("select.use_case")}</option>
                    {useCaseOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="gpuPreference" className={labelClass}>{t("waitlist.gpu_preference")}</label>
                    <input id="gpuPreference" name="gpuPreference" type="text" className={inputClass} placeholder={t("placeholder.gpu_preference")} />
                  </div>
                  <div>
                    <label htmlFor="budget" className={labelClass}>{t("waitlist.budget")}</label>
                    <select id="budget" name="budget" className={selectClass} defaultValue="">
                      <option value="" disabled>{t("select.budget")}</option>
                      {budgetOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="hearAbout" className={labelClass}>{t("waitlist.hear_about")}</label>
              <select id="hearAbout" name="hearAbout" className={selectClass} defaultValue="">
                <option value="" disabled>{t("select.hear_about")}</option>
                {hearAboutOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="message" className={labelClass}>{t("waitlist.message")}</label>
              <textarea
                id="message"
                name="message"
                rows={3}
                className={inputClass}
                placeholder={t("placeholder.message")}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground transition-all hover:brightness-110 hover:shadow-[0_0_30px_hsl(37_91%_55%/0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? t("waitlist.submitting") : t("waitlist.submit")}
            </button>

            <p className="text-center text-xs text-muted-foreground">
              {t("waitlist.reach_out")}
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default EarlyAccessSection;

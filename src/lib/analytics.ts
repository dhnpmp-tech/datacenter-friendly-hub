import { supabase } from "@/integrations/supabase/client";
import { getCookieConsent } from "@/components/CookieConsent";

export const trackEvent = async (
  event: "page_view" | "cta_click" | "form_start" | "form_submit",
  metadata: Record<string, string | number | boolean> = {}
) => {
  if (getCookieConsent() === "declined") return;
  try {
    await supabase.from("page_analytics").insert([{ event, metadata: metadata as unknown as Record<string, never> }]);
  } catch (err) {
    console.error("Analytics error:", err);
  }
};

import { HomePage } from "@/components/home-page";
import { getCachedStripePriceCatalog } from "@/lib/stripe-price-fetch";

/** Avoid prerendering the landing with a frozen fallback catalog; refresh from Stripe on an ISR cadence. */
export const revalidate = 300;
export const dynamic = "force-dynamic";

export default async function Page() {
  const stripeCatalog = await getCachedStripePriceCatalog();
  return <HomePage stripeCatalog={stripeCatalog} />;
}

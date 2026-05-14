import { HomePage } from "@/components/home-page";
import { getCachedStripePriceCatalog } from "@/lib/stripe-price-fetch";

export default async function Page() {
  const stripeCatalog = await getCachedStripePriceCatalog();
  return <HomePage stripeCatalog={stripeCatalog} />;
}

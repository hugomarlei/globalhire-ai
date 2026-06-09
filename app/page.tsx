import { HomePage } from "@/components/home-page";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export default async function Page() {
  return <HomePage stripeCatalog={null} />;
}

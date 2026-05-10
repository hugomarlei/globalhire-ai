import { AtsAnalyzer } from "@/components/ats-analyzer";

export default async function AtsScorePage({ searchParams }: { searchParams?: Promise<{ modo?: string }> }) {
  const params = searchParams ? await searchParams : {};
  return <AtsAnalyzer mode={params.modo === "keywords" ? "keywords" : "score"} />;
}

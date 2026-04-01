import { Suspense } from "react";
import { HomeClient } from "./HomeClient";
import { BestDecisionToday } from "@/components/BestDecisionToday";

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
      <Suspense>
        <HomeClient />
      </Suspense>
      <BestDecisionToday />
    </main>
  );
}

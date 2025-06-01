import { conditionsText } from "@/data/conditionsText";
import Link from "next/link";

export default function ConditionsPage() {
  return (
    <main className="py-16 px-6 sm:px-12 md:px-24 lg:px-40">
      <h1 className="text-3xl font-bold mb-6">Conditions of Use</h1>
      <div className="space-y-4 text-base leading-relaxed">
        {conditionsText.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
        <div className="mt-10 text-sm">
          <p>
            Also see our{" "}
            <Link
              href="/privacy"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Privacy Notice
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}

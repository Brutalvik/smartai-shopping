import { privacyText } from "@/data/privacyText";
import { Link } from "@heroui/link";

export default function PrivacyPage() {
  return (
    <main className=" sm:px-6 md:px-10 lg:px-20">
      <h1 className="text-3xl font-bold mb-6">Privacy Notice</h1>
      <div className="space-y-4 text-base leading-relaxed">
        {privacyText.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
        <div className="mt-10 text-sm">
          <p>
            Also see our{" "}
            <Link
              href="/conditions"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Conditions of Use
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}

import { privacyText } from "@/data/privacyText";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen py-16 px-6 sm:px-12 md:px-24 lg:px-40 bg-white text-black">
      <h1 className="text-3xl font-bold mb-6">Privacy Notice</h1>
      <div className="space-y-4 text-base leading-relaxed">
        {privacyText.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </main>
  );
}

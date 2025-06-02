import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-4 md:py-4">
      <div className="mt-2">
        <HeroSection />
      </div>
    </section>
  );
}

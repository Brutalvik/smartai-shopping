// app/nda/page.tsx
"use client";

import NdaAgreementModal from "@/components/NDAAgreement";

export default function NdaPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <NdaAgreementModal />
    </div>
  );
}

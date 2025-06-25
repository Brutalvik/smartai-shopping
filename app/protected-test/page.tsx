// app/protected-test/page.tsx

import ProtectedLayout from "@/layouts/ProtectedLayout";

export default function TestProtectedPage() {
  return (
    <ProtectedLayout redirectPath="/auth/signin?redirect=/protected-test">
      <div className="p-10 text-green-600 text-xl">Protected Test Works ✅</div>
    </ProtectedLayout>
  );
}

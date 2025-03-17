"use client";

import dynamic from "next/dynamic";

// Sử dụng dynamic import trong Client Component là an toàn
const GoogleApiKeyInput = dynamic(
  () => import("@/components/features/api-key/GoogleApiKeyInput"),
  { ssr: false }
);

export default function ClientApiKeyWrapper() {
  return <GoogleApiKeyInput />;
} 
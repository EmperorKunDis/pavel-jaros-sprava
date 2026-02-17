"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function RootPage() {
  const router = useRouter();
  useEffect(() => {
    const lang = navigator.language?.split("-")[0] || "cs";
    const supported = ["cs", "en", "de", "pl", "sk", "ru"];
    const locale = supported.includes(lang) ? lang : "cs";
    router.replace(`/${locale}`);
  }, [router]);
  return null;
}
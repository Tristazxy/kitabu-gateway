import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kitabu cha Wageni" },
      { name: "description", content: "Guestbook assistant for a small coffee-farm host · works offline" },
      { property: "og:title", content: "Kitabu cha Wageni" },
      { property: "og:description", content: "Guestbook assistant for a small coffee-farm host · works offline" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    window.location.replace("/kitabu/index.html");
  }, []);

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4 text-center"
      style={{ backgroundColor: "#F3F2EC", color: "#24533F", fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      <h1 className="text-3xl font-bold">Kitabu cha Wageni</h1>
      <p className="mt-3 text-sm">Guestbook assistant for a small coffee-farm host · works offline</p>
      <a
        href="/kitabu/index.html"
        className="mt-6 text-sm font-medium underline underline-offset-4"
        style={{ color: "#24533F" }}
      >
        Fungua · Open
      </a>
    </div>
  );
}

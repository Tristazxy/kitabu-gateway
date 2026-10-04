import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WeKaribu — guests write in their language, the host hears it in hers" },
      { name: "description", content: "Small AI for small tourism hosts: feedback, bookings and SMS that work offline · Swahili first" },
      { property: "og:title", content: "WeKaribu — guests write in their language, the host hears it in hers" },
      { property: "og:description", content: "Small AI for small tourism hosts: feedback, bookings and SMS that work offline · Swahili first" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://wekaribu.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://wekaribu.lovable.app/" }],
  }),
  staticData: { sitemap: true },
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
      <h1 className="text-3xl font-bold">WeKaribu — guests write in their language, the host hears it in hers</h1>
      <p className="mt-3 text-sm">Small AI for small tourism hosts: feedback, bookings and SMS that work offline · Swahili first</p>
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

import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "Collections — Dénvie by Denise" },
      { name: "description", content: "Explore Dénvie's curated collections — new arrivals, best sellers, and seasonal capsules." },
    ],
  }),
  component: CollectionsLayout,
});

function CollectionsLayout() {
  return <Outlet />;
}
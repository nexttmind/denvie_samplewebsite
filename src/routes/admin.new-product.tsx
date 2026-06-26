import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/new-product")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});

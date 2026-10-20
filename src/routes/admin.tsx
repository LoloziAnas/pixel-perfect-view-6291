import { createFileRoute, redirect } from "@tanstack/react-router";

// The product editor is a static page (public/admin/index.html); send /admin there.
export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    throw redirect({ href: "/admin/index.html", reloadDocument: true });
  },
});

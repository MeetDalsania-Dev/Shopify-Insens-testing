import { redirect } from "next/navigation";

/** Root — redirect to dashboard (middleware protects it) */
export default function RootPage() {
  redirect("/dashboard");
}

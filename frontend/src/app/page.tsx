import { redirect } from "next/navigation";

export default function Home() {
  // Fresh production build trigger: redirect root to dashboard
  redirect("/dashboard");
}

import type { Metadata } from "next";

import { LoginScreen } from "@/components/screens/login-screen";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Bridgewater Interiors predictive maintenance demo access for the asset health command center.",
};

export default function LoginPage() {
  return <LoginScreen />;
}

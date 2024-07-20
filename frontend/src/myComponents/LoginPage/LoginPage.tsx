import { SignIn } from "@clerk/clerk-react";

export default function LoginPage() {
  return (
    <header className="flex justify-center items-center h-screen">
      <SignIn redirectUrl="/" />
    </header>
  );
}

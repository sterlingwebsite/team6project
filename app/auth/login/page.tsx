import LoginForm from "@/components/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAFAFA] px-6 py-12">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm space-y-6">
        
        <div className="text-center space-y-2">
          <span className="text-4xl">🏛️</span>
          <h1 className="text-3xl font-serif font-bold text-[#1A2530] tracking-tight">
            Sign In to Your Journal
          </h1>
          <p className="text-sm text-zinc-500">
            Access your sacred milestones and spiritual reflections.
          </p>
        </div>

        <LoginForm />

        <div className="text-center pt-2 border-t border-zinc-100 text-sm text-zinc-500">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="font-semibold text-[#D4AF37] hover:underline">
            Register Here
          </Link>
        </div>

      </div>
    </div>
  );
}

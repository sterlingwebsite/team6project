// app/auth/login/page.tsx
import LoginForm from "@/components/LoginForm";
import Link from "next/link";
import PublicHeader from "@/components/PublicHeader";
import Footer from "@/components/Footer";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A2530] flex flex-col justify-between">
      {/* Structural layout context for unauthenticated paths */}
      <PublicHeader />

      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm space-y-6">
          
          <div className="text-center space-y-2">
            <span className="text-4xl" aria-hidden="true">🏛️</span>
            <h1 className="text-3xl font-serif font-bold text-[#1A2530] tracking-tight">
              Sign In to Your Journal
            </h1>
            {/* Boosted contrast from text-zinc-500 to text-zinc-600 */}
            <p className="text-sm text-zinc-600">
              Access your sacred milestones and spiritual reflections.
            </p>
          </div>

          <LoginForm />

          {/* Boosted contrast on the layout borders and label text structures */}
          <div className="text-center pt-4 border-t border-zinc-100 text-sm text-zinc-600">
            Don&apos;t have an account?{" "}
            <Link 
              href="/auth/signup" 
              className="font-semibold text-[#6E5611] hover:underline focus:outline-2 focus:outline-offset-2 focus:outline-[#6E5611]"
            >
              Register Here
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

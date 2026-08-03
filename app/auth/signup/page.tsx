// app/auth/signup/page.tsx
import RegisterForm from "@/components/RegisterForm";
import PublicHeader from "@/components/PublicHeader";
import Footer from "@/components/Footer";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A2530] flex flex-col justify-between">
      {/* Structural navigation header for unauthenticated users */}
      <PublicHeader />

      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12">
        <RegisterForm />
      </main>

      {/* Accessible high-contrast footer element */}
      <Footer />
    </div>
  );
}

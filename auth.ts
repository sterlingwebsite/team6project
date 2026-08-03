// auth.ts
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
    }
  }
}

export const auth = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("next-auth.session-token")?.value;

    if (token && token.startsWith("session-valid-for-")) {
      const emailFromCookie = token.replace("session-valid-for-", "");
      
      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB || "team6project");
      
      const user = await db.collection("users").findOne({ email: emailFromCookie });
      
      if (user) {
        return {
          user: {
            id: user._id.toString(),
            name: user.name || "User",
            email: user.email
          }
        };
      }
    }
  } catch (e) {
    console.error("Failed to parse fallback session cookies:", e);
  }
  return null;
};

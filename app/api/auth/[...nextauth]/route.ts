// app/api/auth/[...nextauth]/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

const mockProviders = {
  credentials: {
    id: "credentials",
    name: "Credentials",
    type: "credentials",
    signinUrl: "/api/auth/signin/credentials",
    callbackUrl: "/dashboard"
  }
};

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path.endsWith("/providers")) {
    return NextResponse.json(mockProviders, { status: 200 });
  }

  if (path.endsWith("/session")) {
    const authCookie = request.cookies.get("next-auth.session-token")?.value;
    
    if (authCookie && authCookie.startsWith("session-valid-for-")) {
      try {
        const emailFromCookie = authCookie.replace("session-valid-for-", "");
        
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB || "team6project");
        
        const user = await db.collection("users").findOne({ email: emailFromCookie });
        
        if (user) {
          return NextResponse.json({
            user: {
              id: user._id.toString(),
              name: user.name || "User",
              email: user.email
            },
            expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
          }, { status: 200 });
        }
      } catch (dbError) {
        console.error("Session lookup database parsing failure:", dbError);
      }
    }
    
    return NextResponse.json({}, { status: 200 });
  }

  return NextResponse.json({ message: "Auth endpoint initialized." }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path.endsWith("/signout")) {
    const response = NextResponse.json({ success: true, message: "Logged out cleanly." }, { status: 200 });
    response.cookies.set("next-auth.session-token", "", { path: "/", maxAge: 0 });
    return response;
  }

  if (path.includes("/callback/credentials") || path.includes("/signin/credentials") || path.endsWith("/signin")) {
    try {
      let email = "";
      let password = "";

      const rawBodyText = await request.text().catch(() => "");
      
      if (rawBodyText.trim()) {
        try {
          const jsonBody = JSON.parse(rawBodyText);
          email = jsonBody.email || "";
          password = jsonBody.password || "";
        } catch {
          const searchParams = new URLSearchParams(rawBodyText);
          email = searchParams.get("email") || "";
          password = searchParams.get("password") || "";
        }
      }

      if (!email && !password) {
        const formData = await request.formData().catch(() => null);
        email = formData?.get("email")?.toString() || "";
        password = formData?.get("password")?.toString() || "";
      }

      if (!email || !password) {
        return NextResponse.json({ error: "Missing credential inputs" }, { status: 400 });
      }

      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB || "team6project");
      
      const user = await db.collection("users").findOne({ 
        email: email.trim().toLowerCase() 
      });

      if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
        return NextResponse.json({ error: "Invalid email or password credentials supplied" }, { status: 401 });
      }

      const response = NextResponse.json({ url: "/dashboard" }, { status: 200 });

      response.cookies.set("next-auth.session-token", `session-valid-for-${user.email}`, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 2
      });

      return response;

    } catch (err) {
      console.error("Native internal processing credential error:", err);
      return NextResponse.json({ error: "Authentication system failure." }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true }, { status: 200 });
}

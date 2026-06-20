import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

/**
 * Fetches the currently authenticated user from Supabase and their corresponding
 * profile from the Prisma database.
 * 
 * Wrapped in React `cache()` so it only executes once per request lifecycle
 * even if called across multiple layouts and server components.
 */
export const getAuthenticatedUser = cache(async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { authUser: null, dbUser: null };
  }

  let dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  });

  if (!dbUser) {
    // Auto-create user record for OAuth / OTP sign-ins
    dbUser = await prisma.user.create({
      data: {
        supabaseId: user.id,
        email: user.email!,
        name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
        avatarUrl: user.user_metadata?.avatar_url || null,
      }
    });
  }

  return { authUser: user, dbUser };
});

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { validateCFHandle } from "@/lib/integrations/codeforces";
import { validateLCHandle } from "@/lib/integrations/leetcode";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cfHandle, lcHandle } = await request.json();

    if (cfHandle) {
      const isValid = await validateCFHandle(cfHandle.trim());
      if (!isValid) {
        return NextResponse.json({ error: `Codeforces handle '${cfHandle}' is invalid or does not exist.` }, { status: 400 });
      }
    }

    if (lcHandle) {
      const isValid = await validateLCHandle(lcHandle.trim());
      if (!isValid) {
        return NextResponse.json({ error: `LeetCode username '${lcHandle}' is invalid or does not exist.` }, { status: 400 });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { supabaseId: user.id },
      data: {
        cfHandle: cfHandle !== undefined ? cfHandle : undefined,
        lcHandle: lcHandle !== undefined ? lcHandle : undefined,
      }
    });

    return NextResponse.json({ success: true, user: updatedUser });

  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: error.message || "Failed to update profile" }, { status: 500 });
  }
}

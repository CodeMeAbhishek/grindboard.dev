import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
 let supabaseResponse = NextResponse.next({
 request,
 });

 const supabase = createServerClient(
 process.env.NEXT_PUBLIC_SUPABASE_URL!,
 process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
 {
 cookies: {
 getAll() {
 return request.cookies.getAll();
 },
 setAll(cookiesToSet) {
 cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
 supabaseResponse = NextResponse.next({
 request,
 });
 cookiesToSet.forEach(({ name, value, options }) =>
 supabaseResponse.cookies.set(name, value, options)
 );
 },
 },
 }
 );

 // refreshing the auth token
 const {
 data: { user },
 } = await supabase.auth.getUser();

 // protect routes inside /(app)
 const publicRoutes = ["/", "/about", "/contact", "/privacy", "/terms", "/login", "/sitemap.xml", "/robots.txt"];
 const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname) || 
                       request.nextUrl.pathname.startsWith("/api/auth") ||
                       request.nextUrl.pathname.startsWith("/api/cron");
 
 if (!user && !isPublicRoute) {
 const url = request.nextUrl.clone();
 url.pathname = "/login";
 return NextResponse.redirect(url);
 }

 // If user is logged in and trying to access /login, redirect to feed
 if (user && request.nextUrl.pathname.startsWith("/login")) {
 const url = request.nextUrl.clone();
 url.pathname = "/feed";
 return NextResponse.redirect(url);
 }

 return supabaseResponse;
}

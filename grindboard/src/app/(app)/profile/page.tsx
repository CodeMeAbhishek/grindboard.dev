import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/data";

export default async function ProfilePage() {
 const { authUser, dbUser } = await getAuthenticatedUser();

 if (!authUser || !dbUser) {
   redirect("/login");
 }

 redirect(`/u/${dbUser.username || dbUser.id}`);
}

import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/auth-utils";

export default async function ProfilePage() {
	const session = await requireAuth();
	const name = session.user.name;
	if (!name) redirect("/profile/settings");
	redirect(`/user/${encodeURIComponent(name)}`);
}

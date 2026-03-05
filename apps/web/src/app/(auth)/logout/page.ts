"use client";

import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
	const router = useRouter();

	useEffect(() => {
		authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/signup");
				},
			},
		});
	}, [router]);

	return null;
}

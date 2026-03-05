import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Returns the current user's better-auth session token for use with socket.io-client.
 * The token is validated server-side — never exposed in HTML or meta tags.
 */
export async function GET() {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	return NextResponse.json({ token: session.session.token });
}

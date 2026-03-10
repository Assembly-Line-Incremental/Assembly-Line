import { env } from "@/env";
import { ALL_PROVIDERS } from "./oauth-providers";

export type { OAuthProvider } from "./oauth-providers";

export function getEnabledProviders() {
	// When proxying auth to another server (e.g. previews → prod), all providers are available.
	if (env.NEXT_PUBLIC_AUTH_URL) return ALL_PROVIDERS;

	const providers = ALL_PROVIDERS.filter((provider) => {
		const id = env[`${provider.toUpperCase()}_CLIENT_ID` as keyof typeof env];
		const secret = env[`${provider.toUpperCase()}_CLIENT_SECRET` as keyof typeof env];
		return id && secret;
	});
	return providers;
}

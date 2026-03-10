export type OAuthProvider = "github" | "google" | "discord" | "twitch";

export const ALL_PROVIDERS: OAuthProvider[] = ["github", "google", "discord", "twitch"];

export const oauthConfig: Record<OAuthProvider, { label: string; logo: string }> = {
	github: { label: "GitHub", logo: "/logos/github.svg" },
	google: { label: "Google", logo: "/logos/google.svg" },
	discord: { label: "Discord", logo: "/logos/discord.svg" },
	twitch: { label: "Twitch", logo: "/logos/twitch.svg" },
};

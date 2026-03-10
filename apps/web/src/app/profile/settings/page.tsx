"use client";

import { useState } from "react";
import { SettingsNav } from "@/features/profile/components/settings-nav";
import type { SettingsSection } from "@/features/profile/components/settings-nav";
import { SectionProfil } from "@/features/profile/components/settings/section-profil";
import { SectionCompte } from "@/features/profile/components/settings/section-compte";
import { SectionSecurite } from "@/features/profile/components/settings/section-securite";
import { SectionSupporter } from "@/features/profile/components/settings/section-supporter";
import { SectionDanger } from "@/features/profile/components/settings/section-danger";

export default function ProfileSettingsPage() {
	const [activeSection, setActiveSection] = useState<SettingsSection>("profil");

	return (
		<div className="flex flex-col gap-5 md:flex-row md:gap-8">
			<SettingsNav active={activeSection} onSelect={setActiveSection} />
			<main className="min-w-0 flex-1 space-y-5">
				{activeSection === "profil" && <SectionProfil />}
				{activeSection === "compte" && <SectionCompte />}
				{activeSection === "securite" && <SectionSecurite />}
				{activeSection === "supporter" && <SectionSupporter />}
				{activeSection === "danger" && <SectionDanger />}
			</main>
		</div>
	);
}

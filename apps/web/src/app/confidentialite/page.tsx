import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

/** Update this date whenever the legal text is revised. */
const DOCUMENT_REVISION_DATE = "11 mars 2026";

export const metadata: Metadata = {
	title: "Politique de confidentialité",
	description:
		"Politique de confidentialité et de protection des données personnelles d'Assembly Line.",
	robots: { index: true, follow: true },
};

const SECTIONS = [
	{
		id: "responsable",
		title: "1. Responsable du traitement",
		content: (
			<p>
				Assembly Line est un projet indépendant. Pour toute question relative à vos données
				personnelles, vous pouvez nous contacter à{" "}
				<a
					href="mailto:privacy@assembly-line.fr"
					className="text-[#00D4FF]/70 underline hover:text-[#00D4FF]"
				>
					privacy@assembly-line.fr
				</a>
				.
			</p>
		),
	},
	{
		id: "donnees",
		title: "2. Données collectées",
		content: (
			<div className="space-y-3">
				<p>
					Nous collectons uniquement les données nécessaires au fonctionnement du service
					:
				</p>
				<ul className="space-y-2 pl-4">
					{[
						{ label: "Nom d'utilisateur", purpose: "identification dans le jeu" },
						{
							label: "Adresse e-mail",
							purpose: "authentification et vérification de compte",
						},
						{ label: "Photo de profil", purpose: "personnalisation (optionnel)" },
						{
							label: "Adresse IP",
							purpose: "sécurité des sessions et géolocalisation approximative",
						},
						{ label: "User-agent", purpose: "affichage de l'appareil connecté" },
						{ label: "Données de progression", purpose: "sauvegarde de votre partie" },
						{
							label: "Données de paiement",
							purpose: "gestion des abonnements (via Polar)",
						},
					].map(({ label, purpose }) => (
						<li key={label} className="flex gap-2 text-[13px] text-white/60">
							<span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00D4FF]/40" />
							<span>
								<span className="font-medium text-white/80">{label}</span> —{" "}
								{purpose}
							</span>
						</li>
					))}
				</ul>
			</div>
		),
	},
	{
		id: "conservation",
		title: "3. Durée de conservation",
		content: (
			<ul className="space-y-2 pl-4">
				{[
					{ label: "Compte utilisateur", duration: "jusqu'à suppression du compte" },
					{
						label: "Sessions actives",
						duration: "7 jours (supprimées automatiquement à expiration)",
					},
					{
						label: "Adresses IP",
						duration:
							"conservées uniquement pendant la durée de la session, max 13 mois (CNIL)",
					},
					{
						label: "Données de paiement",
						duration: "durée légale de conservation comptable (10 ans)",
					},
				].map(({ label, duration }) => (
					<li key={label} className="flex gap-2 text-[13px] text-white/60">
						<span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00D4FF]/40" />
						<span>
							<span className="font-medium text-white/80">{label}</span> — {duration}
						</span>
					</li>
				))}
			</ul>
		),
	},
	{
		id: "soustraitants",
		title: "4. Sous-traitants",
		content: (
			<div className="space-y-3">
				<p className="text-[13px] text-white/60">
					Certains services tiers interviennent dans le traitement de vos données. Chacun
					dispose d&apos;une politique de confidentialité et d&apos;un DPA (Data
					Processing Agreement) conforme au RGPD.
				</p>
				<div className="overflow-hidden rounded-xl border border-white/6">
					<table className="w-full text-[13px]">
						<thead>
							<tr className="border-b border-white/6 bg-white/3">
								<th className="px-4 py-2.5 text-left font-medium text-white/50">
									Service
								</th>
								<th className="px-4 py-2.5 text-left font-medium text-white/50">
									Finalité
								</th>
								<th className="hidden px-4 py-2.5 text-left font-medium text-white/50 sm:table-cell">
									Localisation
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-white/4">
							{[
								{
									name: "Sentry",
									purpose: "Suivi d'erreurs (anonymisé)",
									location: "UE / États-Unis (SCCs)",
								},
								{
									name: "Uploadthing",
									purpose: "Hébergement avatars",
									location: "États-Unis (SCCs)",
								},
								{
									name: "Upstash Redis",
									purpose: "Sessions temps réel",
									location: "UE",
								},
								{
									name: "MaxMind GeoLite2",
									purpose: "Géolocalisation IP (locale)",
									location: "Traitement local",
								},
								{
									name: "Polar",
									purpose: "Paiement & abonnements",
									location: "États-Unis (SCCs)",
								},
							].map(({ name, purpose, location }) => (
								<tr key={name} className="text-white/60">
									<td className="px-4 py-2.5 font-medium text-white/80">
										{name}
									</td>
									<td className="px-4 py-2.5">{purpose}</td>
									<td className="hidden px-4 py-2.5 sm:table-cell">{location}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<p className="text-[12px] text-white/60">
					SCCs = Standard Contractual Clauses (mécanisme de transfert UE → pays tiers
					approuvé par la Commission européenne)
				</p>
			</div>
		),
	},
	{
		id: "droits",
		title: "5. Vos droits",
		content: (
			<div className="space-y-3">
				<p className="text-[13px] text-white/60">
					Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des
					droits suivants :
				</p>
				<ul className="space-y-2 pl-4">
					{[
						{ right: "Accès", desc: "obtenir une copie de vos données" },
						{ right: "Rectification", desc: "corriger des données inexactes" },
						{
							right: "Suppression",
							desc: "supprimer votre compte et toutes vos données depuis Paramètres → Danger",
						},
						{
							right: "Portabilité",
							desc: "exporter vos données au format JSON depuis Paramètres → Danger",
						},
						{ right: "Limitation", desc: "limiter le traitement dans certains cas" },
						{ right: "Opposition", desc: "vous opposer à certains traitements" },
					].map(({ right, desc }) => (
						<li key={right} className="flex gap-2 text-[13px] text-white/60">
							<span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00D4FF]/40" />
							<span>
								<span className="font-medium text-white/80">{right}</span> — {desc}
							</span>
						</li>
					))}
				</ul>
				<p className="text-[13px] text-white/60">
					Pour exercer vos droits, contactez-nous à{" "}
					<a
						href="mailto:privacy@assembly-line.fr"
						className="text-[#00D4FF]/70 underline hover:text-[#00D4FF]"
					>
						privacy@assembly-line.fr
					</a>
					. Vous pouvez également introduire une réclamation auprès de la{" "}
					<a
						href="https://www.cnil.fr"
						target="_blank"
						rel="noopener noreferrer"
						className="text-[#00D4FF]/70 underline hover:text-[#00D4FF]"
					>
						CNIL
					</a>
					.
				</p>
			</div>
		),
	},
	{
		id: "cookies",
		title: "6. Cookies",
		content: (
			<p className="text-[13px] text-white/60">
				Assembly Line n&apos;utilise qu&apos;un seul cookie :{" "}
				<code className="rounded bg-white/6 px-1.5 py-0.5 text-[12px] text-white/70">
					better-auth.session_token
				</code>
				, strictement nécessaire à votre authentification. Ce cookie ne nécessite pas de
				consentement préalable selon les lignes directrices de la CNIL. Aucun cookie
				publicitaire ou de tracking n&apos;est utilisé.
			</p>
		),
	},
	{
		id: "contact",
		title: "7. Contact",
		content: (
			<p className="text-[13px] text-white/60">
				Pour toute question relative à cette politique ou à vos données personnelles :{" "}
				<a
					href="mailto:privacy@assembly-line.fr"
					className="text-[#00D4FF]/70 underline hover:text-[#00D4FF]"
				>
					privacy@assembly-line.fr
				</a>
			</p>
		),
	},
];

export default function ConfidentialitePage() {
	return (
		<div className="min-h-screen bg-[#0A1A2F] px-4 py-12 sm:px-6">
			<div className="mx-auto max-w-2xl">
				{/* Header */}
				<div className="mb-10">
					<Link
						href="/"
						className="mb-8 flex items-center gap-2 text-[13px] text-white/60 transition-colors hover:text-white/80"
					>
						<ArrowLeft size={14} />
						Retour
					</Link>
					<div className="flex items-center gap-3">
						<Image src="/logo-icon.svg" alt="Assembly Line" width={28} height={28} />
						<span className="text-sm font-bold text-white/60">Assembly Line</span>
					</div>
					<h1 className="mt-6 text-3xl font-black text-white">
						Politique de confidentialité
					</h1>
					<p className="mt-2 text-[13px] text-white/60">
						Dernière mise à jour : {DOCUMENT_REVISION_DATE}
					</p>
				</div>

				{/* Sections */}
				<div className="space-y-6">
					{SECTIONS.map((section) => (
						<section
							key={section.id}
							id={section.id}
							className="rounded-2xl border border-white/6 bg-white/2 p-6"
						>
							<h2 className="mb-4 text-[15px] font-semibold text-white/80">
								{section.title}
							</h2>
							<div className="text-[13px] leading-relaxed text-white/60">
								{section.content}
							</div>
						</section>
					))}
				</div>
			</div>
		</div>
	);
}

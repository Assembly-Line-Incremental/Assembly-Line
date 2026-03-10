import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
	title: "Mentions légales",
	robots: { index: true, follow: true },
};

export default function MentionsLegalesPage() {
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
					<h1 className="mt-6 text-3xl font-black text-white">Mentions légales</h1>
					<p className="mt-2 text-[13px] text-white/60">
						Conformément à la loi n°2004-575 du 21 juin 2004 pour la Confiance dans
						l&apos;Économie Numérique (LCEN)
					</p>
				</div>

				<div className="space-y-6">
					{[
						{
							title: "1. Éditeur du site",
							content: (
								<div className="space-y-1.5 text-[13px] text-white/60">
									<p>
										<span className="font-medium text-white/80">
											Nom du site :
										</span>{" "}
										Assembly Line
									</p>
									<p>
										<span className="font-medium text-white/80">URL :</span>{" "}
										https://assembly-line.fr
									</p>
									<p>
										<span className="font-medium text-white/80">Nature :</span>{" "}
										Projet indépendant, non commercial
									</p>
									<p>
										<span className="font-medium text-white/80">Contact :</span>{" "}
										<a
											href="mailto:contact@assembly-line.fr"
											className="text-[#00D4FF]/70 underline hover:text-[#00D4FF]"
										>
											contact@assembly-line.fr
										</a>
									</p>
								</div>
							),
						},
						{
							title: "2. Hébergement",
							content: (
								<div className="space-y-1.5 text-[13px] text-white/60">
									<p>Le site est hébergé par :</p>
									<p>
										<span className="font-medium text-white/80">
											Vercel Inc.
										</span>
									</p>
									<p>
										340 Pine Street, Suite 701, San Francisco, CA 94104,
										États-Unis
									</p>
									<p>
										<a
											href="https://vercel.com"
											target="_blank"
											rel="noopener noreferrer"
											className="text-[#00D4FF]/70 underline hover:text-[#00D4FF]"
										>
											vercel.com
										</a>
									</p>
									<p className="mt-2">L&apos;API backend est hébergée par :</p>
									<p>
										<span className="font-medium text-white/80">
											Railway Corp.
										</span>
									</p>
									<p>
										<a
											href="https://railway.app"
											target="_blank"
											rel="noopener noreferrer"
											className="text-[#00D4FF]/70 underline hover:text-[#00D4FF]"
										>
											railway.app
										</a>
									</p>
								</div>
							),
						},
						{
							title: "3. Propriété intellectuelle",
							content: (
								<p className="text-[13px] text-white/60">
									L&apos;ensemble du contenu de ce site (textes, images, code,
									design) est la propriété exclusive de ses créateurs. Toute
									reproduction, distribution ou utilisation sans autorisation
									préalable est interdite.
								</p>
							),
						},
						{
							title: "4. Données personnelles",
							content: (
								<p className="text-[13px] text-white/60">
									Le traitement des données personnelles est décrit dans notre{" "}
									<Link
										href="/confidentialite"
										className="text-[#00D4FF]/70 underline hover:text-[#00D4FF]"
									>
										politique de confidentialité
									</Link>
									, conformément au Règlement Général sur la Protection des
									Données (RGPD) et aux recommandations de la CNIL.
								</p>
							),
						},
						{
							title: "5. Limitation de responsabilité",
							content: (
								<p className="text-[13px] text-white/60">
									Assembly Line est un jeu en ligne proposé à titre gratuit.
									L&apos;éditeur s&apos;efforce d&apos;assurer la disponibilité du
									service mais ne peut garantir une disponibilité continue.
									L&apos;éditeur ne saurait être tenu responsable des dommages
									directs ou indirects résultant de l&apos;utilisation du site.
								</p>
							),
						},
						{
							title: "6. Droit applicable",
							content: (
								<p className="text-[13px] text-white/60">
									Les présentes mentions légales sont soumises au droit français.
									En cas de litige, les tribunaux français seront seuls
									compétents.
								</p>
							),
						},
					].map((section) => (
						<section
							key={section.title}
							className="rounded-2xl border border-white/6 bg-white/2 p-6"
						>
							<h2 className="mb-4 text-[15px] font-semibold text-white/80">
								{section.title}
							</h2>
							{section.content}
						</section>
					))}
				</div>
			</div>
		</div>
	);
}

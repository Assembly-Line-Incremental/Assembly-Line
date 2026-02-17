const config = {
	extends: ["@commitlint/config-conventional"],
	plugins: [
		{
			rules: {
				"scope-pattern": ({ scope }) => {
					if (!scope) return [true]; // Si vide, géré par scope-empty
					const pattern = /^AL-\d+$/;
					const valid = pattern.test(scope);
					return [
						valid,
						`Le scope doit suivre le format AL-{numéro} (ex: AL-1054), reçu: "${scope}"`,
					];
				},
			},
		},
	],
	rules: {
		"scope-empty": [2, "never"], // Scope obligatoire
		"scope-case": [0], // Désactiver la vérification de case par défaut
		"scope-pattern": [2, "always"],
		"subject-case": [0], // Permettre les majuscules dans la description
	},
};

export default config;

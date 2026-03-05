const { compilerOptions } = require("./tsconfig.json");

/** @type {import('webpack').Configuration} */
module.exports = (options) => {
	return {
		...options,
		externals: [],
		plugins: [
			...options.plugins,
			new (require("webpack").IgnorePlugin)({
				checkResource(resource) {
					const lazyImports = [
						"@nestjs/platform-express",
						"@nestjs/swagger",
						"@nestjs/swagger/dist/services/schema-object-factory",
						"@fastify/static",
						"@fastify/view",
					];
					if (!lazyImports.includes(resource)) {
						return false;
					}
					try {
						require.resolve(resource);
					} catch {
						return true;
					}
					return false;
				},
			}),
		],
	};
};

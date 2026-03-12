import { spawnSync } from "child_process";
import path from "path";

const key = process.env.MAXMIND_LICENSE_KEY;
if (!key) {
	console.warn("[update-geoip] MAXMIND_LICENSE_KEY is not set – skipping GeoIP update.");
	process.exit(0);
}

const result = spawnSync("node", ["scripts/updatedb.js", `license_key=${key}`], {
	cwd: path.resolve(new URL(".", import.meta.url).pathname, "../../../node_modules/geoip-lite"),
	stdio: "inherit",
});

if (result.status !== 0 || result.error) {
	console.error(
		"[update-geoip] updatedb.js failed:",
		result.error ?? `exit code ${result.status}`
	);
	process.exit(1);
}

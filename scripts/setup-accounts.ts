/**
 * One-time (and safely re-runnable) provisioning script.
 * Creates the 6 real accounts, sets their role/moduleId custom claims,
 * and seeds the modules/users/sellers documents.
 *
 * Usage:
 *   1. Firebase Console → Project settings → Service accounts → Generate new private key
 *   2. Save it as ./serviceAccountKey.json in the project root (already gitignored)
 *   3. npm run setup-accounts
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { initializeApp, cert, type ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { MODULES } from "../src/lib/constants";

const __dirname = dirname(fileURLToPath(import.meta.url));
const serviceAccountPath = join(__dirname, "..", "serviceAccountKey.json");

let serviceAccount: ServiceAccount;
try {
	serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf-8"));
} catch {
	console.error(
		`No encontré serviceAccountKey.json en la raíz del proyecto.\n` +
			`Descárgalo desde: Firebase Console → Configuración del proyecto → Cuentas de servicio → Generar nueva clave privada.`,
	);
	process.exit(1);
}

const app = initializeApp({ credential: cert(serviceAccount) });
const auth = getAuth(app);
const db = getFirestore(app);

interface AccountSpec {
	email: string;
	password: string;
	displayName: string;
	role: "admin" | "module";
	moduleId: string | null;
}

// Edit this list to add/remove accounts (e.g. a 4th module later), then re-run the script.
const ACCOUNTS: AccountSpec[] = [
	{ email: "admin1@shark2026.local", password: "CAMBIAR-ESTA-CLAVE-1", displayName: "Admin 1", role: "admin", moduleId: null },
	{ email: "admin2@shark2026.local", password: "CAMBIAR-ESTA-CLAVE-2", displayName: "Admin 2", role: "admin", moduleId: null },
	{ email: "centro@shark2026.local", password: "CAMBIAR-ESTA-CLAVE-3", displayName: "Centro", role: "module", moduleId: "centro" },
	{ email: "plaza-sol@shark2026.local", password: "CAMBIAR-ESTA-CLAVE-4", displayName: "Mall Plaza – Sol", role: "module", moduleId: "plaza-sol" },
	{ email: "plaza-punto@shark2026.local", password: "CAMBIAR-ESTA-CLAVE-5", displayName: "Mall Plaza – Punto", role: "module", moduleId: "plaza-punto" },
	{ email: "vivo-coquimbo@shark2026.local", password: "CAMBIAR-ESTA-CLAVE-6", displayName: "Mall Vivo Coquimbo", role: "module", moduleId: "vivo-coquimbo" },
];

async function upsertAccount(spec: AccountSpec) {
	let user;
	try {
		user = await auth.getUserByEmail(spec.email);
		console.log(`Ya existe: ${spec.email} (${user.uid})`);
	} catch {
		user = await auth.createUser({ email: spec.email, password: spec.password, displayName: spec.displayName });
		console.log(`Creada: ${spec.email} (${user.uid})`);
	}

	await auth.setCustomUserClaims(user.uid, { role: spec.role, moduleId: spec.moduleId });

	await db.doc(`users/${user.uid}`).set(
		{ role: spec.role, moduleId: spec.moduleId, displayName: spec.displayName, email: spec.email },
		{ merge: true },
	);

	return user;
}

async function seedModules() {
	for (const m of MODULES) {
		await db.doc(`modules/${m.id}`).set({ name: m.name }, { merge: true });
	}
	console.log(`Módulos sembrados: ${MODULES.map((m) => m.id).join(", ")}`);
}

async function main() {
	await seedModules();
	for (const spec of ACCOUNTS) {
		await upsertAccount(spec);
	}
	console.log("\nListo. Recuerda cambiar las contraseñas de ejemplo antes de entregar los accesos.");
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});

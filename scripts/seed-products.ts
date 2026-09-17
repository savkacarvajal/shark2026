/**
 * One-time (and safely re-runnable) product catalog import from scripts/seed-data/products.json.
 * Matches existing products by SKU (updates them) instead of duplicating them.
 *
 * Usage: same serviceAccountKey.json as setup-accounts.ts, then:
 *   npm run seed-products
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { initializeApp, cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

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
const db = getFirestore(app);

interface SeedProduct {
	sku: string;
	name: string;
	category: string;
	price: number;
}

const products: SeedProduct[] = JSON.parse(
	readFileSync(join(__dirname, "seed-data", "products.json"), "utf-8"),
);

async function main() {
	const productsRef = db.collection("products");
	let created = 0;
	let updated = 0;

	for (const p of products) {
		const existing = await productsRef.where("sku", "==", p.sku).limit(1).get();
		if (existing.empty) {
			await productsRef.add({ ...p, active: true, createdAt: new Date() });
			created++;
		} else {
			await existing.docs[0].ref.update({ name: p.name, category: p.category, price: p.price });
			updated++;
		}
	}

	console.log(`Listo. ${created} productos creados, ${updated} actualizados (de ${products.length} totales).`);
	console.log(
		`\nOJO: estos precios se transcribieron a mano desde fotos de tu hoja de precios (con ángulo).\n` +
			`Revísalos en la página de Productos antes de vender de verdad, especialmente los de` +
			` "Cables y Adaptadores" y "Audífonos y Micrófonos" (páginas 5 y 6 de las fotos).`,
	);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});

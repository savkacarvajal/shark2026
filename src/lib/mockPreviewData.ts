// Fake data used only by the dev-only ?preview= mode (see guards.ts) so pages
// can be reviewed visually without a working Firebase connection.
import type { Product } from "./firebase/products";
import type { Seller } from "./firebase/sellers";
import { getWeekDays, type Shift } from "./firebase/schedule";

export const MOCK_PRODUCTS: Product[] = [
	{ id: "p1", sku: "CAR-IP15-001", name: "Carcasa iPhone 15 transparente", category: "carcasas", price: 6990, description: "Silicona, antigolpes", active: true },
	{ id: "p2", sku: "LAM-IP15-001", name: "Lámina templada iPhone 15", category: "laminas", price: 4990, active: true },
	{ id: "p3", sku: "AUD-BT-001", name: "Audífonos Bluetooth TWS", category: "audifonos", price: 12990, active: true },
	{ id: "p4", sku: "BAT-10K-001", name: "Batería portátil 10.000mAh", category: "baterias", price: 15990, active: true },
	{ id: "p5", sku: "CAB-USBC-001", name: "Cable USB-C 1m", category: "cables", price: 3990, active: true },
	{ id: "p6", sku: "CAR-20W-001", name: "Cargador rápido 20W", category: "cargadores", price: 8990, active: true },
];

export const MOCK_STOCK: Record<string, number> = {
	p1: 12,
	p2: 30,
	p3: 5,
	p4: 8,
	p5: 40,
	p6: 2,
};

export const MOCK_SELLERS: Seller[] = [
	{ id: "s1", name: "Camila Rojas", active: true },
	{ id: "s2", name: "Matías Soto", active: true },
];

const week = getWeekDays(0);
export const MOCK_SHIFTS: Shift[] = [
	{ id: "m1", sellerId: "s1", sellerName: "Camila Rojas", moduleId: "plaza-sol", date: week[0].date, start: "10:00", end: "19:00" },
	{ id: "m2", sellerId: "s1", sellerName: "Camila Rojas", moduleId: "centro", date: week[1].date, start: "10:00", end: "19:00" },
	{ id: "m3", sellerId: "s2", sellerName: "Matías Soto", moduleId: "plaza-punto", date: week[0].date, start: "12:00", end: "21:00" },
	{ id: "m4", sellerId: "s2", sellerName: "Matías Soto", moduleId: "vivo-coquimbo", date: week[2].date, start: "12:00", end: "21:00" },
];

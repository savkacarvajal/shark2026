// Fake data used only by the dev-only ?preview= mode (see guards.ts) so pages
// can be reviewed visually without a working Firebase connection.
import type { Product } from "./firebase/products";
import type { Seller } from "./firebase/sellers";
import type { Sale } from "./firebase/sales";
import { getWeekDays, type Shift } from "./firebase/schedule";

export const MOCK_PRODUCTS: Product[] = [
	{ id: "p1", sku: "4601", name: "FUNDA TABLET A11 PLUS VIP", category: "tablet", price: 25000, description: "Silicona, antigolpes", active: true },
	{ id: "p2", sku: "3824", name: "AUDIFONOS IPHONE ALTERNATIVOS DIRECTO", category: "audifonos", price: 25000, active: true },
	{ id: "p3", sku: "4560", name: "CENTRO DE CARGA 10000 MAH TIPO-C", category: "centros-carga", price: 28000, active: true },
	{ id: "p4", sku: "2369", name: "CABLE IPHONE TIPO C CERTIFICADO", category: "cables-adaptadores", price: 15000, active: true },
	{ id: "p5", sku: "2370", name: "CARGADOR 20W IPHONE TIPO C CERTIFICADO", category: "cargadores", price: 20000, active: true },
	{ id: "p6", sku: "4488", name: "CONSOLA R36S 128 GB", category: "juegos-joysticks", price: 80000, active: true },
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

export const MOCK_SALES: Sale[] = [
	{
		id: "sale1",
		moduleId: "plaza-sol",
		sellerId: "s1",
		sellerName: "Camila Rojas",
		items: [{ productId: "p1", productName: "FUNDA TABLET A11 PLUS VIP", qty: 1, unitPrice: 25000 }],
		discount: 0,
		total: 25000,
		paymentMethod: "transferencia",
	} as Sale,
	{
		id: "sale2",
		moduleId: "centro",
		sellerId: "s2",
		sellerName: "Matías Soto",
		items: [
			{ productId: "p3", productName: "CENTRO DE CARGA 10000 MAH TIPO-C", qty: 2, unitPrice: 28000 },
			{ productId: "p4", productName: "CABLE IPHONE TIPO C CERTIFICADO", qty: 1, unitPrice: 15000 },
		],
		discount: 5000,
		total: 66000,
		paymentMethod: "efectivo",
	} as Sale,
];

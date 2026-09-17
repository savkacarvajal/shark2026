export const MODULES = [
	{ id: "plaza-sol", name: "Mall Plaza Sol" },
	{ id: "plaza-centro", name: "Mall Plaza Centro" },
	{ id: "vivo-coquimbo", name: "Mall Vivo Coquimbo" },
] as const;

export type ModuleId = (typeof MODULES)[number]["id"];

export const PRODUCT_CATEGORIES = [
	{ id: "carcasas", name: "Carcasas" },
	{ id: "laminas", name: "Láminas" },
	{ id: "audifonos", name: "Audífonos" },
	{ id: "baterias", name: "Baterías portátiles" },
	{ id: "cables", name: "Cables" },
	{ id: "cargadores", name: "Cargadores" },
	{ id: "certificados", name: "Certificados" },
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]["id"];

export const PAYMENT_METHODS = [
	{ id: "transferencia", name: "Transferencia" },
	{ id: "transbank", name: "Transbank" },
	{ id: "efectivo", name: "Efectivo" },
	{ id: "mixto", name: "Mixto" },
	{ id: "rapid", name: "Rapid" },
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number]["id"];

export type Role = "admin" | "module";

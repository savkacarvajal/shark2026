export const MODULES = [
	{ id: "centro", name: "Centro" },
	{ id: "plaza-sol", name: "Mall Plaza – Sol" },
	{ id: "plaza-punto", name: "Mall Plaza – Punto" },
	{ id: "vivo-coquimbo", name: "Mall Vivo Coquimbo" },
] as const;

export type ModuleId = (typeof MODULES)[number]["id"];

// One distinct color per module for the shareable schedule calendar.
export const MODULE_COLORS: Record<string, string> = {
	centro: "#f59e0b",
	"plaza-sol": "#fb7185",
	"plaza-punto": "#a78bfa",
	"vivo-coquimbo": "#34d399",
};

export const PRODUCT_CATEGORIES = [
	{ id: "tablet", name: "Tablet" },
	{ id: "soportes-tripodes", name: "Soportes y Trípodes" },
	{ id: "protectores", name: "Protectores" },
	{ id: "reparaciones", name: "Reparaciones" },
	{ id: "parlantes-transmisores", name: "Parlantes y Transmisores" },
	{ id: "otros", name: "Otros" },
	{ id: "nintendo", name: "Nintendo" },
	{ id: "mouse-teclados", name: "Mouse y Teclados" },
	{ id: "memorias-pendrives", name: "Memorias y Pendrives" },
	{ id: "juegos-joysticks", name: "Juegos y Joysticks" },
	{ id: "ajustes", name: "Diferencias por Cambios" },
	{ id: "consolas", name: "Consolas" },
	{ id: "chip", name: "Chip" },
	{ id: "centros-carga", name: "Centros de Carga" },
	{ id: "cargadores", name: "Cargadores" },
	{ id: "cables-adaptadores", name: "Cables y Adaptadores" },
	{ id: "audifonos", name: "Audífonos y Micrófonos" },
	{ id: "articulos-oficina", name: "Artículos de Oficina" },
	{ id: "sin-categoria", name: "Sin categoría" },
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

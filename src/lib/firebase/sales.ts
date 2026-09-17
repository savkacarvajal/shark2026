import {
	collection,
	collectionGroup,
	doc,
	getDocs,
	limit,
	orderBy,
	query,
	runTransaction,
	type Timestamp,
} from "firebase/firestore";
import { db } from "./client";
import type { PaymentMethod } from "../constants";

export interface SaleItem {
	productId: string;
	productName: string;
	qty: number;
	unitPrice: number;
}

export interface Sale {
	id: string;
	moduleId: string;
	sellerId: string;
	sellerName: string;
	items: SaleItem[];
	total: number;
	paymentMethod: PaymentMethod;
	createdAt: Timestamp;
	createdByUid: string;
}

export class InsufficientStockError extends Error {
	constructor(public productName: string, public available: number) {
		super(`Stock insuficiente de "${productName}" (disponible: ${available})`);
	}
}

/**
 * Atomically validates stock, decrements it, and records the sale.
 * moduleId must come from the signed-in user's custom claim, never a form field.
 */
export async function createSale(input: {
	moduleId: string;
	sellerId: string;
	sellerName: string;
	items: SaleItem[];
	paymentMethod: PaymentMethod;
	createdByUid: string;
}) {
	const { moduleId, items } = input;

	await runTransaction(db, async (tx) => {
		const stockRefs = items.map((item) => doc(db, "modules", moduleId, "stock", item.productId));
		const stockDocs = await Promise.all(stockRefs.map((ref) => tx.get(ref)));

		stockDocs.forEach((snap, i) => {
			const available = (snap.data()?.quantity as number) ?? 0;
			if (available < items[i].qty) {
				throw new InsufficientStockError(items[i].productName, available);
			}
		});

		stockDocs.forEach((snap, i) => {
			const available = (snap.data()?.quantity as number) ?? 0;
			tx.set(stockRefs[i], { quantity: available - items[i].qty }, { merge: true });
		});

		const total = items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
		const saleRef = doc(collection(db, "modules", moduleId, "sales"));
		tx.set(saleRef, {
			moduleId,
			sellerId: input.sellerId,
			sellerName: input.sellerName,
			items,
			total,
			paymentMethod: input.paymentMethod,
			createdAt: new Date(),
			createdByUid: input.createdByUid,
		});
	});
}

export async function getModuleSales(moduleId: string, max = 50): Promise<Sale[]> {
	const q = query(
		collection(db, "modules", moduleId, "sales"),
		orderBy("createdAt", "desc"),
		limit(max),
	);
	const snap = await getDocs(q);
	return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Sale, "id">) }));
}

/** Admin-only: sales across all modules, requires the collectionGroup rule for /sales. */
export async function getAllSales(max = 100): Promise<Sale[]> {
	const q = query(collectionGroup(db, "sales"), orderBy("createdAt", "desc"), limit(max));
	const snap = await getDocs(q);
	return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Sale, "id">) }));
}

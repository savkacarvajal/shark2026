import { collection, doc, limit, onSnapshot, orderBy, query, runTransaction, type Timestamp } from "firebase/firestore";
import { db } from "./client";
import { InsufficientStockError } from "./sales";

export interface Movement {
	id: string;
	type: "merma";
	productId: string;
	productName: string;
	qty: number;
	reason: string;
	createdAt: Timestamp;
	createdByUid: string;
}

/** Atomically decrements stock and logs the loss with its reason (rotura, robo, vencido, etc). */
export async function registerMerma(input: {
	moduleId: string;
	productId: string;
	productName: string;
	qty: number;
	reason: string;
	createdByUid: string;
}) {
	const { moduleId, productId, qty } = input;

	await runTransaction(db, async (tx) => {
		const stockRef = doc(db, "modules", moduleId, "stock", productId);
		const snap = await tx.get(stockRef);
		const available = (snap.data()?.quantity as number) ?? 0;
		if (available < qty) {
			throw new InsufficientStockError(input.productName, available);
		}

		tx.set(stockRef, { quantity: available - qty }, { merge: true });

		const movementRef = doc(collection(db, "modules", moduleId, "movements"));
		tx.set(movementRef, {
			type: "merma",
			productId,
			productName: input.productName,
			qty,
			reason: input.reason,
			createdAt: new Date(),
			createdByUid: input.createdByUid,
		});
	});
}

export function watchRecentMermas(moduleId: string, callback: (movements: Movement[]) => void, max = 10) {
	const q = query(
		collection(db, "modules", moduleId, "movements"),
		orderBy("createdAt", "desc"),
		limit(max),
	);
	return onSnapshot(q, (snap) => {
		callback(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Movement, "id">) })));
	});
}

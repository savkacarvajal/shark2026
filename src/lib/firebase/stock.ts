import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "./client";

export interface StockEntry {
	productId: string;
	quantity: number;
}

export function watchStock(moduleId: string, callback: (stock: Record<string, number>) => void) {
	const ref = collection(db, "modules", moduleId, "stock");
	return onSnapshot(ref, (snap) => {
		const stock: Record<string, number> = {};
		for (const d of snap.docs) {
			stock[d.id] = (d.data().quantity as number) ?? 0;
		}
		callback(stock);
	});
}

/** Manually set the stock quantity for a product in a module (seeding/adjustment, not a sale). */
export function setStock(moduleId: string, productId: string, quantity: number, uid: string) {
	return setDoc(
		doc(db, "modules", moduleId, "stock", productId),
		{ quantity, updatedAt: new Date(), updatedBy: uid },
		{ merge: true },
	);
}

import { addDoc, collection, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "./client";

// Sellers rotate across every module, so the roster is global (not scoped to a module).
export interface Seller {
	id: string;
	name: string;
	active: boolean;
}

const sellersRef = collection(db, "sellers");

export function watchSellers(callback: (sellers: Seller[]) => void) {
	const q = query(sellersRef, orderBy("name"));
	return onSnapshot(q, (snap) => {
		callback(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Seller, "id">) })));
	});
}

export function addSeller(name: string) {
	return addDoc(sellersRef, { name, active: true });
}

export function setSellerActive(sellerId: string, active: boolean) {
	return updateDoc(doc(db, "sellers", sellerId), { active });
}

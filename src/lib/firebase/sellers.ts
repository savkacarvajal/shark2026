import {
	addDoc,
	collection,
	doc,
	onSnapshot,
	orderBy,
	query,
	updateDoc,
} from "firebase/firestore";
import { db } from "./client";

export interface Seller {
	id: string;
	name: string;
	active: boolean;
}

function sellersRef(moduleId: string) {
	return collection(db, "modules", moduleId, "sellers");
}

export function watchSellers(moduleId: string, callback: (sellers: Seller[]) => void) {
	const q = query(sellersRef(moduleId), orderBy("name"));
	return onSnapshot(q, (snap) => {
		callback(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Seller, "id">) })));
	});
}

export function addSeller(moduleId: string, name: string) {
	return addDoc(sellersRef(moduleId), { name, active: true });
}

export function setSellerActive(moduleId: string, sellerId: string, active: boolean) {
	return updateDoc(doc(db, "modules", moduleId, "sellers", sellerId), { active });
}

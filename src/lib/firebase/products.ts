import {
	addDoc,
	collection,
	doc,
	onSnapshot,
	orderBy,
	query,
	updateDoc,
	type Timestamp,
} from "firebase/firestore";
import { db } from "./client";
import type { ProductCategory } from "../constants";

export interface Product {
	id: string;
	sku: string;
	name: string;
	category: ProductCategory;
	price: number;
	active: boolean;
	createdAt?: Timestamp;
}

const productsRef = collection(db, "products");

export function watchProducts(callback: (products: Product[]) => void) {
	const q = query(productsRef, orderBy("name"));
	return onSnapshot(q, (snap) => {
		callback(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Product, "id">) })));
	});
}

export function createProduct(input: { sku: string; name: string; category: ProductCategory; price: number }) {
	return addDoc(productsRef, { ...input, active: true, createdAt: new Date() });
}

export function updateProduct(
	productId: string,
	input: Partial<{ sku: string; name: string; category: ProductCategory; price: number; active: boolean }>,
) {
	return updateDoc(doc(db, "products", productId), input);
}

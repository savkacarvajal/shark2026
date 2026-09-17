import {
	onAuthStateChanged,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signOut,
	type User,
} from "firebase/auth";
import { auth } from "./client";
import type { Role } from "../constants";

export interface SessionClaims {
	role: Role;
	moduleId: string | null;
}

export function login(email: string, password: string) {
	return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
	return signOut(auth);
}

export function resetPassword(email: string) {
	return sendPasswordResetEmail(auth, email);
}

export async function getSessionClaims(user: User): Promise<SessionClaims> {
	const result = await user.getIdTokenResult();
	return {
		role: (result.claims.role as Role) ?? "module",
		moduleId: (result.claims.moduleId as string | null) ?? null,
	};
}

export function watchAuth(callback: (user: User | null, claims: SessionClaims | null) => void) {
	return onAuthStateChanged(auth, async (user) => {
		if (!user) {
			callback(null, null);
			return;
		}
		const claims = await getSessionClaims(user);
		callback(user, claims);
	});
}

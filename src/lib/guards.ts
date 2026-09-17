import { watchAuth, type SessionClaims } from "./firebase/auth";
import type { User } from "firebase/auth";

const base = import.meta.env.BASE_URL;

/** Redirects to /login if not authenticated. Redirects to /dashboard if authenticated but wrong role. */
export function requireAuth(opts?: { adminOnly?: boolean }): Promise<{ user: User; claims: SessionClaims }> {
	return new Promise((resolve) => {
		const unsubscribe = watchAuth((user, claims) => {
			unsubscribe();
			if (!user || !claims) {
				window.location.href = `${base}login`;
				return;
			}
			if (opts?.adminOnly && claims.role !== "admin") {
				window.location.href = `${base}dashboard`;
				return;
			}
			resolve({ user, claims });
		});
	});
}

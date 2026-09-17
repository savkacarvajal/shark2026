import { watchAuth, type SessionClaims } from "./firebase/auth";
import type { User } from "firebase/auth";

const base = import.meta.env.BASE_URL;

/**
 * Dev-only design preview bypass: add ?preview=admin or ?preview=plaza-sol (any moduleId)
 * to any page URL while running `npm run dev` to see it without a working Firebase login.
 * Has no effect in production builds.
 */
function getPreviewClaims(): SessionClaims | null {
	if (!import.meta.env.DEV) return null;
	const value = new URLSearchParams(window.location.search).get("preview");
	if (!value) return null;
	return value === "admin" ? { role: "admin", moduleId: null } : { role: "module", moduleId: value };
}

export function isPreviewMode(): boolean {
	return getPreviewClaims() !== null;
}

/** Redirects to /login if not authenticated. Redirects to /dashboard if authenticated but wrong role. */
export function requireAuth(opts?: { adminOnly?: boolean }): Promise<{ user: User; claims: SessionClaims }> {
	const previewClaims = getPreviewClaims();
	if (previewClaims) {
		return Promise.resolve({ user: { uid: "preview-uid" } as User, claims: previewClaims });
	}

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

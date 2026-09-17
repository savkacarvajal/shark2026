const ESCAPE_MAP: Record<string, string> = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&#39;",
};

/** Escapes text/attribute values before interpolating them into an innerHTML template string. */
export function escapeHtml(value: unknown): string {
	return String(value).replace(/[&<>"']/g, (c) => ESCAPE_MAP[c]);
}

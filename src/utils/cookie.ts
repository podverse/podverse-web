export function readCookie(name: string): string | undefined {
	if (typeof document === "undefined") return undefined;
	const cookieStr = document.cookie;
	const parts = cookieStr.split(/;\s*/);
	for (const part of parts) {
		const [key, ...valParts] = part.split("=");
		if (key === name) return valParts.join("=");
	}
	return undefined;
}
  
export function writeCookie(name: string, value: string, maxAgeSeconds = 31536000) {
	if (typeof document === "undefined") return;
	document.cookie = `${name}=${value}; path=/; max-age=${maxAgeSeconds}`;
}

export function clearCookie(name: string) {
	if (typeof document === "undefined") return;
	document.cookie = `${name}=; path=/; max-age=0`;
}

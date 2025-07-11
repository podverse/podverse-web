export type UITheme = "dark" | "light";

export function toUITheme(value: string | null): UITheme {
  const validThemes: UITheme[] = ["dark", "light"];
  return validThemes.includes(value as UITheme) ? (value as UITheme) : "dark";
}

export const getCurrentTheme = (): string | undefined => {
  if (typeof window === "undefined") return undefined;
  const theme = document.documentElement.getAttribute("data-theme");
  const validTheme = toUITheme(theme);
  return validTheme;
};

export function setThemeOnDocument(theme: string) {
  document.documentElement.setAttribute('data-theme', theme);
  document.cookie = `theme=${theme}; path=/; max-age=31536000`;
}

export type UITheme = "dark" | "light";

export function toUITheme(value?: string | null): UITheme {
  const validUIThemes: UITheme[] = ["dark", "light"];
  return validUIThemes.includes(value as UITheme) ? (value as UITheme) : "dark";
}

export const getCurrentUITheme = (): string | undefined => {
  if (typeof window === "undefined") return undefined;
  const uiTheme = document.documentElement.getAttribute("data-ui-theme");
  const validUITheme = toUITheme(uiTheme);
  return validUITheme;
};

export function setUIThemeOnDocument(uiTheme: string) {
  document.documentElement.setAttribute('data-ui-theme', uiTheme);
  document.cookie = `ui-theme=${uiTheme}; path=/; max-age=31536000`;
}

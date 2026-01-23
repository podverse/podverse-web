import { config } from "../../config";

export type UITheme = "dark" | "light" | "dracula";

const ALL_POSSIBLE_THEMES: UITheme[] = ["dark", "light", "dracula"];

/**
 * Get the list of valid themes from config, or all themes if config is blank
 */
export function getValidThemes(): UITheme[] {
  const validThemesConfig = config.public.theme.valid?.trim();
  
  if (!validThemesConfig) {
    return ALL_POSSIBLE_THEMES;
  }
  
  const themes = validThemesConfig
    .split(',')
    .map(t => t.trim().toLowerCase())
    .filter(Boolean) as UITheme[];
  
  // Validate themes and log warnings for invalid ones
  const validThemes: UITheme[] = [];
  themes.forEach(theme => {
    if (ALL_POSSIBLE_THEMES.includes(theme)) {
      validThemes.push(theme);
    } else {
      if (typeof window !== "undefined") {
        console.warn(`[Theme Config] Invalid theme "${theme}" in NEXT_PUBLIC_SUPPORTED_THEMES. Valid themes are: ${ALL_POSSIBLE_THEMES.join(', ')}`);
      }
    }
  });
  
  // If no valid themes after filtering, return all themes
  if (validThemes.length === 0) {
    if (typeof window !== "undefined") {
      console.warn(`[Theme Config] No valid themes found in NEXT_PUBLIC_SUPPORTED_THEMES. Using all themes: ${ALL_POSSIBLE_THEMES.join(', ')}`);
    }
    return ALL_POSSIBLE_THEMES;
  }
  
  return validThemes;
}

/**
 * Get the default theme from config, or "dark" if blank, or first valid theme if dark is not valid
 */
export function getDefaultTheme(): UITheme {
  const defaultThemeConfig = config.public.theme.default?.trim().toLowerCase();
  const validThemes = getValidThemes();
  
  if (!defaultThemeConfig) {
    // If no default specified, use "dark" if it's valid, otherwise use first valid theme
    if (validThemes.includes("dark")) {
      return "dark";
    }
    return validThemes[0] || "dark";
  }
  
  const defaultTheme = defaultThemeConfig as UITheme;
  
  // Validate default theme
  if (!ALL_POSSIBLE_THEMES.includes(defaultTheme)) {
    if (typeof window !== "undefined") {
      console.warn(`[Theme Config] Invalid default theme "${defaultTheme}" in NEXT_PUBLIC_DEFAULT_THEME. Valid themes are: ${ALL_POSSIBLE_THEMES.join(', ')}. Using fallback.`);
    }
    // Use "dark" if valid, otherwise first valid theme
    if (validThemes.includes("dark")) {
      return "dark";
    }
    return validThemes[0] || "dark";
  }
  
  // Check if default theme is in the list of valid themes
  if (!validThemes.includes(defaultTheme)) {
    if (typeof window !== "undefined") {
      console.warn(`[Theme Config] Default theme "${defaultTheme}" is not in the list of valid themes. Using fallback.`);
    }
    // Use "dark" if valid, otherwise first valid theme
    if (validThemes.includes("dark")) {
      return "dark";
    }
    return validThemes[0] || "dark";
  }
  
  return defaultTheme;
}

export function toUITheme(value?: string | null): UITheme {
  const validUIThemes = getValidThemes();
  const defaultTheme = getDefaultTheme();
  
  if (!value) {
    return defaultTheme;
  }
  
  const theme = value.toLowerCase() as UITheme;
  return validUIThemes.includes(theme) ? theme : defaultTheme;
}

export const getCurrentUITheme = (): string | undefined => {
  if (typeof window === "undefined") return undefined;
  const uiTheme = document.documentElement.getAttribute("data-ui-theme");
  const validUITheme = toUITheme(uiTheme);
  return validUITheme;
};

export function setUIThemeOnDocument(uiTheme: string) {
  document.documentElement.setAttribute('data-ui-theme', uiTheme);
}

import { UITheme, setUIThemeOnDocument, toUITheme } from "./uiTheme";
import { ViewSelectedOption } from "../../components/ViewSelector/ViewSelector";
import { clearCookie, readCookie, writeCookie } from "../cookie";

export interface LocalSettingsState {
	uiTheme: UITheme;
	viewSelected: ViewSelectedOption;
  serverEnvironmentDisclaimerAccepted: boolean;
}

export function handleLocalSettingsUpdate(newState: LocalSettingsState) {
	if (typeof document === "undefined") return;

	const prev = getParsedLocalSettings();

	if (prev.uiTheme) {
		prev.uiTheme = toUITheme(prev.uiTheme);
	}

	if (!prev.uiTheme || prev.uiTheme !== newState.uiTheme) {
		setUIThemeOnDocument(newState.uiTheme);
	}

	const serialized = encodeURIComponent(JSON.stringify(newState));
	writeCookie("local-settings", serialized);
}

const defaultLocalSettings: LocalSettingsState = {
  uiTheme: "dark",
  viewSelected: "grid",
  serverEnvironmentDisclaimerAccepted: false
};

export function getParsedLocalSettings(cookieStore?: any): LocalSettingsState {
  let raw: string | undefined;

  if (typeof document === 'undefined') {
    // Server side
    const serverCookie = cookieStore?.get('local-settings');
    raw = serverCookie?.value;
  } else {
    // Client side
    raw = readCookie('local-settings');
  }

  if (!raw) return defaultLocalSettings;

  try {
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    // Only clear client-side; server can't clear with your current helpers
    if (typeof document !== 'undefined') clearCookie('local-settings');
    return defaultLocalSettings;
  }
}

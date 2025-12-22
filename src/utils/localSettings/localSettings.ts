import { UITheme, setUIThemeOnDocument, toUITheme } from "./uiTheme";
import { ViewSelectedOption } from "../../components/ViewSelector/ViewSelector";
import { clearCookie, readCookie, writeCookie } from "../cookie";

/*

LocalSettingsState Legend:
  - uit = uiTheme
  - vs = viewSelected
  - seda = serverEnvironmentDisclaimerAccepted
  - aqc = autoQueueConfig
    - rp = repeat
    - rd = random
*/

export interface LocalSettingsState {
	uit: UITheme;
	vs: ViewSelectedOption;
  seda: boolean;
  aqc: {
    rp: boolean;
    rd: boolean;
  }
}

export function handleLocalSettingsUpdate(newState: LocalSettingsState) {
	if (typeof document === "undefined") return;

	const prev = getParsedLocalSettings();

	if (prev.uit) {
		prev.uit = toUITheme(prev.uit);
	}

	if (!prev.uit || prev.uit !== newState.uit) {
		setUIThemeOnDocument(newState.uit);
	}

	const serialized = encodeURIComponent(JSON.stringify(newState));
	writeCookie("local-settings", serialized);
}

const defaultLocalSettings: LocalSettingsState = {
  uit: "dark",
  vs: "grid",
  seda: false,
  aqc: {
    rp: false,
    rd: false
  }
};

function isValidLocalSettings(settings: any): settings is LocalSettingsState {
  return (
    settings &&
    typeof settings.uit === 'string' &&
    typeof settings.vs === 'string' &&
    typeof settings.seda === 'boolean' &&
    typeof settings.aqc === 'object' &&
    settings.aqc !== null &&
    typeof settings.aqc.rp === 'boolean' &&
    typeof settings.aqc.rd === 'boolean'
  );
}

export function getParsedLocalSettings(cookieStore?: any): LocalSettingsState {
  const isServer = typeof document === 'undefined';
  let raw: string | undefined;

  if (isServer) {
    const serverCookie = cookieStore?.get('local-settings');
    raw = serverCookie?.value;
  } else {
    raw = readCookie('local-settings');
  }

  if (!raw) {
    return defaultLocalSettings;
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    const isValid = isValidLocalSettings(parsed);

    if (!isValid) {
      if (isServer) {
        return defaultLocalSettings;
      }
      throw new Error('Invalid local settings format');
    }

    return parsed;
  } catch (error) {
    if (!isServer) {
      clearCookie('local-settings');
      writeCookie('local-settings', encodeURIComponent(JSON.stringify(defaultLocalSettings)));
    }
    return defaultLocalSettings;
  }
}

import { UITheme, setUIThemeOnDocument, toUITheme } from "./uiTheme";
import { ViewSelectedOption } from "../../components/ViewSelector/ViewSelector";
import { clearCookie, readCookie, writeCookie } from "../cookie";
import {
  CategoryMappingKeys,
  LiveItemStatus,
  QueryParamsHomeSort,
  QueryParamsMedium,
  QueryParamsPlaylistsType,
  QueryParamsQueueMedium,
  QueryParamsStatsRange,
  QueryParamsSubscribedFullSort,
  QueryParamsSubscribedMusicType,
  QueryParamsSubscribedPartialSort,
  QueryParamsSubscribedType
} from "podverse-helpers";

/*

LocalSettingsState Legend:
  - uit = uiTheme
  - vs = viewSelected
  - seda = serverEnvironmentDisclaimerAccepted
  - aqc = autoQueueConfig
    - rp = repeat
    - rd = random
  - fd = filterDefaults (per-page filter preferences)
  - metd = membershipExpirationToastDismissed (ISO date string of last dismissal)
*/

export type FilterDefaultsPage = 'home' | 'playlists' | 'podcasts' | 'podcasts-livestreams'
  | 'music-livestreams' | 'episodes' | 'tracks' | 'albums' | 'artists' | 'clips';

export interface HomeFilterDefaults {
  medium: QueryParamsMedium;
  sort: QueryParamsHomeSort;
}

export interface PlaylistsFilterDefaults {
  type: QueryParamsPlaylistsType;
  sort: QueryParamsSubscribedFullSort;
  range: QueryParamsStatsRange | null;
  medium: QueryParamsQueueMedium;
}

export interface PodcastsFilterDefaults {
  type: QueryParamsSubscribedType;
  sort: QueryParamsSubscribedFullSort;
  range: QueryParamsStatsRange | null;
  category: CategoryMappingKeys | null;
}

export interface EpisodesFilterDefaults {
  type: QueryParamsSubscribedType;
  sort: QueryParamsSubscribedPartialSort;
  range: QueryParamsStatsRange | null;
  category: CategoryMappingKeys | null;
}

export interface TracksFilterDefaults {
  type: QueryParamsSubscribedMusicType;
  sort: QueryParamsSubscribedPartialSort;
  range: QueryParamsStatsRange | null;
}

export interface AlbumsFilterDefaults {
  type: QueryParamsSubscribedMusicType;
  sort: QueryParamsSubscribedFullSort;
  range: QueryParamsStatsRange | null;
}

export interface ArtistsFilterDefaults {
  type: QueryParamsSubscribedMusicType;
  sort: QueryParamsSubscribedFullSort;
  range: QueryParamsStatsRange | null;
}

export interface ClipsFilterDefaults {
  type: QueryParamsSubscribedType;
  sort: QueryParamsSubscribedPartialSort;
  range: QueryParamsStatsRange | null;
  category: CategoryMappingKeys | null;
}

export interface PodcastsLivestreamsFilterDefaults {
  type: QueryParamsSubscribedType;
  sort: QueryParamsSubscribedPartialSort;
  range: QueryParamsStatsRange | null;
  category: CategoryMappingKeys | null;
  liveItemType: LiveItemStatus;
}

export interface MusicLivestreamsFilterDefaults {
  type: QueryParamsSubscribedMusicType;
  sort: QueryParamsSubscribedPartialSort;
  range: QueryParamsStatsRange | null;
  liveItemType: LiveItemStatus;
}

export interface FilterDefaults {
  home?: HomeFilterDefaults;
  playlists?: PlaylistsFilterDefaults;
  podcasts?: PodcastsFilterDefaults;
  'podcasts-livestreams'?: PodcastsLivestreamsFilterDefaults;
  'music-livestreams'?: MusicLivestreamsFilterDefaults;
  episodes?: EpisodesFilterDefaults;
  tracks?: TracksFilterDefaults;
  albums?: AlbumsFilterDefaults;
  artists?: ArtistsFilterDefaults;
  clips?: ClipsFilterDefaults;
}

export interface LocalSettingsState {
	uit: UITheme;
	vs: ViewSelectedOption;
  seda: boolean;
  aqc: {
    rp: boolean;
    rd: boolean;
  }
  fd?: Partial<FilterDefaults>;
  metd?: string; // membershipExpirationToastDismissed (ISO date string of last dismissal)
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
  },
  fd: {}
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
    typeof settings.aqc.rd === 'boolean' &&
    (settings.fd === undefined || typeof settings.fd === 'object' && settings.fd !== null) &&
    (settings.metd === undefined || typeof settings.metd === 'string')
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
    return { ...defaultLocalSettings };
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    const isValid = isValidLocalSettings(parsed);

    if (!isValid) {
      if (isServer) {
        return { ...defaultLocalSettings };
      }
      throw new Error('Invalid local settings format');
    }

    return parsed;
  } catch (error) {
    if (!isServer) {
      clearCookie('local-settings');
      writeCookie('local-settings', encodeURIComponent(JSON.stringify(defaultLocalSettings)));
    }
    return { ...defaultLocalSettings };
  }
}

export type FilterDefaultsForPage<T extends FilterDefaultsPage> =
  T extends 'home' ? HomeFilterDefaults :
  T extends 'playlists' ? PlaylistsFilterDefaults :
  T extends 'podcasts' ? PodcastsFilterDefaults :
  T extends 'podcasts-livestreams' ? PodcastsLivestreamsFilterDefaults :
  T extends 'music-livestreams' ? MusicLivestreamsFilterDefaults :
  T extends 'episodes' ? EpisodesFilterDefaults :
  T extends 'tracks' ? TracksFilterDefaults :
  T extends 'albums' ? AlbumsFilterDefaults :
  T extends 'artists' ? ArtistsFilterDefaults :
  T extends 'clips' ? ClipsFilterDefaults :
  never;

export function updateFilterDefaults<T extends FilterDefaultsPage>(
  page: T,
  filters: FilterDefaultsForPage<T>
) {
  const settings = getParsedLocalSettings();
  // Create a shallow copy to avoid mutating the reference
  const newSettings = { ...settings };
  
  if (!newSettings.fd) {
    newSettings.fd = {};
  }
  (newSettings.fd as Record<FilterDefaultsPage, FilterDefaultsForPage<T>>)[page] = filters;
  handleLocalSettingsUpdate(newSettings);
}

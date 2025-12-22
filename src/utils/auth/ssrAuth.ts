// Version: 2
import { cookies } from 'next/headers';
import { DTOAccount } from 'podverse-helpers';
import { getSSRApiRequestService } from '../../factories/apiRequestService';

// Locally defined to fix missing export
const AuthCookieName = "podverse_jwt";

export async function getSSRJwtFromCookies(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const jwt = cookieStore.get(AuthCookieName)?.value;
  return jwt;
}

export async function getSSRLoggedInAccount(): Promise<DTOAccount | null> {
  const jwt = await getSSRJwtFromCookies();
  if (!jwt) {
    return null;
  }

  const ssrApiRequestService = getSSRApiRequestService(jwt);

  try {
    return await ssrApiRequestService.reqAuthMe();
  } catch {
    return null;
  }
}

export async function getSSRAuthService(): Promise<{ isValidAuthSession: boolean; apiRequestService: typeof apiRequestService }> {
  const jwt = await getSSRJwtFromCookies();
  const apiRequestService = getSSRApiRequestService(jwt);
  if (jwt) {
    try {
      await apiRequestService.reqAuthCheckSession();
      return { isValidAuthSession: true, apiRequestService };
    } catch {
      return { isValidAuthSession: false, apiRequestService };
    }
  } else {
    return { isValidAuthSession: false, apiRequestService };
  }
}

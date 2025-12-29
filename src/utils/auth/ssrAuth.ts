import { cookies } from 'next/headers';
import { AuthCookieName, DTOAccount } from 'podverse-helpers';
import { getSSRApiRequestService } from '../../factories/apiRequestService';

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

export async function getSSRAuthService(): Promise<{ isValidAuthSession: boolean; ssrApiRequestService: typeof ssrApiRequestService }> {
  const jwt = await getSSRJwtFromCookies();
  const ssrApiRequestService = getSSRApiRequestService(jwt);
  if (jwt) {
    try {
      await ssrApiRequestService.reqAuthCheckSession();
      return { isValidAuthSession: true, ssrApiRequestService };
    } catch {
      return { isValidAuthSession: false, ssrApiRequestService };
    }
  } else {
    return { isValidAuthSession: false, ssrApiRequestService };
  }
}

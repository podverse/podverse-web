import { cookies } from 'next/headers';
import { apiRequestService, getSSRApiRequestService } from '../../factories/apiRequestService';
import { DTOAccount } from 'podverse-helpers';

export async function getSSRJwtFromCookies(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value;
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
  
  if (!jwt) {
    return { isValidAuthSession: false, apiRequestService: apiRequestService };
  }

  const ssrApiRequestService = getSSRApiRequestService(jwt);

  try {
    await ssrApiRequestService.reqAuthCheckSession();
    return { isValidAuthSession: true, apiRequestService: ssrApiRequestService };
  } catch {
    return { isValidAuthSession: false, apiRequestService: apiRequestService };
  }
}

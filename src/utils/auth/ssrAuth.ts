import { cookies } from 'next/headers';
import { getSSRApiRequestService } from '../../factories/apiRequestService';
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

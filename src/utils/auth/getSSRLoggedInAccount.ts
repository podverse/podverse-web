import { cookies } from 'next/headers';
import { getSSRApiRequestService } from '../../factories/apiRequestService';
import { DTOAccount } from 'podverse-helpers';

export async function getSSRLoggedInAccount(): Promise<DTOAccount | null> {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value;
  const ssrApiRequestService = getSSRApiRequestService(jwt);

  try {
    return await ssrApiRequestService.reqAuthMe();
  } catch {
    return null;
  }
}

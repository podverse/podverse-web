/*
  When requests that require the Authorization cookie are sent from server-side,
  the client-side HTTPOnly Authorization cookie will be unavailable in server-side
  requests using the withCredentials flag. Instead we need to pass in bearerToken
  as a parameter and set the Authorization header manually.  
*/
export const getAuthCredentialsHeaders = (bearerToken?: string) => {
  return bearerToken
    ? {
      headers: {
        Authorization: bearerToken
      }
    } : {
      withCredentials: true
    }
}
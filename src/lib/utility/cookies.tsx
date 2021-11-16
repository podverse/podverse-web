/*
  Make sure not to pass _all_ cookies (ex. not Authorization),
  just the ones that we need.
*/

export type ClientSideCookies = {
  lightMode?: string
}

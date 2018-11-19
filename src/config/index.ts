
export const cookieConfig = {
  domain: process.env.COOKIE_DOMAIN ? process.env.COOKIE_DOMAIN : 'localhost',
  path: process.env.COOKIE_PATH ? process.env.COOKIE_PATH : '/'
}
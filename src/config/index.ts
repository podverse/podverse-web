export const config = {
  api: {
    /*
      Example:
        API_PROTOCOL=http
        API_HOST=localhost
        API_PORT=1234
        API_PREFIX=/api
        API_VERSION=/v2
    */
    internal: {
      protocol: process.env.API_PROTOCOL,
      host: process.env.API_HOST,
      port: process.env.API_PORT,
      prefix: process.env.API_PREFIX,
      version: process.env.API_VERSION
    },
    external: {
      protocol: process.env.NEXT_PUBLIC_API_PROTOCOL,
      host: process.env.NEXT_PUBLIC_API_HOST,
      port: process.env.NEXT_PUBLIC_API_PORT,
      prefix: process.env.NEXT_PUBLIC_API_PREFIX,
      version: process.env.NEXT_PUBLIC_API_VERSION
    }
  }
};

console.log("API Configuration:", JSON.stringify(config, null, 2));
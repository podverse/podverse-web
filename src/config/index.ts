export const config = {
  api: {
    /*
      NOTE: Remember to expose the public env vars in next.config.js

      Development mode defaults:
        API_PROTOCOL=http
        API_HOST=localhost
        API_PORT=1234
        API_PREFIX=/api
        API_VERSION=/v2

        WEB_PROTOCOL=http
        WEB_DOMAIN=localhost:3000
    */
    private: {
      api: {
        protocol: process.env.API_PROTOCOL,
        host: process.env.API_HOST,
        port: process.env.API_PORT,
        prefix: process.env.API_PREFIX,
        version: process.env.API_VERSION
      },
      web: {
        protocol: process.env.WEB_PROTOCOL,
        host: process.env.WEB_DOMAIN
      }
    },
    public: {
      api: {
        protocol: process.env.NEXT_PUBLIC_API_PROTOCOL,
        host: process.env.NEXT_PUBLIC_API_HOST,
        port: process.env.NEXT_PUBLIC_API_PORT,
        prefix: process.env.NEXT_PUBLIC_API_PREFIX,
        version: process.env.NEXT_PUBLIC_API_VERSION
      },
      web: {
        protocol: process.env.NEXT_PUBLIC_WEB_PROTOCOL,
        host: process.env.NEXT_PUBLIC_WEB_DOMAIN
      }
    }
  }
};

// console.log("API Configuration:", JSON.stringify(config, null, 2));
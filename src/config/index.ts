export const config = {
  public: {
    brand: {
      name: process.env.NEXT_PUBLIC_BRAND_NAME || ""
    },
    api: {
      ssr: {
        protocol: process.env.NEXT_PUBLIC_SSR_API_PROTOCOL,
        host: process.env.NEXT_PUBLIC_SSR_API_HOST,
        port: process.env.NEXT_PUBLIC_SSR_API_PORT
      },
      client: {
        protocol: process.env.NEXT_PUBLIC_API_PROTOCOL,
        host: process.env.NEXT_PUBLIC_API_HOST,
        port: process.env.NEXT_PUBLIC_API_PORT,
      },
      prefix: process.env.NEXT_PUBLIC_API_PREFIX,
      version: process.env.NEXT_PUBLIC_API_VERSION
    },
    web: {
      protocol: process.env.NEXT_PUBLIC_WEB_PROTOCOL,
      host: process.env.NEXT_PUBLIC_WEB_DOMAIN
    },
    app_value: {
      lightning_keysend: {
        name: process.env.NEXT_PUBLIC_APP_VALUE_LIGHTNING_KEYSEND_NAME || "",
        type: process.env.NEXT_PUBLIC_APP_VALUE_LIGHTNING_KEYSEND_TYPE || "",
        address: process.env.NEXT_PUBLIC_APP_VALUE_LIGHTNING_KEYSEND_ADDRESS || "",
        custom_key: process.env.NEXT_PUBLIC_APP_VALUE_LIGHTNING_KEYSEND_CUSTOM_KEY || "",
        custom_value: process.env.NEXT_PUBLIC_APP_VALUE_LIGHTNING_KEYSEND_CUSTOM_VALUE || ""
      }
    },
    server_env: process.env.NEXT_PUBLIC_SERVER_ENV || ""
  }
};

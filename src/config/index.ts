export const config = {
  private: {
    brand: {
      name: process.env.BRAND_NAME || ""
    },
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
    brand: {
      name: process.env.NEXT_PUBLIC_BRAND_NAME || ""
    },
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

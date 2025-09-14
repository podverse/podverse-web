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
    }
  }
};

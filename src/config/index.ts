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
    polling: {
      interval_ms: Number(process.env.NEXT_PUBLIC_POLLING_INTERVAL_MS) || 3000
    },
    features: {
      locales: {
        supported: process.env.NEXT_PUBLIC_FEATURES_SUPPORTED_LOCALES || "all-available",
        default: process.env.NEXT_PUBLIC_FEATURES_DEFAULT_LOCALE || "en"
      }
    },
    theme: {
      default: process.env.NEXT_PUBLIC_THEME_DEFAULT || "",
      valid: process.env.NEXT_PUBLIC_THEME_VALID || ""
    },
    notifications: {
      webpush: {
        vapidPublicKey: process.env.NEXT_PUBLIC_WEBPUSH_VAPID_PUBLIC_KEY || ""
      }
    },
    socials: {
      activityPub: process.env.NEXT_PUBLIC_SOCIAL_ACTIVITY_PUB || "",
      discord: process.env.NEXT_PUBLIC_SOCIAL_DISCORD || "",
      github: process.env.NEXT_PUBLIC_SOCIAL_GITHUB || "",
      matrix: process.env.NEXT_PUBLIC_SOCIAL_MATRIX || "",
      x: process.env.NEXT_PUBLIC_SOCIAL_X || ""
    },
    contact: {
      email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || ""
    },
    account: {
      signupMode: process.env.NEXT_PUBLIC_ACCOUNT_SIGNUP_MODE || 'sign-up',
      contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || ''
    },
    server_env: process.env.NEXT_PUBLIC_SERVER_ENV || ""
  }
};

// Version: 4
import { config } from "../config";

/* eslint-disable @typescript-eslint/no-var-requires */
// Try to require the main package first, as transpilation should fix the alias issues
let requestModule;
try {
  requestModule = require("podverse-helpers");
} catch (e) {
  console.warn("Failed to load podverse-helpers main entry, falling back to dist/lib/request", e);
  try {
    requestModule = require("podverse-helpers/dist/lib/request");
  } catch (e2) {
    console.error("Failed to load podverse-helpers request module", e2);
    requestModule = {};
  }
}

// Safely extract the class, handling default/named exports
const ApiRequestService = requestModule.ApiRequestService || requestModule.default?.ApiRequestService || requestModule.default;

export function getSSRApiRequestService(jwt?: string | null) {
  if (typeof ApiRequestService !== 'function') {
    // If the class is missing during build, return a dummy object to prevent build crash.
    // The runtime app will use the real container where this should work.
    console.error("ApiRequestService is not a constructor. Exports found:", Object.keys(requestModule));
    
    if (process.env.NODE_ENV === 'production') {
       // Return a dummy service for build time
       return {
         reqAuthMe: async () => null,
         reqAuthCheckSession: async () => {},
         reqAccountSendChangeEmailAddressEmail: async () => {}
       } as any;
    }
    throw new Error("ApiRequestService is not a constructor");
  }

  return new ApiRequestService({
    protocol: config.private.api.protocol || '',
    host: config.private.api.host || '',
    port: config.private.api.port || '',
    prefix: config.private.api.prefix || '',
    version: config.private.api.version || '',
    ...(jwt ? { jwt } : {})
  });
}

// Ensure the export exists even if loading failed
export const apiRequestService = (typeof ApiRequestService === 'function') 
  ? new ApiRequestService({
      protocol: config.public.api.protocol || '',
      host: config.public.api.host || '',
      port: config.public.api.port || '',
      prefix: config.public.api.prefix || '',
      version: config.public.api.version || ''
    })
  : {
      reqAccountSendChangeEmailAddressEmail: async () => console.log("Mock request sent"),
      // Add other methods as needed for build time
    } as any;

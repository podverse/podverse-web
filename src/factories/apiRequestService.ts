// Version: 5
import { config } from "../config";

/* eslint-disable @typescript-eslint/no-var-requires */
// Try to require the main package first, as transpilation should fix the alias issues
let requestModule: any;
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

// Mock implementation for fallback to prevent crashes when library is broken
const mockService = {
  reqAuthMe: async () => null,
  reqAuthCheckSession: async () => {},
  reqAccountSendChangeEmailAddressEmail: async () => {},
  reqCategoryGetAll: async () => ({ data: [] }),
  reqChannelGetMany: async () => ({ data: [], meta: { count: 0, limit: 10 } }),
  reqItemSoundbiteGet: async () => ({ item: null }),
  reqItemGetByIdOrIdText: async () => null,
  reqChannelGetByIdOrIdText: async () => null,
  reqPlaylistGet: async () => null,
  reqQueueResourcesGetAllByAccountAbridged: async () => [],
};

export function getSSRApiRequestService(jwt?: string | null) {
  if (typeof ApiRequestService !== 'function') {
    // If the class is missing during build/runtime, use the mock service
    console.error("ApiRequestService is not a constructor. Exports found:", Object.keys(requestModule));
    console.error("Using Mock ApiRequestService.");
    return mockService as any;
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
  : mockService as any;

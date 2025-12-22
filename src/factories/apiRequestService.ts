// Version: 3
import { config } from "../config";

/* eslint-disable @typescript-eslint/no-var-requires */
// Fix: Use require to handle potential CJS/ESM interop issues manually
const requestModule = require("podverse-helpers/dist/lib/request");

// Safely extract the class, handling both default and named exports
const ApiRequestService = requestModule.ApiRequestService || requestModule.default || requestModule;

export function getSSRApiRequestService(jwt?: string | null) {
  if (typeof ApiRequestService !== 'function') {
    console.error("ApiRequestService failed to load. Export found:", ApiRequestService);
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

export const apiRequestService = new ApiRequestService({
  protocol: config.public.api.protocol || '',
  host: config.public.api.host || '',
  port: config.public.api.port || '',
  prefix: config.public.api.prefix || '',
  version: config.public.api.version || ''
});

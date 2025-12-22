// Version: 2
// CHANGED: Import directly from the file path to avoid CommonJS/ESM interop issues with the index export
import { ApiRequestService } from "podverse-helpers/dist/lib/request";
import { config } from "../config";

export function getSSRApiRequestService(jwt?: string | null): ApiRequestService {
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

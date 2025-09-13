import { ApiRequestService } from "podverse-helpers";
import { config } from "../config";

export function getSSRApiRequestService(jwt?: string | null): ApiRequestService {
  return new ApiRequestService({
    protocol: config.api.private.api.protocol || '',
    host: config.api.private.api.host || '',
    port: config.api.private.api.port || '',
    prefix: config.api.private.api.prefix || '',
    version: config.api.private.api.version || '',
    ...(jwt ? { jwt } : {})
  });
}

export const apiRequestService = new ApiRequestService({
  protocol: config.api.public.api.protocol || '',
  host: config.api.public.api.host || '',
  port: config.api.public.api.port || '',
  prefix: config.api.public.api.prefix || '',
  version: config.api.public.api.version || ''
});

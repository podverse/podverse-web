import { ApiRequestService } from "podverse-helpers";
import { config } from "../config";

export function getSSRApiRequestService(jwt?: string | null): ApiRequestService {
  return new ApiRequestService({
    protocol: config.api.private.protocol || '',
    host: config.api.private.host || '',
    port: config.api.private.port || '',
    prefix: config.api.private.prefix || '',
    version: config.api.private.version || '',
    ...(jwt ? { jwt } : {})
  });
}

export const apiRequestService = new ApiRequestService({
  protocol: config.api.public.protocol || '',
  host: config.api.public.host || '',
  port: config.api.public.port || '',
  prefix: config.api.public.prefix || '',
  version: config.api.public.version || ''
});

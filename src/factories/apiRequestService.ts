import { ApiRequestService } from "podverse-helpers";
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

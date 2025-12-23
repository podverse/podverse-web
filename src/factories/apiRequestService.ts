import { ApiRequestService } from "podverse-helpers";
import { config } from "../config";

export function getSSRApiRequestService(jwt?: string | null): ApiRequestService {
  return new ApiRequestService({
    protocol: config.public.api.ssr.protocol || '',
    host: config.public.api.ssr.host || '',
    port: config.public.api.ssr.port || '',
    prefix: config.public.api.prefix || '',
    version: config.public.api.version || '',
    ...(jwt ? { jwt } : {})
  });
}

export const apiRequestService = new ApiRequestService({
  protocol: config.public.api.client.protocol || '',
  host: config.public.api.client.host || '',
  port: config.public.api.client.port || '',
  prefix: config.public.api.prefix || '',
  version: config.public.api.version || ''
});

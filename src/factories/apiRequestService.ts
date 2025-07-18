import { ApiRequestService } from "podverse-helpers";
import { config } from "../config";

export function getSSRApiRequestService(jwt?: string | null): ApiRequestService {
  return new ApiRequestService({
    protocol: config.api.protocol,
    host: config.api.host,
    port: config.api.port,
    prefix: config.api.prefix,
    version: config.api.version,
    ...(jwt ? { jwt } : {})
  });
}

export const apiRequestService = new ApiRequestService({
  protocol: config.api.protocol,
  host: config.api.host,
  port: config.api.port,
  prefix: config.api.prefix,
  version: config.api.version
});

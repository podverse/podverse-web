import { ApiRequestService } from "podverse-helpers";
import { config } from "../config";

export function getSSRApiRequestService(jwt?: string | null): ApiRequestService {
  return new ApiRequestService({
    protocol: config.api.internal.protocol,
    host: config.api.internal.host,
    port: config.api.internal.port,
    prefix: config.api.internal.prefix,
    version: config.api.internal.version,
    ...(jwt ? { jwt } : {})
  });
}

export const apiRequestService = new ApiRequestService({
  protocol: config.api.external.protocol,
  host: config.api.external.host,
  port: config.api.external.port,
  prefix: config.api.external.prefix,
  version: config.api.external.version
});

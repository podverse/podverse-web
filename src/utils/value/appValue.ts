import { AppValueRecipient } from "podverse-helpers";
import { config } from "../../config";

type GetAppValueRecipientParams = {
  type: string;
  method: string;
  final_amount: number;
}

export const getAppValueRecipient = ({
  type,
  method,
  final_amount
}: GetAppValueRecipientParams): AppValueRecipient | null => {
  if (type === "lightning" && method === "keysend") {
    return {
      type: config.public.app_value.lightning_keysend.type,
      address: config.public.app_value.lightning_keysend.address,
      name: config.public.app_value.lightning_keysend.name,
      custom_key: config.public.app_value.lightning_keysend.custom_key,
      custom_value: config.public.app_value.lightning_keysend.custom_value,
      normalized_split: 100,
      final_amount
    };
  }

  return null;
}

import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, deleteToken } from "firebase/messaging";
import { config } from "../../config";



let messaging: ReturnType<typeof getMessaging>;

if (typeof window !== "undefined" && "navigator" in window) {
  const app = initializeApp(config.public.externalServices.firebase);
  messaging = getMessaging(app);
}

export { messaging, getToken, onMessage, deleteToken };

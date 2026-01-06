import { v4 as uuidv4 } from 'uuid';
import { LOCAL_STORAGE } from "../../constants/localStorage";

export const getInstallationId = () => {
  try {
    return localStorage.getItem(LOCAL_STORAGE.INSTALLATION_ID_KEY);
  } catch (e) {
    return null;
  }
};

export const getOrCreateInstallationId = () => {
  try {
    let id = localStorage.getItem(LOCAL_STORAGE.INSTALLATION_ID_KEY);
    if (!id) {
      const newId = uuidv4();
      localStorage.setItem(LOCAL_STORAGE.INSTALLATION_ID_KEY, newId);
      id = newId;
    }
    return id;
  } catch (e) {
    return undefined;
  }
};

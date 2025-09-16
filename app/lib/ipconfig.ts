import Constants from "expo-constants";

function getBaseUrl() {
  try {
    // hostUri puede ser "192.168.1.23:8081"
    const host = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.debuggerHost;
    if (!host) return "http://localhost:3001"; // fallback por si no hay host
    const ip = host.split(":")[0]; // saca solo la IP
    return `http://${ip}:3001`;    // construye URL final
  } catch {
    return "http://localhost:3001";
  }
}

export const BASE_URL = getBaseUrl();
export const checkIfSSR = () => {
  return typeof window === "undefined";  
}

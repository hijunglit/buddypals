import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const setCookies = (name: string, value: string, options?: any) => {
    return cookies.set(name, value, {...options});
}
export const getCookies = (name: string) => {
    return cookies.get(name);
}
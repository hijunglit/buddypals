import { API_BASE_URL } from "./urls";
export async function getPosts() {
    return await fetch(`${API_BASE_URL}`).then((response) => response.json());
}
import { LocalStorage } from './local-storage'

export const authHeader = () => {
    let token = LocalStorage.getToken();
    console.log(token);
    if (token) {
        return { 'Authorization': 'Bearer ' + token };
    } else {
        return {};
    }
}
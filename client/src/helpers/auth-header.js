import { LocalStorage } from './local-storage'

export const authHeader = () => {
    let token = LocalStorage.getToken();
    if (token) {
        return { 'Authorization': 'Bearer ' + token };
    } else {
        return {};
    }
}
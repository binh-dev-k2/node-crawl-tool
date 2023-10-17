import { LocalStorage } from './local-storage'

export const authHeader = () => {
    let token = JSON.parse(LocalStorage.getToken());

    if (token) {
        return { 'Authorization': 'Bearer ' + token };
    } else {
        return {};
    }
}
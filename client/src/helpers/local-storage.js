

export const LocalStorage = {
    setToken: (token) => {
        localStorage.setItem('token', token);
    },
    getToken: () => {
        const token = localStorage.getItem('token');
        return token;
    },
    removeToken: () => {
        localStorage.removeItem('token');
    }
}

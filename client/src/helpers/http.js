import axios from 'axios'
import { authHeader } from './auth-header';

let http = null;

const init = () => {
    http = axios.create({
        baseURL: process.env.URL || 'http://localhost:3000'
    })
}

const get = async (url) => {
    try {
        const response = await http.get(url, { headers: authHeader })
        return response.data
    } catch (error) {
        throw new Error(`[Error] Http ${error}`)
    }
}

const post = async (resource, params) => {
    try {
        const response = await http.post(resource, params, { headers: authHeader })
        return response.data
    } catch (error) {
        throw new Error(`[Error] Http ${error}`)
    }
}

export const Http = { init, get, post };
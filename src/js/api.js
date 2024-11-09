// api.js
//import axios from './axios';

// Função genérica para requisitar serviços
const BASE_URL = "http://127.0.0.1:8000/";

export const callAPI = async (method, endpoint, data = null) => {
    event.preventDefault();
    const config = {
        method,
        headers: {
            "Content-Type": "application/json",
        },
    };

    if (data) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Erro ao chamar a API:", error);
        throw error;
    }
};
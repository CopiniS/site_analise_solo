import { callAPI } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
    // Obter o botão pelo ID
    const button = document.getElementById("chamarAPI");

    // Verifica se o botão existe no DOM
    if (!button) {
        console.error("Botão com ID 'chamarAPI' não encontrado no DOM!");
        return;
    }

    // Adicionar evento de clique no botão
    button.addEventListener("click", async () => {
        try {
            const login = {
                username: "mavifreitas",
                password: "1234567",
                email: "mariavitoria.freitas023@gmail.com"
            };

            // Chamada da API para o login
            const response = await callAPI("POST", "/auth/login", login);
            console.log("Produto adicionado:", response);
        } catch (error) {
            console.error("Erro ao adicionar o produto:", error);

            // Adiciona uma verificação para entender o erro
            if (error instanceof TypeError) {
                console.error("Erro de rede:", error.message);
            } else {
                console.error("Outro erro:", error);
            }
        }
    });
});

import { fetchFactory } from "../utils/FetchFactory";

const url = import.meta.env.VITE_CONALEP_API + "/login";

export async function Login({ user, password }) {
    const payload = {
        _usuario: user,
        _password: password
    };

    try {
        const response = await fetchFactory({
            url,
            data: payload,
            contentType: "json",
            method: "POST",
        });

        const result = await response.json();

        return result;
    } catch (error) {
        return {
            success: false,
            message: "Servicio no disponible",
            data: null,
        };
    }
}
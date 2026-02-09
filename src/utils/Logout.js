import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { fetchFactory } from "./FetchFactory";

export function useLogout() {
    const { setUsuario, setSub, setArea, setNombre, setPermisos, setRol } =
        useContext(UserContext);

    const url = import.meta.env.VITE_CONALEP_API + "/logout";

    const navigate = useNavigate();

    const logout = async () => {
        // 1. Eliminar token
        await fetchFactory({
            url,
            contentType: "json",
            method: "POST",
        });

        // 2. Limpiar contexto
        setArea(null);
        setNombre(null);
        setPermisos(null);
        setUsuario(null);
        setSub(null);
        setRol(null);

        // 3. Redirigir
        navigate("/");
    };

    return logout;
}
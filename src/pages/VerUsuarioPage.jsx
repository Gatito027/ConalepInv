import { useParams, useNavigate } from "react-router-dom";
import VerUsuarioComponent from "../components/Usuarios/VerUsuarioComponent";
import { usePermisos } from "../context/UseUserData";
import { useEffect } from "react";

export default function VerUsuarioPage() {
  const { id } = useParams();
  const { userPermisos = [] } = usePermisos();
  const navigate = useNavigate();

  useEffect(() => {
    if (!Array.isArray(userPermisos)) return;

    const tieneAmbosPermisos =
      userPermisos.includes("Usuarios") && userPermisos.includes("Detalles Usuario");

    if (!tieneAmbosPermisos) {
      navigate("/");
    }
  }, [userPermisos, navigate]);

  return <VerUsuarioComponent usuarioId={id} />;
}
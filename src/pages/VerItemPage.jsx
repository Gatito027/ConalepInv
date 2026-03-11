import { useParams, useNavigate } from "react-router-dom";
import { usePermisos } from "../context/UseUserData";
import { useEffect } from "react";
import VerItemComponent from "../components/Inventario/VerItemComponent";

export default function VerItemPage() {
  const { id } = useParams();
  const { userPermisos } = usePermisos();
  const navigate = useNavigate();

  useEffect(() => {
    // Si no hay permisos o no es un array válido, redirige
    if (!userPermisos || !Array.isArray(userPermisos)) {
      navigate("/");
      return;
    }

    const tieneAmbosPermisos =
      userPermisos.includes("Inventario") &&
      userPermisos.includes("Detalles articulo");

    if (!tieneAmbosPermisos) {
      navigate("/");
    }
  }, [userPermisos, navigate]);

  return <VerItemComponent itemid={id} />;
}
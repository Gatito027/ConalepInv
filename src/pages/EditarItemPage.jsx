import { useParams, useNavigate } from "react-router-dom";
import { usePermisos } from "../context/UseUserData";
import { useEffect } from "react";
import EditarItemComponent from "../components/EditarItem/EditarItemComponent";

export default function EditarItemPage() {
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
      userPermisos.includes("Roles") &&
      userPermisos.includes("Editar articulo");

    if (!tieneAmbosPermisos) {
      navigate("/");
    }
  }, [userPermisos, navigate]);

  return <EditarItemComponent itemId={id} />
}
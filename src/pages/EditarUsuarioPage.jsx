import { useParams } from "react-router-dom";
import EditarUsuarioComponent from "../components/Usuarios/EditarUsuarioComponent";

export default function EditarUsuarioPage(){
    const { id } = useParams();
    return(
        <EditarUsuarioComponent usuarioId={id} />
    );
}
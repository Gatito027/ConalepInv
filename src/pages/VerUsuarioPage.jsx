import { useParams } from "react-router-dom";
import VerUsuarioComponent from "../components/Usuarios/VerUsuarioComponent";

export default function VerUsuarioPage(){
    const { id } = useParams();
    return <VerUsuarioComponent usuarioId={id} />;
}
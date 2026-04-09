import LoginPage from "./LoginPage";
import { useUsuario } from "../context/UseUserData";
import MiInvetarioComponent from "../components/MiInvetario/MiInvetarioComponent";

export default function MiInvetarioPage(){
    const { userUsuario }= useUsuario();
  if (userUsuario === null) return <LoginPage/>;


  return <MiInvetarioComponent />
}
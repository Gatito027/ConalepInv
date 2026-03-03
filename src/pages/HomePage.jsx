import LoginPage from "./LoginPage";
import BuilderPage from "../components/Others/BuilderPage";
import { useUsuario, usePermisos } from "../context/UseUserData";

export default function HomePage() {
  const { userUsuario }= useUsuario();
  const { userPermisos } = usePermisos();
  if (userUsuario !== null){
    return <BuilderPage />
  }else{
    return <LoginPage/>;
  }
}
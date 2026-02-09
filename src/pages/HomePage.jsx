import LoginPage from "./LoginPage";
import BuilderPage from "../components/Others/BuilderPage";
import { useUsuario } from "../context/UseUserData";

export default function HomePage() {
  const { userUsuario }= useUsuario();
  if (userUsuario !== null){
    return <BuilderPage />
  }else{
    return <LoginPage/>;
  }
}
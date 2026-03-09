import LoginPage from "./LoginPage";
import BuilderPage from "../components/Others/BuilderPage";
import { useUsuario, usePermisos } from "../context/UseUserData";
import InventarioComponent from "../components/Inventario/InventarioComponent";

export default function HomePage() {
  const { userUsuario }= useUsuario();
  const { userPermisos } = usePermisos();
  if (userUsuario === null) return <LoginPage/>;

  if (!Array.isArray(userPermisos) || !userPermisos.includes("Inventario")) return <BuilderPage />;

  return <InventarioComponent />
}
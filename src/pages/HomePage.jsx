import LoginPage from "./LoginPage";
import { useUsuario, usePermisos } from "../context/UseUserData";
import InventarioComponent from "../components/Inventario/InventarioComponent";
import MiInvetarioComponent from "../components/MiInvetario/MiInvetarioComponent";

export default function HomePage() {
  const { userUsuario }= useUsuario();
  const { userPermisos } = usePermisos();
  if (userUsuario === null) return <LoginPage/>;

  if (!Array.isArray(userPermisos) || !userPermisos.includes("Inventario")) return <MiInvetarioComponent />;

  return <InventarioComponent />
}
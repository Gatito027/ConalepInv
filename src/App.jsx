import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserContextProvider } from "./context/UserContextProvider";
import HomePage from "./pages/HomePage";
import LayoutComponent from "./components/LayoutComponent";
import UsuariosPage from "./pages/UsuariosPage";
import RegistroUsuariosPage from "./pages/RegistroUsuariosPage";
import VerUsuarioPage from "./pages/VerUsuarioPage";
import NotFound from "./pages/NoFoundPage";
import EditarUsuarioPage from "./pages/EditarUsuarioPage";
import RolesPage from "./pages/RolesPage";
import RegistrarRolPage from "./pages/RegistrarRolPage";
import VerRolPage from "./pages/VerRolPage";
import EditarRolPage from "./pages/EditarRolPage";
import VerItemPage from "./pages/VerItemPage";

function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LayoutComponent />}>
            <Route index element={<HomePage />} />
            <Route path="usuarios" element={<UsuariosPage />} />
            <Route path="usuarios/registro" element={<RegistroUsuariosPage />} />
            <Route path="usuarios/usu/:id" element={<VerUsuarioPage />} />
            <Route path="usuarios/editUsu/:id" element={<EditarUsuarioPage />} />
            <Route path="roles" element={<RolesPage/>} />
            <Route path="roles/registro" element={<RegistrarRolPage />} />
            <Route path="roles/rol/:id" element={<VerRolPage />} />
            <Route path="roles/editrol/:id" element={<EditarRolPage />} />
            <Route path="inventario/item/:id" element={<VerItemPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;

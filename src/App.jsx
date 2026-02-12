import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserContextProvider } from "./context/UserContextProvider";
import HomePage from "./pages/HomePage";
import LayoutComponent from "./components/LayoutComponent";
import UsuariosPage from "./pages/UsuariosPage";
import RegistroUsuariosPage from "./pages/RegistroUsuariosPage";

function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LayoutComponent />}>
            <Route index element={<HomePage />} />
            <Route path="usuarios" element={<UsuariosPage />} />
            <Route path="usuarios/registro" element={<RegistroUsuariosPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;

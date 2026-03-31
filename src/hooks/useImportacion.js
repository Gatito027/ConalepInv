import { useContext } from "react";
import { ImportacionContext } from "../context/ImportacionContext";

export const useImportacion = () => useContext(ImportacionContext);
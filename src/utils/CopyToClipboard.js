import toast from "react-hot-toast";

export function CopyToClipboard(text, successMessage = "Texto copiado") {
  if (text) {
    navigator.clipboard.writeText(text);
    toast.success(successMessage);
  } else {
    toast.error("No hay texto para copiar");
  }
}
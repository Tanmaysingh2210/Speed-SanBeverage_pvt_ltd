import { createContext, useContext, useState, useCallback } from "react";
import Toast from "../Components/Toast";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success", // success | error
  });

  const showToast = useCallback((message, type = "success", duration = 3000) => {
    setToast({ visible: true, message, type });

    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast toast={toast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

import "./toast.css";

const Toast = ({ toast }) => {
  if (!toast.visible) return null;

  return (
    <div className={`custom-toast ${toast.type}`}>
      {toast.message}
    </div>
  );
};

export default Toast;

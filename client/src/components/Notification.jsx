import { useEffect } from "react";
import "./Notification.css";

function Notification({ message, show, onHide }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => onHide(), 3000); // Hide after 3 seconds
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [show, onHide]);

  if (!show) return null;

  return (
    <div className="notification">
      <p>{message}</p>
    </div>
  );
}

export default Notification;

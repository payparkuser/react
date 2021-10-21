import React from "react";
import { withToastManager } from "react-toast-notifications";
// const { removeToast, toasts } = withToastManager();
// const removeAllToasts = () => toasts.forEach(({ id }) => removeToast(id));
const ToastDemo = (toastManager, error_message, type) => {
    // removeAllToasts();
    return toastManager.add(error_message, {
        appearance: type,
        autoDismiss: true,
        pauseOnHover: false
    });
};

export default ToastDemo;

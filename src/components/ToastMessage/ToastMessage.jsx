import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleInfo,
  faTriangleExclamation,
  faBug,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./ToastMessage.module.scss";
const cx = classNames.bind(styles);

export default function Toast({
  title = "",
  message = "",
  type = "info",       // 'success' | 'info' | 'warning' | 'error'
  duration = 3000,
  onClose = () => {},
}) {
  const [visible, setVisible] = useState(true);
  const delay = (duration / 1000).toFixed(2);

  useEffect(() => {
    const hideTimer = setTimeout(() => {
      setVisible(false);
      // gọi onClose sau khi animation fadeOut kết thúc (1s)
      const finish = setTimeout(() => onClose(), 1000);
      // cleanup nested timeout nếu component unmount trước
      return () => clearTimeout(finish);
    }, duration);

    return () => clearTimeout(hideTimer);
  }, [duration, onClose]);

  if (!visible) return null;

  // map to FontAwesome icon objects (đúng với FontAwesomeIcon)
  const icons = {
    success: faCircleCheck,
    info:    faCircleInfo,
    warning: faTriangleExclamation,
    error:   faBug,
  };

  // nếu có type lạ, fallback info
  const icon = icons[type] || icons.info;

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 1000); // chờ fadeOut xong rồi remove
  };

  return (
    <div
    id="toast"
      className={cx("toast", `toast--${type}`)}
      style={{
        animation: `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`,
      }}
    >
      <div className={cx("toast__icon")}>
        <FontAwesomeIcon icon={icon} />
      </div>

      <div className={cx("toast__body")}>
        <h3 className={cx("toast__title")}>{title}</h3>
        <p className={cx("toast__msg")}>{message}</p>
      </div>

      <div className={cx("toast__close")} onClick={handleClose} aria-label="close">
        <FontAwesomeIcon icon={faXmark} />
      </div>

      <div
        className={cx("progress__bar")}
        style={{
          animation: `toast-progress linear ${duration}ms forwards`,
          background: `var(--toast-bg-${type})`,
        }}
      />
    </div>
  );
}

import { ButtonType, ButtonVariant } from "@/types";
import React, { FunctionComponent } from "react";

import $ from "./Button.module.css";

interface ButtonProps {
  onClick?: () => void;
  type?: ButtonType;
  variant?: ButtonVariant;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
}

const Button: FunctionComponent<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  loading = false,
  className,
}) => {
  const classNames = [$.button, variant === "primary" ? $.primary : $.secondary, className].filter(Boolean).join(" ");
  return (
    <button
      className={classNames}
      type={type}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? (
        <span data-testid="loading-spinner" className={$.spinner} style={{ marginRight: 8 }}>
          <svg width="16" height="16" viewBox="0 0 50 50">
            <circle cx="25" cy="25" r="20" fill="none" stroke="#ffffff" strokeWidth="5" strokeDasharray="31.4 31.4">
              <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" />
            </circle>
          </svg>
        </span>
      ) : null}
      {children}
    </button>
  );
};

export default Button;

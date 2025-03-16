// src/shared/components/Button.js
import React from "react";

export function Button({ children, variant, className = "", ...props }) {
  // variant: "outline", "ghost", etc. depende de tu lógica
  return (
    <button
      className={`px-4 py-2 rounded-md text-sm font-medium ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

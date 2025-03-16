// src/shared/components/Button.js
import React from "react";

export function Button({ children, className = "", ...props }) {
  return (
    <button className={`px-4 py-2 rounded-md text-sm font-medium transition ${className}`} {...props}>
      {children}
    </button>
  );
}

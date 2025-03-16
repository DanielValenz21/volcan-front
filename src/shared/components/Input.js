// src/shared/components/Input.js
import React from "react";

export function Input({ className = "", ...props }) {
  return (
    <input className={`border px-3 py-2 rounded-md text-sm ${className}`} {...props} />
  );
}

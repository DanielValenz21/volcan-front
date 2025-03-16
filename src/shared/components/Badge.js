// src/shared/components/Badge.js
import React from "react";

export function Badge({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-sm font-medium ${className}`}>
      {children}
    </span>
  );
}

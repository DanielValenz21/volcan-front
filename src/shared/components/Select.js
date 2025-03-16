// src/shared/components/Select.js
import React from "react";

export function Select({ value, onValueChange, children, className = "" }) {
  return (
    <select className={`border px-3 py-2 rounded-md text-sm ${className}`} value={value} onChange={(e) => onValueChange(e.target.value)}>
      {children}
    </select>
  );
}

export function SelectTrigger({ children, className = "", ...props }) {
  return <div className={className} {...props}>{children}</div>;
}

export function SelectValue({ placeholder }) {
  return <>{placeholder}</>;
}

export function SelectContent({ children }) {
  return <>{children}</>;
}

export function SelectItem({ children, value }) {
  return <option value={value}>{children}</option>;
}

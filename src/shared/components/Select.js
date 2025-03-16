// src/shared/components/Select.js
import React, { useState } from "react";

// MUY simple. Normalmente usarías un dropdown con su UI. Aquí un stub:
export function Select({ value, onValueChange, children, className }) {
  // Por simplicidad, devolvemos un <select>
  return (
    <select
      className={`border px-3 py-2 rounded-md text-sm ${className}`}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
    >
      {children}
    </select>
  );
}

export function SelectTrigger({ children, className, ...props }) {
  return <div {...props} className={className}>{children}</div>;
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

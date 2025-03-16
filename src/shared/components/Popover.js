// src/shared/components/Popover.js
import React, { useState } from "react";

export function Popover({ children }) {
  return <div>{children}</div>;
}

export function PopoverTrigger({ asChild, children, ...props }) {
  return <span {...props}>{children}</span>;
}

export function PopoverContent({ children, className = "", ...props }) {
  // Minimal: lo mostramos siempre
  // Deberías controlar el "open" para un popover real
  return (
    <div className={`border p-2 bg-white rounded shadow ${className}`} {...props}>
      {children}
    </div>
  );
}

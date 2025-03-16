// src/shared/components/Popover.js
import React from "react";

export function Popover({ children }) {
  return <div className="relative inline-block">{children}</div>;
}
export function PopoverTrigger({ asChild, children, ...props }) {
  return <span {...props}>{children}</span>;
}
export function PopoverContent({ children, className = "", ...props }) {
  return <div className={`absolute z-10 mt-2 border p-2 bg-white rounded shadow ${className}`} {...props}>{children}</div>;
}

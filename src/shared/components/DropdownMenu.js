// src/shared/components/DropdownMenu.js
import React from "react";

export function DropdownMenu({ children }) {
  return <div className="relative inline-block">{children}</div>;
}
export function DropdownMenuTrigger({ asChild, children, ...props }) {
  return <span {...props}>{children}</span>;
}
export function DropdownMenuContent({ children, align }) {
  return <div className="absolute right-0 mt-1 border p-2 bg-white rounded shadow">{children}</div>;
}
export function DropdownMenuItem({ children, onClick }) {
  return (
    <div className="cursor-pointer hover:bg-gray-100 px-2 py-1" onClick={onClick}>
      {children}
    </div>
  );
}

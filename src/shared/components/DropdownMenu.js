// src/shared/components/DropdownMenu.js
import React, { useState } from "react";

export function DropdownMenu({ children }) {
  return <div>{children}</div>;
}

export function DropdownMenuTrigger({ asChild, children, ...props }) {
  return <span {...props}>{children}</span>;
}

export function DropdownMenuContent({ children, align }) {
  // Minimal: siempre visible
  return (
    <div className="border p-2 mt-1 bg-white rounded shadow">
      {children}
    </div>
  );
}

export function DropdownMenuItem({ children, onClick }) {
  return (
    <div
      className="cursor-pointer hover:bg-gray-100 px-2 py-1"
      onClick={onClick}
    >
      {children}
    </div>
  );
}

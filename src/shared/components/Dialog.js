// src/shared/components/Dialog.js
import React, { useState } from "react";

export function Dialog({ children, open, onOpenChange }) {
  // Simple stub; en un library real usarías un portal
  return open ? <div>{children}</div> : null;
}

export function DialogTrigger({ children, asChild, ...props }) {
  // asChild no implementado
  return <div {...props}>{children}</div>;
}

export function DialogContent({ children }) {
  return (
    <div className="border shadow p-4 bg-white rounded-md">
      {children}
    </div>
  );
}

export function DialogHeader({ children }) {
  return <div className="mb-2">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h3 className="text-lg font-semibold mb-1">{children}</h3>;
}

export function DialogDescription({ children }) {
  return <p className="text-sm text-gray-600">{children}</p>;
}

export function DialogFooter({ children }) {
  return <div className="mt-4 flex justify-end gap-2">{children}</div>;
}

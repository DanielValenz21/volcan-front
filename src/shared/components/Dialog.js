// src/shared/components/Dialog.js
import React from "react";

export function Dialog({ children, open }) {
  return open ? <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">{children}</div> : null;
}
export function DialogTrigger({ children, ...props }) {
  return <div {...props}>{children}</div>;
}
export function DialogContent({ children }) {
  return <div className="bg-white p-4 rounded-md shadow-lg">{children}</div>;
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

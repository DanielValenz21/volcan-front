// src/shared/components/Alert.js
import React from "react";

export function Alert({ children, variant }) {
  const bg = variant === "destructive" ? "bg-red-100 text-red-800 border-red-200" : "bg-gray-100";
  return (
    <div className={`border px-4 py-2 rounded-md mb-2 ${bg}`}>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

export function AlertTitle({ children }) {
  return <strong className="mr-2">{children}</strong>;
}

export function AlertDescription({ children }) {
  return <span>{children}</span>;
}

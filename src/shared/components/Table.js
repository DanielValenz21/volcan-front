// src/shared/components/Table.js
import React from "react";

export function Table({ children, className = "" }) {
  return <table className={`w-full text-sm ${className}`}>{children}</table>;
}
export function TableHeader({ children, className = "" }) {
  return <thead className={className}>{children}</thead>;
}
export function TableBody({ children, className = "" }) {
  return <tbody className={className}>{children}</tbody>;
}
export function TableRow({ children, className = "", ...props }) {
  return <tr className={className} {...props}>{children}</tr>;
}
export function TableHead({ children, className = "" }) {
  return <th className={`px-4 py-2 text-left ${className}`}>{children}</th>;
}
export function TableCell({ children, className = "", ...props }) {
  return <td className={`px-4 py-2 ${className}`} {...props}>{children}</td>;
}

// src/shared/components/Card.js
import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-md border bg-white ${className}`}>{children}</div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function CardHeader({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

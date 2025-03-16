// src/shared/components/Calendar.js
import React from "react";

export function Calendar({ selected, onSelect }) {
  const handleChange = (e) => {
    if (onSelect) onSelect(new Date(e.target.value));
  };
  return (
    <input
      type="date"
      value={selected ? selected.toISOString().substring(0, 10) : ""}
      onChange={handleChange}
      className="border p-2 rounded"
    />
  );
}

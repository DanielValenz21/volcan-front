// src/shared/components/Calendar.js
import React from "react";

// Este es un stub. Tu código quiere un <Calendar> con mode="single", etc.
// Realmente deberías usar un library como "react-calendar" o "date-fns"
export function Calendar({ selected, onSelect, locale }) {
  // Minimal: un input date
  const handleChange = (e) => {
    if (onSelect) onSelect(new Date(e.target.value));
  };

  return (
    <input
      type="date"
      value={selected ? selected.toISOString().substring(0, 10) : ""}
      onChange={handleChange}
      className="border p-2"
    />
  );
}

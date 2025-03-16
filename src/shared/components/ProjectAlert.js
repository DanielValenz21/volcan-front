// src/shared/components/ProjectAlert.js
import React, { useState } from "react";
import { Tool } from "react-feather"; // Ejemplo de ícono
import "./ProjectAlert.css";

function ProjectAlert({ onClose }) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="project-alert-container animate-fade-in-down">
      <div className="project-alert-card">
        <div className="project-alert-icon">
          <Tool className="icon-size" />
        </div>
        <div className="project-alert-content">
          <h2 className="project-alert-title">Proyecto en desarrollo</h2>
          <p className="project-alert-description">
            Estamos trabajando arduamente en este proyecto. ¡Pronto tendremos más funcionalidades disponibles!
          </p>
          <button
            className="project-alert-info-button"
            onClick={() => setShowMore(!showMore)}
            disabled={showMore}
          >
            {showMore ? "Ocultar información" : "Más información"}
          </button>
          {showMore && (
            <div className="project-alert-more">
              <p>Detalles adicionales: se seguirá trabajando en ventas.</p>
            </div>
          )}
        </div>
        <button className="project-alert-close" onClick={onClose}>
          X
        </button>
      </div>
    </div>
  );
}

export default ProjectAlert;

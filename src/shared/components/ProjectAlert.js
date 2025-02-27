// src/shared/components/ProjectAlert.js
import React, { useState } from "react";
import { Tool } from "react-feather"; // o el icono que desees
import "./ProjectAlert.css"; // Aquí pondrás la clase animate-fade-in-down

function ProjectAlert({ onClose }) {
  // Este estado controla "Más información"
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="project-alert-container animate-fade-in-down"> 
      <div className="project-alert-card">
        {/* Icono de la izquierda */}
        <div className="project-alert-icon">
          <Tool className="icon-size" />
        </div>

        {/* Contenido principal */}
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
            {showMore ? "Ya no hay más info" : "Más información"}
          </button>

          {showMore && (
            <div className="project-alert-more">
              <p>Detalles adicionales: se seguira trabajando en ventas</p>
            </div>
          )}
        </div>

        {/* Botón para cerrar la alerta */}
        <button className="project-alert-close" onClick={onClose}>
          X
        </button>
      </div>
    </div>
  );
}

export default ProjectAlert;

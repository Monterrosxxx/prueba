// frontend/src/components/TabsProducts.jsx

// Importa React y el hook useState para manejar el estado local
import React, { useState } from 'react';

/**
 * Componente Tabs - Sistema de pestañas para información de productos
 * 
 * Componente que gestiona tres secciones principales de información del producto:
 * - Descripción: Información general del producto
 * - Detalles: Especificaciones técnicas o detalladas
 * - Envío: Información sobre políticas de envío
 * 
 * @param {string} description - Contenido de la pestaña de descripción
 * @param {string} details - Contenido de la pestaña de detalles
 * @param {string} shipping - Contenido de la pestaña de envío
 */
const Tabs = ({ description, details, shipping }) => {
  // Estado local para gestionar la pestaña activa (por defecto es 'description')
  const [tab, setTab] = useState('description');

  /**
   * Función que renderiza el contenido según la pestaña activa
   * @returns {JSX.Element|null} Contenido correspondiente a la pestaña seleccionada
   */
  const renderContent = () => {
    // Verifica el valor de la pestaña activa y renderiza el contenido correspondiente
    switch (tab) {
      case 'description': 
        return <p>{description}</p>;  // Muestra el contenido de descripción
      case 'details': 
        return <p>{details}</p>;      // Muestra el contenido de detalles
      case 'shipping': 
        return <p>{shipping}</p>;     // Muestra el contenido de envío
      default: 
        return null;                  // Si no hay pestaña válida, no se muestra nada
    }
  };

  return (
    <div>
      {/* Contenedor de los botones de las pestañas */}
      <div className="flex gap-6 border-b pb-2 text-sm font-medium text-gray-600">
        {/* Botón para la pestaña de Descripción */}
        <button
          onClick={() => setTab('description')} // Cambia la pestaña activa a 'description'
          className={`${tab === 'description' ? 'text-pink-500 border-b-2 border-pink-400' : ''}`}
        >
          Descripción
        </button>

        {/* Botón para la pestaña de Detalles */}
        <button
          onClick={() => setTab('details')} // Cambia la pestaña activa a 'details'
          className={`${tab === 'details' ? 'text-pink-500 border-b-2 border-pink-400' : ''}`}
        >
          Detalles
        </button>

        {/* Botón para la pestaña de Envío */}
        <button
          onClick={() => setTab('shipping')} // Cambia la pestaña activa a 'shipping'
          className={`${tab === 'shipping' ? 'text-pink-500 border-b-2 border-pink-400' : ''}`}
        >
          Envío
        </button>
      </div>

      {/* Muestra el contenido de la pestaña activa */}
      <div className="mt-3 text-sm text-gray-700">{renderContent()}</div>
    </div>
  );
};

// Exporta el componente Tabs para que pueda ser utilizado en otros archivos
export default Tabs;
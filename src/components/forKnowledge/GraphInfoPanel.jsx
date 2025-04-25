"use client"
import "./GraphInfoPanel.css"

const GraphInfoPanel = ({ stats, selectedNode, onClose, language = "english" }) => {
  const translations = {
    english: {
      overview: "Graph Overview",
      statistics: "Statistics",
      displaying: "Displaying",
      nodes: "nodes",
      relationships: "relationships",
      nodeLabels: "Node Labels",
      relationshipTypes: "Relationship Types",
      selectedNode: "Selected Node",
      label: "Label",
      category: "Category",
      viewDetails: "View Full Details",
    },
    french: {
      overview: "Aperçu du Graphe",
      statistics: "Statistiques",
      displaying: "Affichage de",
      nodes: "nœuds",
      relationships: "relations",
      nodeLabels: "Étiquettes de Nœuds",
      relationshipTypes: "Types de Relations",
      selectedNode: "Nœud Sélectionné",
      label: "Étiquette",
      category: "Catégorie",
      viewDetails: "Voir les Détails Complets",
    },
    arabic: {
      overview: "نظرة عامة على الرسم البياني",
      statistics: "إحصائيات",
      displaying: "عرض",
      nodes: "عقد",
      relationships: "علاقات",
      nodeLabels: "تسميات العقد",
      relationshipTypes: "أنواع العلاقات",
      selectedNode: "العقدة المحددة",
      label: "تسمية",
      category: "فئة",
      viewDetails: "عرض التفاصيل الكاملة",
    },
  }

  const t = translations[language] || translations.english

  return (
    <div className="graph-info-panel">
      <div className="panel-header">
        <h3>{t.overview}</h3>
        <button className="close-panel-button" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="panel-content">
        <div className="panel-section">
          <h4>{t.statistics}</h4>
          <p>
            {t.displaying} {stats.nodeCount} {t.nodes}, {stats.relationshipCount} {t.relationships}.
          </p>
        </div>

        <div className="panel-section">
          <h4>{t.nodeLabels}</h4>
          <div className="label-list">
            {stats.nodeLabels.map((label, index) => (
              <span key={index} className="node-label-badge">
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="panel-section">
          <h4>{t.relationshipTypes}</h4>
          <div className="label-list">
            {stats.relationshipTypes.map((type, index) => (
              <span key={index} className="relationship-type-badge">
                {type}
              </span>
            ))}
          </div>
        </div>

        {selectedNode && (
          <div className="panel-section selected-node-info">
            <h4>{t.selectedNode}</h4>
            <div className="node-details">
              <p>
                <strong>{t.label}:</strong> {selectedNode.label}
              </p>
              <p>
                <strong>{t.category}:</strong> {selectedNode.category}
              </p>
              <button className="view-details-button">{t.viewDetails}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GraphInfoPanel


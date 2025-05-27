import { useState } from "react"
import "./TermCard.css"

const TermCard = ({ term }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const getCategoryColor = (category) => {
    const colors = {
      "Données personnelles": "#E5DEFF",
      "Commerce électronique": "#FDE1D3",
      Réseaux: "#D3E4FD",
      "Criminalité informatique": "#FFDEE2",
      Divers: "#F1F0FB",
      "Contrat Informatique": "#F2FCE2",
      "Propriété intellectuelle": "#FEF7CD",
      Organisations: "#FEC6A1",
      "Computer Science": "#E5DEFF",
      Networks: "#D3E4FD",
      "Software Development": "#E0F5E9",
      "Data Management": "#FFF6D9",
      Cybersecurity: "#FFE5E5",
    }
    return colors[category] || "#F1F0FB"
  }
  const getBorderColor = (category) => {
    const colors = {
      "Données personnelles": "#9b87f5",
      "Commerce électronique": "#F4A261",
      Réseaux: "#64A1F4",
      "Criminalité informatique": "#E76F6F",
      Divers: "#A0A0C8",
      "Contrat Informatique": "#7CC365",
      "Propriété intellectuelle": "#F4D35E",
      Organisations: "#F4845F",
      "Computer Science": "#9b87f5",
      Networks: "#64A1F4",
      "Software Development": "#2ECC71",
      "Data Management": "#F1C40F",
      Cybersecurity: "#E74C3C",
    }
    return colors[category] || "#9b87f5"
  }

  const hasMultipleDefinitions = term.categories && term.categories.length > 0

  const primaryCategory = term.category || (term.categories && term.categories[0]?.type) || "Divers"

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div
      className={`term-card ${isExpanded ? "expanded" : ""}`}
      style={{
        backgroundColor: getCategoryColor(primaryCategory),
        borderTop: `4px solid ${getBorderColor(primaryCategory)}`,
      }}
      onClick={toggleExpand}
    >
      <div className="term-header">
        <h3>{term.name}</h3>
        <span className="category-tag">{primaryCategory}</span>
        {hasMultipleDefinitions && (
          <span className="definitions-count">
            {term.categories.length} {term.categories.length > 1 ? "categories" : "category"}
          </span>
        )}
      </div>

      {!isExpanded ? (
        <div className="term-body">
          <p className="definition">
            {term.definition ||
              (term.categories &&
                term.categories[0]?.principale &&
                term.categories[0].principale[0]?.definition_principale[0]) ||
              "No definition available"}
          </p>
          {term.reference && <p className="reference">Source: {term.reference}</p>}
          {!term.reference &&
            term.categories &&
            term.categories[0]?.principale &&
            term.categories[0].principale[0]?.references &&
            term.categories[0].principale[0].references.length > 0 && (
              <p className="reference">Source: {term.categories[0].principale[0].references[0]}</p>
            )}
        </div>
      ) : (
        <div className="term-expanded-content">
          {term.categories ? (
            term.categories.map((category, catIndex) => (
              <div
                key={catIndex}
                className="category-section"
                style={{
                  borderLeft: `3px solid ${getBorderColor(category.type)}`,
                  backgroundColor: `${getCategoryColor(category.type)}50`, 
                }}
              >
                <h4 className="category-title">{category.type}</h4>
                {category.principale &&
                  category.principale.map((primary, primIndex) => (
                    <div key={`prim-${catIndex}-${primIndex}`} className="definition-block primary">
                      <h5>Primary Definition</h5>
                      {primary.definition_principale.map((def, defIndex) => (
                        <p key={`def-${catIndex}-${primIndex}-${defIndex}`} className="definition">
                          {def}
                        </p>
                      ))}
                      {primary.references && primary.references.length > 0 && (
                        <div className="references">
                          {primary.references.map((ref, refIndex) => (
                            <p key={`ref-${catIndex}-${primIndex}-${refIndex}`} className="reference">
                              Source: {ref}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                {category.secondaire && category.secondaire.length > 0 && (
                  <>
                    {category.secondaire.map((secondary, secIndex) => (
                      <div key={`sec-${catIndex}-${secIndex}`} className="definition-block secondary">
                        <h5>Secondary Definition</h5>
                        {secondary.definition_secondaire.map((def, defIndex) => (
                          <p key={`secdef-${catIndex}-${secIndex}-${defIndex}`} className="definition">
                            {def}
                          </p>
                        ))}
                        {secondary.reference_secondaires && secondary.reference_secondaires.length > 0 && (
                          <div className="references">
                            {secondary.reference_secondaires.map((ref, refIndex) => (
                              <p key={`secref-${catIndex}-${secIndex}-${refIndex}`} className="reference">
                                Source: {ref}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="definition-block">
              <p className="definition">{term.definition}</p>
              {term.reference && <p className="reference">Source: {term.reference}</p>}
            </div>
          )}

          {term.ID && (
            <div className="term-metadata">
              <p>Term ID: {term.ID}</p>
              {term.AR_id && <p>AR ID: {term.AR_id}</p>}
              {term.AN_id && <p>AN ID: {term.AN_id}</p>}
              {term.info && <p>Additional Info: {term.info}</p>}
            </div>
          )}
        </div>
      )}

      <button className="add-library-btn">{isExpanded ? "Close Details" : "Add to Library"}</button>
    </div>
  )
}

export default TermCard

/**
 * Utility functions for handling term data and fixing definition duplication
 */

/**
 * Processes term data to deduplicate definitions across categories
 * @param {Object} term - The term object to process
 * @returns {Object} - The processed term with deduplicated definitions
 */
export const processTermData = (term) => {
    if (!term || !term.categories || !Array.isArray(term.categories)) {
      return term
    }
  
    // Store the original categories for use in the details view
    term.allCategories = [...term.categories]
  
    // Create a map to track which definitions have been seen
    const seenDefinitions = new Map()
  
    // Create deduplicated categories for display
    const uniqueCategories = []
  
    term.categories.forEach((category) => {
      // Skip if category doesn't have a name
      if (!category.name) return
  
      // Create a new category object with the same name
      const uniqueCategory = {
        name: category.name,
        principal_definition: null,
      }
  
      // Check if this category has a principal definition
      if (category.principal_definition && category.principal_definition.text) {
        const definitionText = category.principal_definition.text
  
        // Check if we've seen this definition before
        if (!seenDefinitions.has(definitionText)) {
          // If not seen before, add it to this category
          uniqueCategory.principal_definition = { ...category.principal_definition }
          seenDefinitions.set(definitionText, category.name)
          uniqueCategories.push(uniqueCategory)
        }
        // If we've seen this definition before, don't add it again
      } else {
        // If no principal definition, still add the category
        uniqueCategories.push(uniqueCategory)
      }
    })
  
    // Replace the categories with deduplicated ones for display
    term.displayCategories = uniqueCategories
  
    return term
  }
  
  /**
   * Process an array of terms to deduplicate definitions
   * @param {Array} terms - Array of term objects
   * @returns {Array} - Processed terms with deduplicated definitions
   */
  export const processTermsData = (terms) => {
    if (!Array.isArray(terms)) {
      return []
    }
  
    return terms.map((term) => processTermData(term))
  }
  
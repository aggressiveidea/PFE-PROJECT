
export const processTermData = (term) => {
    if (!term || !term.categories || !Array.isArray(term.categories)) {
      return term
    }
  
    term.allCategories = [...term.categories]

    const seenDefinitions = new Map()
  
    // Create deduplicated categories for display
    const uniqueCategories = []
  
    term.categories.forEach((category) => {

      if (!category.name) return

      const uniqueCategory = {
        name: category.name,
        principal_definition: null,
      }
  
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
  

  export const processTermsData = (terms) => {
    if (!Array.isArray(terms)) {
      return []
    }
  
    return terms.map((term) => processTermData(term))
  }
  
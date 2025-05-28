
export const processTermData = (term) => {
    if (!term || !term.categories || !Array.isArray(term.categories)) {
      return term
    }
  
    term.allCategories = [...term.categories]

    const seenDefinitions = new Map()

    const uniqueCategories = []
  
    term.categories.forEach((category) => {

      if (!category.name) return

      const uniqueCategory = {
        name: category.name,
        principal_definition: null,
      }
  
      if (category.principal_definition && category.principal_definition.text) {
        const definitionText = category.principal_definition.text
        if (!seenDefinitions.has(definitionText)) {
          uniqueCategory.principal_definition = { ...category.principal_definition }
          seenDefinitions.set(definitionText, category.name)
          uniqueCategories.push(uniqueCategory)
        }
      } else {
        uniqueCategories.push(uniqueCategory)
      }
    })

    term.displayCategories = uniqueCategories
  
    return term
  }
  

  export const processTermsData = (terms) => {
    if (!Array.isArray(terms)) {
      return []
    }
  
    return terms.map((term) => processTermData(term))
  }
  
import { useNavigate } from "react-router-dom"
import { Database, ShoppingCart, Network, Shield, FileQuestion, FileText, Copyright, Building } from "lucide-react"
import "./CategoryPage.css"

const CategoryPage = ({ darkMode }) => {
  const navigate = useNavigate()

  const handleCategorySelect = (category) => {
   
    localStorage.setItem("currentCategory", category.toLowerCase())

   
    navigate(`/quiz/question/${category.toLowerCase()}`)
  }

  const categories = [
    {
      id: "personal-data",
      name: "Personal Data",
      icon: <Database />,
      description: "Questions about data protection, privacy laws, and personal information management.",
      features: ["GDPR concepts", "Data subject rights", "Data protection principles"],
    },
    {
      id: "e-commerce",
      name: "E-commerce",
      icon: <ShoppingCart />,
      description: "Test your knowledge of online business, digital transactions, and e-commerce regulations.",
      features: ["Online marketplace rules", "Consumer rights", "Digital payment systems"],
    },
    {
      id: "networks",
      name: "Networks",
      icon: <Network />,
      description: "Questions about network infrastructure, protocols, and communication systems.",
      features: ["Network types", "Internet protocols", "Network security"],
    },
    {
      id: "cybercrime",
      name: "Cybercrime",
      icon: <Shield />,
      description: "Test your knowledge of computer crimes, digital forensics, and cybersecurity laws.",
      features: ["Hacking laws", "Digital evidence", "Cybersecurity regulations"],
    },
    {
      id: "miscellaneous",
      name: "Miscellaneous",
      icon: <FileQuestion />,
      description: "Various IT topics that don't fit into other categories, including emerging technologies.",
      features: ["AI ethics", "Blockchain", "Digital transformation"],
    },
    {
      id: "it-contract",
      name: "IT Contract",
      icon: <FileText />,
      description: "Questions about technology agreements, service contracts, and licensing.",
      features: ["SLAs", "Licensing terms", "Contract compliance"],
    },
    {
      id: "intellectual-property",
      name: "Intellectual Property",
      icon: <Copyright />,
      description: "Test your knowledge of patents, copyrights, and digital IP protection.",
      features: ["Software patents", "Copyright laws", "IP infringement"],
    },
    {
      id: "organizations",
      name: "Organizations",
      icon: <Building />,
      description: "Questions about IT governance, standards bodies, and regulatory organizations.",
      features: ["ISO standards", "Industry consortiums", "Regulatory bodies"],
    },
  ]

  return (
    <div className="category-page">
      <div className="category-header">
        <h1>Select Quiz Category</h1>
        <p>Choose a category to test your knowledge in specific IT and data protection areas</p>
      </div>

      <div className="category-grid">
        {categories.map((category) => (
          <div className="category-card" key={category.id} data-category={category.id}>
            <div className="category-card-inner">
              <div className="category-card-header">
                <div className="category-icon">{category.icon}</div>
                <h2>{category.name}</h2>
                <span className="category-badge">Quiz</span>
              </div>
              <div className="category-card-content">
                <p className="category-description">{category.description}</p>
                <ul className="category-features">
                  {category.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <button className="category-button" onClick={() => handleCategorySelect(category.id)}>
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryPage

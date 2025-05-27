import { useState } from "react"
import AddArticleButton from "./AddArticleButton"
import ProfileIcon from "./ProfileIcon"
import "./ArticleSection.css"

const mockArticles = [
  {
    id: 1,
    title: "The Rise of AI-Powered Cybersecurity",
    category: "Cybersecurity",
    summary: "Exploring how artificial intelligence is revolutionizing cybersecurity defenses.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-1OcmoYuFj1XEaLk8UZASp9gGC9dO1Y.png",
  },
  {
    id: 2,
    title: "Quantum Computing Breakthroughs",
    category: "Quantum",
    summary: "Latest developments in quantum computing and their implications.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-TCyyCuELT0pBRVSmQ4FHQUxCVL1wKl.png",
  },
]

export default function ArticlesSection() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [newArticle, setNewArticle] = useState({
    title: "",
    category: "",
    summary: "",
    image: null,
  })

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewArticle((prev) => ({ ...prev, image: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    setShowAddModal(false)
    setNewArticle({ title: "", category: "", summary: "", image: null })
  }

  return (
    <section className="articles-section">
      <div className="section-header">
        <h2>Featured Articles</h2>
        <div className="header-actions">
          <AddArticleButton onClick={() => setShowAddModal(true)} />
          <ProfileIcon />
        </div>
      </div>

      <div className="articles-grid">
        {mockArticles.map((article) => (
          <div className="article-card" key={article.id}>
            <div className="article-image">
              <img src={article.image || "/placeholder.svg"} alt={article.title} />
              <div className="category-tag">{article.category}</div>
            </div>
            <div className="article-content">
              <h3>{article.title}</h3>
              <p>{article.summary}</p>
              <button className="read-more-btn">Read More</button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setShowAddModal(false)}>
              ×
            </button>
            <h3>Add New Article</h3>
            <form onSubmit={handleSubmit} className="add-article-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newArticle.title}
                  onChange={(e) => setNewArticle((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter article title"
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={newArticle.category}
                  onChange={(e) => setNewArticle((prev) => ({ ...prev, category: e.target.value }))}
                  placeholder="Enter article category"
                  required
                />
              </div>
              <div className="form-group">
                <label>Summary</label>
                <textarea
                  value={newArticle.summary}
                  onChange={(e) => setNewArticle((prev) => ({ ...prev, summary: e.target.value }))}
                  placeholder="Enter article summary"
                  required
                />
              </div>
              <div className="form-group">
                <label>Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} required />
              </div>
              <button type="submit" className="submit-btn">
                Add Article
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}


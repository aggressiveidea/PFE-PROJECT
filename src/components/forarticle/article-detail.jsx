"use client";

import { useState } from "react";
import "./cosmic-article-detail.css";
import "./related-article-card1.css";

// Sample data for preview
const sampleArticle = {
  id: "1",
  title: "Understanding the Future of Artificial Intelligence in Cybersecurity",
  category: "Cybersecurity",
  description:
    "Artificial Intelligence is revolutionizing how we approach cybersecurity challenges. This article explores the latest trends and future implications.",
  content: `<p>Artificial Intelligence (AI) has become an integral part of modern cybersecurity strategies. As cyber threats grow in sophistication, traditional security measures are no longer sufficient to protect sensitive data and systems.</p>
  
  <h2>The Role of AI in Threat Detection</h2>
  <p>AI systems can analyze patterns and identify anomalies that might indicate a security breach much faster than human analysts. Machine learning algorithms can be trained to recognize the signatures of known attacks and to detect unusual behaviors that might signal a new type of threat.</p>
  
  <p>Deep learning networks, a subset of machine learning, are particularly effective at processing and analyzing large volumes of data from multiple sources. This capability is crucial in cybersecurity, where threats can come from various vectors simultaneously.</p>
  
  <h2>Predictive Security Measures</h2>
  <p>One of the most promising applications of AI in cybersecurity is its ability to predict potential vulnerabilities before they are exploited. By analyzing historical data and current system configurations, AI can identify weak points that might be targeted by attackers.</p>
  
  <p>This proactive approach allows organizations to patch vulnerabilities and strengthen defenses before an attack occurs, significantly reducing the risk of a successful breach.</p>
  
  <h3>Challenges and Limitations</h3>
  <p>Despite its potential, AI is not a silver bullet for cybersecurity. AI systems can be fooled by adversarial attacks specifically designed to manipulate their algorithms. Additionally, AI requires high-quality data for training, and biased or incomplete data can lead to ineffective security measures.</p>
  
  <p>Furthermore, as AI becomes more prevalent in cybersecurity, attackers are also adopting AI techniques to develop more sophisticated threats. This arms race between defensive and offensive AI presents a significant challenge for security professionals.</p>`,
  createdAt: "2023-04-15T10:30:00Z",
};

// Sample related articles
const sampleRelatedArticles = [
  {
    id: "2",
    title: "The Rise of Quantum Computing in Cryptography",
    category: "Cybersecurity",
    description:
      "How quantum computing is changing the landscape of cryptographic security.",
  },
  {
    id: "3",
    title: "Blockchain Technology and Data Protection",
    category: "Cybersecurity",
    description:
      "Exploring how blockchain can enhance data security and privacy.",
  },
  {
    id: "4",
    title: "Social Engineering: The Human Element of Cybersecurity",
    category: "Cybersecurity",
    description:
      "Understanding how attackers exploit human psychology to breach security systems.",
  },
];

// Sample comments
const sampleComments = [
  {
    id: 1,
    userName: "TechExpert",
    text: "Great article! I particularly appreciate the section on predictive security measures. It's becoming increasingly important for organizations to adopt proactive approaches.",
    date: "2023-04-16T14:22:00Z",
  },
  {
    id: 2,
    userName: "SecurityAnalyst",
    text: "I'd add that the integration of AI with human expertise is crucial. AI can process vast amounts of data, but human intuition and experience are still invaluable in interpreting results and making strategic decisions.",
    date: "2023-04-17T09:15:00Z",
  },
];

// Category colors mapping
const categoryColors = {
  "Contrats informatiques": { bg: "bg-blue-100", text: "text-blue-600" },
  "Criminalité informatique": { bg: "bg-purple-100", text: "text-purple-600" },
  "Données personnelles": { bg: "bg-green-100", text: "text-green-600" },
  Organisations: { bg: "bg-pink-100", text: "text-pink-600" },
  "Propriété intellectuelle": { bg: "bg-orange-100", text: "text-orange-600" },
  Réseaux: { bg: "bg-indigo-100", text: "text-indigo-600" },
  "Commerce électronique": { bg: "bg-yellow-100", text: "text-yellow-600" },
  Cybersecurity: { bg: "bg-yellow-100", text: "text-yellow-600" },
};

// Related Article Card Component
const RelatedArticleCard = ({ article }) => {
  return (
    <div className="cosmic-related-card">
      <div className="cosmic-related-image">
        <img src="/placeholder.svg?height=180&width=300" alt={article.title} />
      </div>
      <div className="cosmic-related-content">
        <span
          className={`cosmic-related-category ${
            categoryColors[article.category]?.bg
          } ${categoryColors[article.category]?.text}`}
        >
          {article.category}
        </span>
        <h3 className="cosmic-related-title">{article.title}</h3>
      </div>
    </div>
  );
};

const ArticleDetail = () => {
  const [article] = useState(sampleArticle);
  const [relatedArticles] = useState(sampleRelatedArticles);
  const [isFavorite, setIsFavorite] = useState(false);
  const [comments, setComments] = useState(sampleComments);
  const [newComment, setNewComment] = useState("");
  const [userName, setUserName] = useState("");

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    console.log("Share button clicked");
    alert("Share functionality would open here");
  };

  const handleAddToLibrary = () => {
    console.log("Add to library button clicked");
    alert("Article added to your library!");
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !userName.trim()) return;

    const comment = {
      id: Date.now(),
      userName: userName,
      text: newComment,
      date: new Date().toISOString(),
    };

    setComments([...comments, comment]);
    setNewComment("");
  };

  const handleBackClick = () => {
    console.log("Back button clicked");
    alert("This would navigate back to articles list");
  };

  return (
    <div className="cosmic-article-container">
      <div className="cosmic-stars-container">
        <div className="cosmic-stars"></div>
        <div className="cosmic-stars2"></div>
        <div className="cosmic-stars3"></div>
      </div>

      <div className="cosmic-planet cosmic-planet1"></div>
      <div className="cosmic-planet cosmic-planet2"></div>
      <div className="cosmic-shooting-star"></div>
      <div className="cosmic-shooting-star cosmic-shooting-star2"></div>
      <div className="cosmic-comet"></div>

      <div className="cosmic-article-content">
        <div className="cosmic-navigation">
          <button className="cosmic-back-button" onClick={handleBackClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Articles
          </button>
        </div>

        <div className="cosmic-category-tag">
          <span
            className={`${categoryColors[article.category]?.bg} ${
              categoryColors[article.category]?.text
            }`}
          >
            {article.category}
          </span>
        </div>

        <h1 className="cosmic-article-title">{article.title}</h1>

        <div className="cosmic-image-container">
          <img
            src="/placeholder.svg?height=400&width=900"
            alt={article.title}
            className="cosmic-article-image"
          />
        </div>

        <div className="cosmic-article-body">
          <p className="cosmic-article-summary">{article.description}</p>

          <div
            className="cosmic-article-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          ></div>
        </div>

        <div className="cosmic-article-actions">
          <button
            className={`cosmic-action-button cosmic-favorite-button ${
              isFavorite ? "active" : ""
            }`}
            onClick={toggleFavorite}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span>Favorite</span>
          </button>

          <button
            className="cosmic-action-button cosmic-share-button"
            onClick={handleShare}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
            <span>Share</span>
          </button>

          <button
            className="cosmic-action-button cosmic-library-button"
            onClick={handleAddToLibrary}
          >
            <span>Add to Library</span>
          </button>
        </div>

        {/* Comment Section */}
        <div className="cosmic-comments-section">
          <h2 className="cosmic-comments-title">Comments</h2>

          <div className="cosmic-comments-list">
            {comments.length === 0 ? (
              <p className="cosmic-no-comments">
                Be the first to comment on this article!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="cosmic-comment">
                  <div className="cosmic-comment-header">
                    <div className="cosmic-comment-avatar">
                      {comment.userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="cosmic-comment-info">
                      <h4 className="cosmic-comment-author">
                        {comment.userName}
                      </h4>
                      <span className="cosmic-comment-date">
                        {new Date(comment.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="cosmic-comment-text">{comment.text}</p>
                </div>
              ))
            )}
          </div>

          <div className="cosmic-comment-form">
            <h3 className="cosmic-form-title">Add a Comment</h3>
            <div className="cosmic-form-group">
              <input
                type="text"
                className="cosmic-input"
                placeholder="Your Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="cosmic-form-group">
              <textarea
                className="cosmic-textarea"
                placeholder="Write your comment here..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
              ></textarea>
            </div>
            <button
              className="cosmic-submit-button"
              onClick={handleAddComment}
              disabled={!newComment.trim() || !userName.trim()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              Post Comment
            </button>
          </div>
        </div>

        {relatedArticles.length > 0 && (
          <div className="cosmic-related-section">
            <h2 className="cosmic-related-title">You May Also Like</h2>
            <div className="cosmic-related-grid">
              {relatedArticles.map((relatedArticle) => (
                <RelatedArticleCard
                  key={relatedArticle.id}
                  article={relatedArticle}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleDetail;

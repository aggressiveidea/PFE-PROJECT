import React from "react";
import "./SuggestTopic.css";

const suggestions = [
  "GDPR compliance for AI systems",
  "Blockchain in legal document verification",
  "5G technology regulations",
  "Cloud computing data sovereignty",
];

const SuggestTopic = () => {
  return (
    <section className="suggest-topic-section">
      <div className="suggest-form">
        <input type="text" placeholder="Suggest a topic title" />
        <select>
          <option>Select a category (optional)</option>
          <option>AI</option>
          <option>Blockchain</option>
          <option>Cyberlaw</option>
        </select>
        <textarea placeholder="What would you like to learn about this topic?" />
        <button>🚀 Submit Suggestion</button>
      </div>
      <div className="suggested-topics">
        <h3>💡 Most Suggested Topics</h3>
        <ul>
          {suggestions.map((topic, idx) => (
            <li key={idx}>🔹 {topic}</li>
          ))}
        </ul>
        <p className="note">
          These topics are frequently requested by our community. Click on any
          suggestion to use it in your form.
        </p>
      </div>
    </section>
  );
};

export default SuggestTopic;

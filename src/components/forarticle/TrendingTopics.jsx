import React from "react";
import "./TrendingTopics.css";

const TrendingTopics = () => {
  const topics = [
    {
      tag: "Security",
      color: "#fda4af",
      title: "Zero Trust Security Models for Remote Work",
    },
    {
      tag: "Quantum",
      color: "#d8b4fe",
      title: "Quantum Computing: Practical Legal Challenges",
    },
    {
      tag: "Legal",
      color: "#a5f3fc",
      title: "GDPR Compliance: Latest Updates for 2025",
    },
  ];

  return (
    <section className="trending-section">
      <div className="trending-header">
        <h2>Trending Topics</h2>
        <p>Stay updated with the hottest ICT law discussions</p>
      </div>

      <div className="trending-content">
        {/* Left Featured Topic */}
        <div className="featured-topic">
          <div className="featured-image">
            <div className="featured-badge">
              <span className="tag">IoT</span>
              <span className="trend">📈 +156% this week</span>
            </div>
            <h3>The Rise of Edge Computing in IoT Applications</h3>
          </div>
        </div>

        {/* Right Sidebar Topics */}
        <div className="sidebar-topics">
          {topics.map((topic, index) => (
            <div className="sidebar-topic" key={index}>
              <div className="sidebar-img-placeholder" />
              <div className="sidebar-text">
                <span
                  className="topic-tag"
                  style={{ backgroundColor: topic.color }}
                >
                  {topic.tag}
                </span>
                <p>{topic.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingTopics;

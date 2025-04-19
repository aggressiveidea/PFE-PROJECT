import React from "react";
import "./TrendingTopics.css";
import sampleImage from "../../assets/4da4441108a5238b1d18206cac2ebbe8.jpg";
import Image from "../../assets/7464e3b2a9599cab8f6cef02f6c4ac50.jpg"; // Import the image you want for the big div

const TrendingTopics = () => {
  const topics = [
    {
      tag: "Security",
      color: "#fda4af",
      title: "Zero Trust Security Models for Remote Work",
      image: sampleImage, // Use the imported image for sidebar topics
    },
    {
      tag: "Quantum",
      color: "#d8b4fe",
      title: "Quantum Computing: Practical Legal Challenges",
      image: sampleImage,
    },
    {
      tag: "Legal",
      color: "#a5f3fc",
      title: "GDPR Compliance: Latest Updates for 2025",
      image: sampleImage,
    },
  ];

  const handleTopicClick = async (topic) => {
    console.log("Fetching data for topic:", topic);
    await new Promise((res) => setTimeout(res, 500));
    alert(`You clicked on "${topic.title}" — query DB for: ${topic.tag}`);
  };

  return (
    <section className="trending-section">
      <div className="trending-header">
        <h2>Trending Topics</h2>
        <p>Stay updated with the hottest ICT law discussions</p>
      </div>

      <div className="trending-content">
        {/* Left Featured Topic */}
        <div className="featured-topic">
          <div
            className="featured-image"
            onClick={() =>
              handleTopicClick({
                tag: "IoT",
                title: "The Rise of Edge Computing in IoT Applications",
              })
            }
          >
            {/* Use Image component here */}
            <img src={Image} alt="Featured Topic" />
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
            <div
              className="sidebar-topic"
              key={index}
              onClick={() => handleTopicClick(topic)}
              style={{ cursor: "pointer" }}
            >
              <div className="sidebar-img">
                <img src={topic.image} alt={topic.tag} />
              </div>
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

import React from "react";
import FeatureCard from "./FeaturesCard";
import image1 from "../../assets/Prototyping process-pana 1.png";
import image2 from "../../assets/Add User-rafiki 1.png";
import image3 from "../../assets/Search engines-bro 1.png";
import './HeroSection.css'
const FeaturesSection = () => {
  const features = [
    {
      title: "Create Your Account",
      image: image1,
      description:
        "Wanna have all functionalities? Just create an account and enjoy your journey.",
    },
    {
      title: "Customize Your Profile",
      image: image2,
      description:
        "You can also customize your profile the way you want to make your experience more interactive.",
    },
    {
      title: "Start Searching",
      image: image3,
      description:
        "Use different methods to search and get the term's definition you want.",
    },
  ];

  return (
    <div className="features-container">
      {features.map((feature, index) => (
        <FeatureCard
          key = {index}
          title={feature.title}
          image={feature.image}
          description={feature.description}
        />
      ))}
    </div>
  );
};

export default FeaturesSection;

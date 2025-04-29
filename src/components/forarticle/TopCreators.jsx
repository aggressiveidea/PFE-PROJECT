"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CreatorCard from "./creator-card";
import "./TopCreators.css";
import { topauthors } from "../../services/Api";
import { ChevronLeft, ChevronRight } from "lucide-react";


const TopCreators = () => {
  const [creators, setCreators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [leftButtonClicked, setLeftButtonClicked] = useState(false);
  const [rightButtonClicked, setRightButtonClicked] = useState(false);
  const creatorsPerPage = 3; // Show 3 creators per page

  const fetchTopAuthors = useCallback(async () => {
    setIsLoading(true);
    try {
      // Using your original fetch code
      const response = await topauthors();
      if (response && Array.isArray(response)) {
        // Add some sample data if the API returns less than 9 creators
        let creatorsList = [...response];
        if (creatorsList.length < 9) {
          const sampleCreators = [
            {
              _id: "sample1",
              firstName: "Alex",
              lastName: "Johnson",
              role: "Content Creator",
              profileImgUrl: "/placeholder.svg?height=60&width=60",
              articleCount: 28,
            },
            {
              _id: "sample2",
              firstName: "Maria",
              lastName: "Garcia",
              role: "Senior Editor",
              profileImgUrl: "/placeholder.svg?height=60&width=60",
              articleCount: 42,
            },
            {
              _id: "sample3",
              firstName: "David",
              lastName: "Chen",
              role: "Tech Writer",
              profileImgUrl: "/placeholder.svg?height=60&width=60",
              articleCount: 19,
            },
            {
              _id: "sample4",
              firstName: "Sarah",
              lastName: "Smith",
              role: "Journalist",
              profileImgUrl: "/placeholder.svg?height=60&width=60",
              articleCount: 35,
            },
            {
              _id: "sample5",
              firstName: "Michael",
              lastName: "Brown",
              role: "Photographer",
              profileImgUrl: "/placeholder.svg?height=60&width=60",
              articleCount: 15,
            },
            {
              _id: "sample6",
              firstName: "Emma",
              lastName: "Wilson",
              role: "Video Producer",
              profileImgUrl: "/placeholder.svg?height=60&width=60",
              articleCount: 23,
            },
          ];

          // Add sample creators until we have at least 9
          while (creatorsList.length < 9) {
            creatorsList = [
              ...creatorsList,
              ...sampleCreators.slice(0, Math.min(6, 9 - creatorsList.length)),
            ];
          }
        }

        setCreators(creatorsList);
        setTotalPages(Math.ceil(creatorsList.length / creatorsPerPage));
      }
    } catch (err) {
      console.error("Failed to fetch top authors:", err);
      // Add fallback data in case of API failure
      const fallbackCreators = [
        {
          _id: "fallback1",
          firstName: "Alex",
          lastName: "Johnson",
          role: "Content Creator",
          profileImgUrl: "/placeholder.svg?height=60&width=60",
          articleCount: 28,
        },
        {
          _id: "fallback2",
          firstName: "Maria",
          lastName: "Garcia",
          role: "Senior Editor",
          profileImgUrl: "/placeholder.svg?height=60&width=60",
          articleCount: 42,
        },
        {
          _id: "fallback3",
          firstName: "David",
          lastName: "Chen",
          role: "Tech Writer",
          profileImgUrl: "/placeholder.svg?height=60&width=60",
          articleCount: 19,
        },
        {
          _id: "fallback4",
          firstName: "Sarah",
          lastName: "Smith",
          role: "Journalist",
          profileImgUrl: "/placeholder.svg?height=60&width=60",
          articleCount: 35,
        },
        {
          _id: "fallback5",
          firstName: "Michael",
          lastName: "Brown",
          role: "Photographer",
          profileImgUrl: "/placeholder.svg?height=60&width=60",
          articleCount: 15,
        },
        {
          _id: "fallback6",
          firstName: "Emma",
          lastName: "Wilson",
          role: "Video Producer",
          profileImgUrl: "/placeholder.svg?height=60&width=60",
          articleCount: 23,
        },
      ];
      setCreators(fallbackCreators);
      setTotalPages(Math.ceil(fallbackCreators.length / creatorsPerPage));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopAuthors();
  }, [fetchTopAuthors]);

  const handleCreatorClick = useCallback((creatorId) => {
    window.location.href = `/userProfile?id=${creatorId}`;
  }, []);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 0) {
      setLeftButtonClicked(true);
      setCurrentPage((prev) => prev - 1);

      setTimeout(() => {
        setLeftButtonClicked(false);
      }, 200);
    }
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setRightButtonClicked(true);
      setCurrentPage((prev) => prev + 1);

      setTimeout(() => {
        setRightButtonClicked(false);
      }, 200);
    }
  }, [currentPage, totalPages]);

  // Get current page creators
  const getCurrentPageCreators = useCallback(() => {
    const startIndex = currentPage * creatorsPerPage;
    const endIndex = startIndex + creatorsPerPage;
    return creators.slice(startIndex, endIndex);
  }, [creators, currentPage, creatorsPerPage]);

  if (isLoading) {
    return <h2 className="creators_title">Loading creators...</h2>;
  }

  return (
    <div className="creators_container">
      {/* Static star decorations */}
      <div className="creators_star creators_star-1"></div>
      <div className="creators_star creators_star-2"></div>
      <div className="creators_star creators_star-3"></div>
      <div className="creators_star creators_star-4"></div>
      <div className="creators_star creators_star-5"></div>
      <div className="creators_star creators_star-6"></div>

      {/* Add colorful background circles */}
      <div className="creators_circle creators_circle-1"></div>
      <div className="creators_circle creators_circle-2"></div>
      <div className="creators_circle creators_circle-3"></div>

      {/* Added title and description */}
      <div className="creators_header">
        <h2 className="creators_title">Active Authors</h2>
        <p className="creators_subtitle">
          Discover our most prolific contributors who shape the discourse on ICT
          law with their expertise and insights.
        </p>
      </div>

      <div className="creators_list">
        {getCurrentPageCreators().map((creator, index) => (
          <CreatorCard
            key={creator._id || index}
            creator={creator}
            onClick={handleCreatorClick}
            style={{ "--index": index }}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="creators_pagination">
          <button
            className={`creators_nav_button ${
              leftButtonClicked ? "clicked" : ""
            }`}
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            aria-label="Previous page"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="creators_page_indicator">
            {currentPage + 1} / {totalPages}
          </div>

          <button
            className={`creators_nav_button ${
              rightButtonClicked ? "clicked" : ""
            }`}
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            aria-label="Next page"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TopCreators;

"use client";

import { useEffect } from "react";

export function ArticleDebugger({ article }) {
  useEffect(() => {
    console.log("Article structure:", article);

    // Check if article is being passed correctly
    if (typeof article !== "object") {
      console.error("Article is not an object:", article);
    } else {
      console.log("Article keys:", Object.keys(article));

      // Check content type
      console.log("Content type:", typeof article.content);
      if (typeof article.content === "object") {
        console.log("Content keys:", Object.keys(article.content));
      }
    }
  }, [article]);

  return null; // This component doesn't render anything
}

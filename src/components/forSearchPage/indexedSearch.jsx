import React, { useState } from "react";
import { Button, Stack, IconButton, useMediaQuery } from "@mui/material";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function AlphabetPagination() {
  const isMobile = useMediaQuery("(max-width:600px)");
  const ITEMS_PER_PAGE = isMobile ? 4 : 7; 

  const [startIndex, setStartIndex] = useState(0);

  const handleNext = () => {
    if (startIndex + ITEMS_PER_PAGE < letters.length) {
      setStartIndex(startIndex + ITEMS_PER_PAGE);
    }
  };

  const handlePrevious = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - ITEMS_PER_PAGE);
    }
  };

  return (
    <Stack 
      direction="row"
      spacing={1}
      justifyContent="center"
      alignItems="center"
      sx={{
        flexWrap: "nowrap",
        overflowX: "auto",
        padding: "8px",
      }}
    >
      <IconButton
        onClick={handlePrevious}
        disabled={startIndex === 0}
        sx={{ 
          color: "#4C56C8", 
          fontSize: isMobile ? "18px" : "24px",
          "&:disabled": { opacity: 0.3 } 
        }}
      >
        {"<"}
      </IconButton>
      {letters.slice(startIndex, startIndex + ITEMS_PER_PAGE).map((letter) => (
        <Button
          key={letter}
          variant="outlined"
          sx={{
            minWidth: isMobile ? "30px" : "40px",
            fontSize: isMobile ? "12px" : "16px",
            padding: isMobile ? "5px" : "8px",
            color: "#4C56C8",
            borderColor: "#4C56C8",
            "&:hover": { backgroundColor: "#4C56C8", color: "#fff" },
          }}
        >
          {letter}
        </Button>
      ))}

      <IconButton
        onClick={handleNext}
        disabled={startIndex + ITEMS_PER_PAGE >= letters.length}
        sx={{ 
          color: "#4C56C8", 
          fontSize: isMobile ? "18px" : "24px",
          "&:disabled": { opacity: 0.3 } 
        }}
      >
        {">"}
      </IconButton>
    </Stack>
  );
}

export default AlphabetPagination;



import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function SearchInput() {
  return (
    <div className="searchBar">
      <input className="Search" placeholder="Hinted search text" />
      <span className="searchIcon">
        <FontAwesomeIcon icon={faSearch} />
      </span>
    </div>
  );
}

export default SearchInput;

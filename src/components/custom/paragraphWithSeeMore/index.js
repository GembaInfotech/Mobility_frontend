import React, { useState } from "react";

const ParagraphWithSeeMore = ({ text, maxChars }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded((prev) => !prev);
  };

  const displayText = isExpanded ? text : text.slice(0, maxChars);

  return (
    <div>
      <p>
        {displayText}
        {!isExpanded && text.length > maxChars && "..."}
      </p>
      {text.length > maxChars && (
        <button onClick={toggleExpansion}>
          {isExpanded ? (
            <div className="font-bold	">See Less</div>
          ) : (
            <div className="font-bold	">See More</div>
          )}
        </button>
      )}
    </div>
  );
};

export default ParagraphWithSeeMore;

import React from "react";
import "../../componentCss/common/pagination.css";

const Pagination = (props) => {
  const { totalNewsBoxes, currentPageSize } = props;
  const NumberOfPagesRequired = Math.ceil(totalNewsBoxes / currentPageSize);
  if (NumberOfPagesRequired === 1) {
    return null;
  }
  const paginationArray = Array.from(Array(NumberOfPagesRequired + 1).keys());
  paginationArray.splice(0, 1);

  return (
    <React.Fragment>
      <div className="mainPaginationContainer">
      <nav className="paginationContainer">
        <ul className="pagination">
          {paginationArray.map((pageNumber) => (
            <li
              key={pageNumber}
              className={
                pageNumber === props.currentPage ? "pageItemActive" : "pageItem"
              }
            >
              <a
                className="pageLink"
                onClick={() => {
                  props.onPageChange(pageNumber);
                }}
              >
                {pageNumber}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      </div>
    </React.Fragment>
  );
};

export default Pagination;

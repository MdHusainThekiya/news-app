import "../componentCss/newsContainer.css";
import React, { Component } from "react";
import NewsBox from "./newsBox";
import Pagination from "./common/pagination";
import PaginationLogic from "./utils/paginationLogic";

class NewsContainer extends Component {
  state = {
    currentPage: 1,
    newsBoxInContainer: 20,
  };

  compare(first, second) {
    let a = first.publishedAt;
    let b = second.publishedAt;
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  }

  handlePageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  render() {
    const PaginatedArrayOfArticles = PaginationLogic(
      this.props.articleData,
      this.state.currentPage,
      this.state.newsBoxInContainer
    );

    return (
      <React.Fragment>
        <div className="paginationNav">
          <Pagination
            totalNewsBoxes={this.props.articleData.length}
            currentPageSize={this.state.newsBoxInContainer}
            onPageChange={this.handlePageChange}
            currentPage={this.state.currentPage}
          />
        </div>
        <div className="newsContainer">
          {PaginatedArrayOfArticles.map((article) => (
            <NewsBox
              key={article._id}
              article={article}
              ReadMoreEvent={this.props.ReadMoreEventInApp}
            />
          ))}
        </div>
      </React.Fragment>
    );
  }
}

export default NewsContainer;

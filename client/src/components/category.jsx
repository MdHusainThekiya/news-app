import "../componentCss/category.css";
import React, { Component } from "react";
import NewsBox from "./newsBox";

class Category extends Component {
  state = {
    filteredArticlesByCategory: [],
    activeCategoryNavNumber: 1,
    activeCategoryTitle : 'science', // hardCoded Here  
  };

  onCategoryNavClick = (currentCategoryNavNumber) => {
    let clickedCategoryTitle = (this.props.categoryData[currentCategoryNavNumber - 1].title)
    this.setState({ activeCategoryNavNumber: currentCategoryNavNumber });
    this.setState({ activeCategoryTitle : clickedCategoryTitle })
  };
  
  render() {
    return (
      <div className="categoryContainer">
        <nav>
          {this.props.categoryData.map((category) => (
            <ul key={category._id}>
              <li
                className={
                  this.props.categoryData.indexOf(category) + 1 ===
                  this.state.activeCategoryNavNumber
                    ? "activeNavBar"
                    : ""
                }
                onClick={() =>
                  this.onCategoryNavClick(
                    this.props.categoryData.indexOf(category) + 1
                  )
                }
              >
                <a>{category.title}</a>
              </li>
            </ul>
          ))}
        </nav>
        <div className="newsContainer">
          {this.props.articleData.filter((article)=>(
            article.category.title === this.state.activeCategoryTitle
          ))
          .map((article)=>(
            <NewsBox
            key={article._id}
            article={article}
            ReadMoreEvent={this.props.ReadMoreEventInApp}
            />
          ))
          }
        </div>
      </div>
    );
  }
}

export default Category;

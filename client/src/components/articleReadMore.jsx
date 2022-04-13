import React, { Component } from "react";
import NewsBox from "./newsBox";
import "../componentCss/articleReadMore.css";

class ArticleReadMore extends Component {
  state = {};

  render() {
    return (
      <React.Fragment>
        <div className="article-container">
          <div className="all-articles">
            {this.props.articleData.map((article) => (
              <NewsBox
                key={article._id}
                article={article}
                ReadMoreEvent={this.props.ReadMoreEventInApp}
              />
            ))}
          </div>
          <div className="articleFromReadMore">
            <div className="title">{this.props.article.title}</div>
            <div className="description">{this.props.article.description}</div>
            <div className="publishDetails">
              <div>
                <label>Published At:</label>
                {this.props.article.publishedAt.split("T")[0]} <label>on Time:</label>
                {this.props.article.publishedAt.split("T")[1].split(".")[0]}
              </div>
              <div className="author">
                <label>Author :</label> {this.props.article.author}
              </div>
              <div>
                <label>SourceName and Url :</label>
                <a href={this.props.article.sourceUrl} target="_blank">
                  {this.props.article.sourceName}
                </a>
              </div>
            </div>
            <div className="image">
              <img
                src={this.props.article.imageUrl}
                alt={this.props.article.title}
              />
            </div>
            <div className="content">
              <span>&emsp; &emsp; &emsp;</span>
              {this.props.article.content}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ArticleReadMore;

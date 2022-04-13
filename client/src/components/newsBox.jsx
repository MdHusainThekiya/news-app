import "../componentCss/newsBox.css";
import React, { Component } from "react";
import { Link } from "react-router-dom";

class NewsBox extends Component {
  state = {};

  getTitle = () => {
    const title = this.props.article.title;
    return title;
  };
  getDiscription = () => {
    const description = this.props.article.description;
    return description + "...";
  };
  getImage = () => {
    const imageUrl = this.props.article.imageUrl;
    return imageUrl;
  };
  getUpdatedAtDate = () => {
    const updatedAt = this.props.article.updatedAt;
    return updatedAt.split("T")[0];
  };
  getUpdatedAtTime = () => {
    const updatedAt = this.props.article.updatedAt;
    return updatedAt.split("T")[1];
  };

  render() {
    return (
      <React.Fragment>
        <div className="box-container">
          <div className="box-image"> 
            <img src={this.getImage()} alt={this.getTitle()} />
          </div>
          <div className="box-content">
            <div className="box-title">{this.getTitle()}</div>
            <div className="box-discription">{this.getDiscription()}</div>
          </div>
          <div className="box-footer">
            <div className="dateTime">
              <div>
                Time:
                <br />
                Date:
              </div>
              {this.getUpdatedAtTime()}
              <br />
              {this.getUpdatedAtDate()}
            </div>
            <Link className="Link" to="/article">
              <button
                onClick={() => {
                  this.props.ReadMoreEvent(this.props.article);
                }}
              >
                Read-More
              </button>
            </Link>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default NewsBox;

import React, { Component } from "react";
import axios from "axios";
import { Navigate, Route, Routes } from "react-router-dom";
import HeaderNav from "./components/headerNav";
import ArticleReadMore from "./components/articleReadMore";
import Category from "./components/category";
import NewsContainer from "./components/newsContainerHome";
import LogInPage from "./components/logInPage";
import configData from "./config.json";
import "./App.css";
import AdminPanel from "./components/adminPanel";

// axios interceptor to handle expected & unexpected Error
// axios.interceptors.response.use(null, (error) => {
//   const expectedError =
//     error.response &&
//     error.response.status >= 400 &&
//     error.response.status < 500;
//   if (expectedError) {
//     // unexpected error i.e. server failure or invalid url
//     let expectedErrors = Object.values(error.response.data.status);
//     console.log("Expected Error =>", error.response);
//     if (error.response.data.status.length === 0) {
//       alert(`Expected Error => ${error.response.data.message}`);
//     } else {
//       alert(
//         `Expected Error => ${expectedErrors.map((data) => {
//           return data.message;
//         })},[${error.response.statusText}:${error.response.status}]`
//       );
//     }
//   } else {
//     console.log("Unexpected Error =>", error);
//     alert(`Unexpected Error => ${error.message}`);
//   }
//   return Promise.reject(error);
// });

class App extends Component {
  state = {
    articleData: [],
    categoryData: [],
    usersDataFromAdmin: [],
    articleFromReadMoreHandle: {},
    requiredNewsContainers: [],
  };

  handleUserDataFromAdmin = (userData) => {
    this.setState({ usersDataFromAdmin: userData });
  };

  compare = (a, b) => {
    if (a.updatedAt > b.updatedAt) {
      return -1;
    }
    if (a.updatedAt < b.updatedAt) {
      return 1;
    }
    return 0;
  };

  async componentDidMount() {
    try {
      const token = window.localStorage.getItem("token");
      const articles = await axios.get(configData.NEWS_ARTICLE_URL, {
        headers: {
          "Access-Control-Allow-Headers": "*",
          token: token,
        },
      });
      const categories = await axios.get(configData.NEWS_CATEGORY_URL, {
        headers: {
          "Access-Control-Allow-Headers": "*",
          token: token,
        },
      });
      let sortedArticleData = articles.data.status.sort(this.compare);
      let sortedCategoryData = categories.data.status.sort(this.compare);
      this.setState({ articleData: sortedArticleData });
      this.setState({ categoryData: sortedCategoryData });
    } catch (error) {
      if (error) {
        window.localStorage.removeItem("token");
        // alert(`Expected Error => ${error.response.data.message} <= [${error.response.statusText}:${error.response.status}]`);
      }
    }
  }

  readMoreHandle = (article) => {
    this.setState({ articleFromReadMoreHandle: article });
    let articleData = this.state.articleData;
    let index = articleData.indexOf(article);
    articleData.splice(index, 1);
    let topfour = articleData.slice(0, 4);
    this.setState({ requiredNewsContainers: topfour });
  };

  render() {
    return (
      <div className="container">
        <HeaderNav />
        <Routes>
          <Route
            path="/"
            element={
              window.localStorage.getItem("token") ? (
                <NewsContainer
                  articleData={this.state.articleData}
                  ReadMoreEventInApp={this.readMoreHandle}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
            exact
          />
          <Route
            path="/article"
            element={
              window.localStorage.getItem("token") ? (
                <ArticleReadMore
                  article={this.state.articleFromReadMoreHandle}
                  articleData={this.state.requiredNewsContainers}
                  ReadMoreEventInApp={this.readMoreHandle}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
            exact
          />
          <Route
            path="/category"
            element={
              window.localStorage.getItem("token") ? (
                <Category
                  articleData={this.state.articleData}
                  categoryData={this.state.categoryData}
                  ReadMoreEventInApp={this.readMoreHandle}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/admin"
            element={
              window.localStorage.getItem("token") ? (
                <AdminPanel
                  articleData={this.state.articleData}
                  categoryData={this.state.categoryData}
                  usersData={this.state.usersDataFromAdmin}
                  userDataEventInApp={this.handleUserDataFromAdmin}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/login"
            element={
              window.localStorage.getItem("token") ? (
                <Navigate to="/" />
              ) : (
                <LogInPage />
              )
            }
          />
        </Routes>
      </div>
    );
  }
}

export default App;

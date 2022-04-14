import "../componentCss/adminPanel.css";
import axios from "axios";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import IconButton from "@mui/material/IconButton";
import configData from "../config.json";
import DataEditByAdmin from "./common/dataEditByAdmin";
// import 'bootstrap/dist/css/bootstrap.css';
import jwt from "jwt-decode";
import React, { Component } from "react";
import { display } from "@mui/system";

class AdminPanel extends Component {
  state = {
    editButtonClick: false,
    dataPassedOnEditClick: {},
    usersData: [],
    isUserAdmin: false,
    refreshButtonRotation: false,
    usersDataFromApp: [],
    activeTableNavNumber: 1,
    tables: ["Articles", "categories", "Users"],
  };

  async componentDidMount() {
    try {
      const token = window.localStorage.getItem("token");
      const userData = await axios.get(configData.GETALL_USERS_URL, {
        headers: {
          "Access-Control-Allow-Headers": "*",
          token: token,
        },
      });
      let sortedUsersData = userData.data.status.sort(this.compare);
      this.setState({ usersData: sortedUsersData });
      this.props.userDataEventInApp(this.state.usersData);

      // verify JWT and filter user object to  get admin status
      const userEmail = await jwt(token).email;
      const isUserAdmin = await this.state.usersData.filter(
        (userObj) => userObj.email === userEmail
      )[0].isAdmin;
      this.setState({ isUserAdmin: isUserAdmin });
    } catch (error) {
      console.log(error.response);
      alert(
        `Expected Error => ${error.response.data.message} <= [${error.response.statusText}:${error.response.status}]`
      );
    }
  }

  handleEdit = (data) => {
    this.setState({ editButtonClick: true });
    this.setState({ dataPassedOnEditClick: data });
  };
  handleDelete = async (data) => {
    try {
      const token = window.localStorage.getItem("token");
      let currentRouter = "newsarticle";
      if (this.state.activeTableNavNumber === 2) {
        currentRouter = "newscategory";
      } else if (this.state.activeTableNavNumber === 3) {
        currentRouter = "signup";
      }
      const deleteData = await axios.delete(
        `${configData.ROOT_URL}${currentRouter}/${data._id}/`,
        {
          headers: {
            "Access-Control-Allow-Headers": "*",
            token: token,
          },
        }
      );
      alert(`${deleteData.data.message}`);
      return window.location.reload(true);
    } catch (error) {
      alert(
        `Expected Error => ${error.response.data.message} <= [${error.response.statusText}:${error.response.status}]`
      );
    }
  };

  onTableNavClick = (activeTableNavNumber) => {
    console.log(activeTableNavNumber, "1");
    console.log(this.state.activeTableNavNumber, "2");
    this.setState({ activeTableNavNumber });
  };

  refreshFeed = async () => {
    try {
      const token = window.localStorage.getItem("token");
      this.setState({ refreshButtonRotation: true });
      const refreshData = await axios.post(
        configData.REFRESH_NEWS_ARTICLE_URL,
        {},
        {
          headers: {
            "Access-Control-Allow-Headers": "*",
            token: token,
          },
        }
      );
      if (refreshData.data.status[0].length > 0) {
        window.location.assign("/");
      } else {
        alert("data not recieved from server : 400");
        return window.location.assign("/");
      }
    } catch (error) {
      alert(
        `Expected Error => ${error.response.data.message} <= [${error.response.statusText}:${error.response.status}]`
      );
    }
  };

  render() {
    setTimeout(() => {
      if (!this.state.isUserAdmin) {
        return window.location.assign("/");
      }
    }, 300);

    return (
      <div className="admin_container">
        <nav>
          <div className="nav">
            {this.state.tables.map((table) => (
              <ul>
                <li
                  className={
                    this.state.tables.indexOf(table) + 1 ===
                    this.state.activeTableNavNumber
                      ? "activeNavBar"
                      : ""
                  }
                  onClick={() =>
                    this.onTableNavClick(this.state.tables.indexOf(table) + 1)
                  }
                >
                  {table}
                </li>
              </ul>
            ))}
          </div>
          <a
            className={
              this.state.refreshButtonRotation
                ? "refreshButton refreshButtonRotation"
                : "refreshButton"
            }
            onClick={this.refreshFeed}
          >
            <IconButton>
              <CloudSyncIcon style={{ fontSize: 30 }} />
            </IconButton>
          </a>
        </nav>
        <table
          className="article_table"
          style={
            this.state.activeTableNavNumber === 1 ? {} : { display: "none" }
          }
        >
          <thead className="tableHead">
            <tr>
              <th>Sr.No</th>
              <th>image</th>
              <th>Article</th>
              <th>PublishedAt</th>
              <th>Author</th>
              {/* <th>Last UpdatedAt</th>
              <th>Last Updatedby</th> */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="tableBody">
            {this.props.articleData.map((article) => (
              <tr key={article._id}>
                <th>{this.props.articleData.indexOf(article) + 1}</th>
                <th>
                  <img src={article.imageUrl} alt={article._id} />
                </th>
                <th>
                  <div className="article">
                    <div className="title">{article.title}</div>
                    <div className="description">{article.description}</div>
                  </div>
                </th>
                <th>
                  <div>
                    {article.publishedAt.split("T")[0]}
                    <br />
                    {article.publishedAt.split("T")[1]}
                  </div>
                </th>
                <th>
                  <div>{article.author}</div>
                </th>
                {/* <th>
                  <div>
                  {article.updatedAt.split("T")[0]}<br/>
                    {article.updatedAt.split("T")[1]}
                  </div>
                </th>
                <th>
                  <div>
                    {article.updatedBy}
                  </div>
                </th> */}
                <th>
                  <div className="action">
                    <button
                      className="editBtn"
                      onClick={() => {
                        this.handleEdit(article);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="deleteBtn"
                      onClick={() => {
                        this.handleDelete(article);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
        <table
          className="category_table"
          style={
            this.state.activeTableNavNumber === 2 ? {} : { display: "none" }
          }
        >
          <thead className="tableHead">
            <tr>
              <th>Sr.No</th>
              <th>categoryName</th>
              <th>Created At</th>
              <th>Created By</th>
              <th>Last Updated At</th>
              <th>Last Updated by</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody className="tableBody">
            {this.props.categoryData.map((category) => (
              <tr key={category._id}>
                <th>{this.props.categoryData.indexOf(category) + 1}</th>
                <th>
                  <div className="category">{category.title}</div>
                </th>
                <th>
                  <div>
                    {category.createdAt.split("T")[0]}
                    <br />
                    {category.createdAt.split("T")[1]}
                  </div>
                </th>
                <th>
                  <div>{category.createdBy}</div>
                </th>
                <th>
                  <div>
                    {category.updatedAt.split("T")[0]}
                    <br />
                    {category.updatedAt.split("T")[1]}
                  </div>
                </th>
                <th>
                  <div>{category.updatedBy}</div>
                </th>
                <th>
                  <div className="action">
                    <button
                      className="editBtn"
                      onClick={() => {
                        this.handleEdit(category);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="deleteBtn"
                      onClick={() => {
                        this.handleDelete(category);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
        <table
          className="users_table"
          style={
            this.state.activeTableNavNumber === 3 ? {} : { display: "none" }
          }
        >
          <thead className="tableHead">
            <tr>
              <th>Sr.No</th>
              <th>FirstName</th>
              <th>LastName</th>
              <th>Email</th>
              <th>isAdmin</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="tableBody">
            {this.props.usersData.map((user) => (
              <tr key={user._id}>
                <th>{this.props.usersData.indexOf(user) + 1}</th>
                <th>
                  <div className="firstName">{user.firstName}</div>
                </th>
                <th>
                  <div className="lastName">{user.lastName}</div>
                </th>
                <th>
                  <div className="email">{user.email}</div>
                </th>
                <th>
                  <div
                    className="isAdmin"
                    style={user.isAdmin ? { color: "green" } : { color: "red" }}
                  >
                    {String(user.isAdmin)}
                  </div>
                </th>
                <th>
                  <div className="action">
                    <button
                      className="editBtn"
                      onClick={() => {
                        this.handleEdit(user);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="deleteBtn"
                      onClick={() => {
                        this.handleDelete(user);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          className="editModel"
          style={this.state.editButtonClick ? { display: "flex" } : {}}
        >
          <div className="editContainer">
            <div className="editModelHeader">
              <div>
                <h2>Edit Panel</h2>
              </div>
              <div>
                <a
                  className="cancelButton"
                  onClick={() => {
                    this.setState({ editButtonClick: false });
                  }}
                >
                  <IconButton>
                    <CancelRoundedIcon style={{ fontSize: 30 }} />
                  </IconButton>
                </a>
              </div>
            </div>
            <div className="form">
              <DataEditByAdmin
                data={this.state.dataPassedOnEditClick}
                activeTableNavNumber={this.state.activeTableNavNumber}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminPanel;

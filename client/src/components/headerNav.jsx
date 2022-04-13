import "../componentCss/headerNav.css";
import PowerSettingsNewRoundedIcon from '@mui/icons-material/PowerSettingsNewRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import IconButton from "@mui/material/IconButton";
import React, { Component } from "react";
import { Link } from "react-router-dom";

class HeaderNav extends Component {
  state = {};

  handleLogOut = () => {
    window.localStorage.removeItem("token")
    window.location.reload(true)
  }

  render() {
    return (
      <React.Fragment>
        <div className="header-container">
          <div className="header-logo">News-App</div>
          <nav className="header-nav">
            <ul>
              <li>
                <a className="link" href="/">
                  Home
                </a>
              </li>
              <li>
                <a className="link" href ="/category">
                  Category
                </a>
              </li>
              <li>
                <a className="link" href="/login">
                  Register/LogIn
                </a>
              </li>
              <li>
                <a className="link" href="/admin">
                  AdminPanel
                </a>
              </li>
            </ul>
          </nav>
          <div className="header-searchBar">
            <input
              type="search"
              id="newsSearch"
              name="newsSearch"
              placeholder="Search the news..."
            />
            <button id="submit"><SearchRoundedIcon/></button>
          </div>
          <div className="logOut">
            <a onClick={this.handleLogOut}>
            <IconButton>
              <PowerSettingsNewRoundedIcon style={{ fontSize: 30 }} />
            </IconButton>
            </a>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default HeaderNav;

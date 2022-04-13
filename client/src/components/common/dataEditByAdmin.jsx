import React, { Component } from "react";
import axios from "axios";
import configData from "../../config.json";
import "../../componentCss/common/dataEditByAdmin.css";

class DataEditByAdmin extends Component {
  state = {
    keysNotRequired: [
      "_id",
      "createdBy",
      "updatedBy",
      "createdAt",
      "publishedAt",
      "updatedAt",
      "author",
    ],
    dataToBeEdited: {},
    selectUrlForEdit : [configData.NEWS_ARTICLE_URL, configData.NEWS_CATEGORY_URL, configData.GETALL_USERS_URL]
  };

  OnChangeHandle = () => {
    let keys = Object.keys(this.props.data);
    let inputDataFromEditForm = {};
    for (const keysNotReq of this.state.keysNotRequired) {
      let index = keys.indexOf(keysNotReq);
      if (index > -1) {
        keys.splice(index, 1);
      } else {
        continue;
      }
    }
    for (const key of keys) {
      let value = document.getElementById(`${key}`).value;
      // this.setState({dataToBeEdited : {[key]:value}})
      inputDataFromEditForm[key] = value;
    }
    this.setState({ dataToBeEdited: inputDataFromEditForm });
  };

  onSubmit = async () => {
    try {
      const token = window.localStorage.getItem("token");
      const editDataResponse = await axios.put(
        this.state.selectUrlForEdit[(this.props.activeTableNavNumber)-1] + `${this.props.data._id}`,
        this.state.dataToBeEdited,
        {
          headers: {
            "Access-Control-Allow-Headers": "*",
            token: token,
          },
        }
      );
      alert(`${editDataResponse.data.message}`);
      window.location.reload(true);
    } catch (error) {
      let expectedErrors = Object.values(error.response.data.status);
      alert(
        `Expected Error => ${expectedErrors.map((data) => {
          return data.message;
        })} <= [${error.response.statusText}:${error.response.status}]`
      );
    }
  };

  render() {
    let keys = Object.keys(this.props.data);
    for (const keysNotReq of this.state.keysNotRequired) {
      let index = keys.indexOf(keysNotReq);
      if (index > -1) {
        keys.splice(index, 1);
      } else {
        continue;
      }
    }

    return (
      <React.Fragment>
        <div className="dataEditForm">
          {keys.map((key) => (
            <ul key={key}>
              <li>
                <p>{key}</p>
                <textarea
                  onChange={this.OnChangeHandle}
                  rows="1"
                  type="text"
                  placeholder={key}
                  id={key}
                />
              </li>
            </ul>
          ))}
          <div className="submit">
            <button onClick={this.onSubmit}>Submit</button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default DataEditByAdmin;

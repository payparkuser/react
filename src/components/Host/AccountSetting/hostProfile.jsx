import React, { Component } from "react";
import { Link } from "react-router-dom";
import HostHelper from "../../Helper/hostHelper";
import { translate, t } from "react-multi-lang";

class HostProfile extends HostHelper {
  state = {
    data: {}
  };

  async componentDidMount() {
    await this.getHostDetails();
  }
  render() {
    const { data } = { ...this.state };
    return (
      <div className="main">
        <div className="site-content">
          <div className="top-bottom-spacing">
            <div className="media">
              <div>
                <img
                  src={data.picture}
                  alt={data.username}
                  className="user-pro-img"
                />
                <div className="panel top dis-xs-none dis-sm-none">
                  <div className="panel-heading">{t("verified_info")}</div>
                  <div className="panel-body p-3">
                    <ul className="verified-list">
                      <li>
                        {t("email_address")}{" "}
                        <span className="theme-green-clr">
                          <i className="far fa-check-circle float-right align-3" />
                        </span>
                      </li>
                      <li>
                        {t("phone_number")}{" "}
                        <span className="theme-green-clr">
                          <i className="far fa-check-circle float-right" />
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="media-body ml-4">
                <h1 className="profile-head">{t("hey")} {data.username}!</h1>
                <h4 className="profile-status top">
                  {t("india")}
                  <span className="dot pl-2 pr-2">
                    <i className="fas fa-circle" />
                  </span>
                  {data.created_at}
                </h4>
                <Link to={"/host/edit-profile"} className="edit-link mt-3">
                  {t("edit_profile")}
                </Link>

                <div className="profile-content">
                  <h5 className="top lh-1-4">{data.description}</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default translate(HostProfile);

import React, { Component } from "react";

import { Link } from "react-router-dom";
import Helper from "../../Helper/Helper";
import configuration from "react-global-configuration";
import { translate, t } from "react-multi-lang";

class RelativeHeader extends Helper {
    constructor(props) {
        super(props);
    }

    state = {
        categories: null,
        loadingCategory: true
    };

    componentDidMount() {
        // Call api function
        // this.getCategory();
    }

    render() {
        const { loadingCategory } = this.state;
        return (
            <div>
                <nav className="navbar navbar-expand-xl bg-light navbar-light white-header">
                    <Link
                        className="navbar-brand"
                        to={
                            localStorage.getItem("userLoginStatus")
                                ? "/search"
                                : "/"
                        }
                    >
                        <img
                            data-src={configuration.get("configData.site_logo")}
                            src={configuration.get("configData.site_logo")}
                        />
                    </Link>
                    {/* <SearchForm props={this.props.props} /> */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-toggle="collapse"
                        data-target="#collapsibleNavbar"
                    >
                        <i className="fas fa-chevron-down" />
                    </button>
                    <div
                        className="collapse navbar-collapse justify-content-end"
                        id="collapsibleNavbar"
                    >
                        <ul className="navbar-nav">
                            {/* <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to={"/host"}
                  id="navbardrop"
                  data-toggle="dropdown"
                >
                  {t("become_a_host")}
                </Link>
              </li> */}
                            <li className="nav-item dropdown">
                                <Link
                                    className="nav-link dropdown-toggle"
                                    to={"/wishlist"}
                                    id="navbardrop"
                                >
                                    {t("saved")}
                                </Link>
                            </li>
                            <li className="nav-item dropdown">
                                <Link
                                    to={"/history"}
                                    className="nav-link dropdown-toggle"
                                    id="navbardrop"
                                >
                                    {t("bookings")}
                                </Link>
                            </li>
                            <li className="nav-item dropdown">
                                <Link
                                    className="nav-link dropdown-toggle"
                                    to={"/inbox"}
                                    id="navbardrop"
                                >
                                    Inbox{" "}
                                    <span className="messages">
                                        <i className="fas fa-circle" />
                                    </span>
                                </Link>
                            </li>
                            {/* <li className="nav-item dropdown">
                <Link
                  to="#"
                  className="nav-link dropdown-toggle"
                  id="navbardrop"
                  data-toggle="dropdown"
                >
                  {t("credits")}
                </Link>
                <div className="dropdown-menu become-host">
                  <h5 className="captalize medium-cls">
                    Get $1,100 for every friend you invite to Sitename.{" "}
                    <Link to="#"> See terms.</Link>
                  </h5>
                  <Link to="#" className="green-btn-small top">
                    {t("credits")}
                  </Link>
                </div>
              </li> */}

                            <li className="nav-item dropdown">
                                <Link
                                    to="#"
                                    className="nav-link1 dropdown-toggle"
                                    id="navbardrop"
                                    data-toggle="dropdown"
                                >
                                    <img
                                        src={
                                            localStorage.getItem(
                                                "user_picture"
                                            ) === null
                                                ? "../assets/img/user-pic.png"
                                                : localStorage.getItem(
                                                      "user_picture"
                                                  )
                                        }
                                        className="profile-img"
                                    />
                                </Link>
                                <div className="dropdown-menu profile-drop">
                                    <Link to={"/edit-profile"} className="item">
                                        <div className="msg-head">
                                            <h5>{t("edit_profile")}</h5>
                                        </div>
                                    </Link>
                                    <Link to={"/notification"} className="item">
                                        <div className="msg-head">
                                            <h5>{t("account_settings")}</h5>
                                        </div>
                                    </Link>
                                    <Link to={"/logout"} className="item">
                                        <div className="msg-head">
                                            <h5>{t("logout")}</h5>
                                        </div>
                                    </Link>
                                </div>
                            </li>
                        </ul>
                    </div>
                </nav>

                <div className="fixed-top white-bg bb-1" id="second">
                    <nav className="navbar navbar-expand-sm bg-light navbar-light second-header site-content">
                        <ul className="navbar-nav left">
                            <li className="nav-item active">
                                <Link className="nav-link" to="#overview">
                                    {t("overview")}
                                    <span className="dot p-3">
                                        <i className="fas fa-circle" />
                                    </span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="#reviews">
                                    {t("reviews")}
                                    <span className="dot p-3">
                                        <i className="fas fa-circle" />
                                    </span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="#hosted">
                                    {t("the_host")}
                                    <span className="dot p-3">
                                        <i className="fas fa-circle" />
                                    </span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="#location">
                                    {t("location")}
                                </Link>
                            </li>
                        </ul>
                        <div className="collapse navbar-collapse justify-content-end dis-xs-none">
                            <ul className="navbar-nav right">
                                <li className="nav-item active">
                                    <Link to="#" className="nav-link">
                                        <span className="p-3">
                                            <i className="fas fa-share-square" />
                                        </span>{" "}
                                        {t("share")}
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="#" className="nav-link">
                                        <span className="p-3">
                                            <i className="far fa-heart" />
                                        </span>
                                        {t("save")}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
        );
    }
}

export default translate(RelativeHeader);

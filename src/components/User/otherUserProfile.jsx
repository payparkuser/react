import React, { Component } from "react";
import { Link } from "react-router-dom";
import Helper from "../Helper/Helper";
import { translate, t } from "react-multi-lang";

class OtherUserProfile extends Helper {
    state = {
        loading: true,
        data: null
    };

    componentDidMount() {
        this.getOtherUserProfile(this.props.match.params.id);
    }
    render() {
        const { loading, data } = this.state;
        return (
            <div className="main">
                <div className="site-content">
                    <div className="top-bottom-spacing">
                        {loading ? (
                            ""
                        ) : Object.keys(data).length > 0 ? (
                            <div className="media">
                                <div>
                                    <img
                                        src={data.picture}
                                        alt={data.username}
                                        className="user-pro-img"
                                    />
                                    <div className="panel top dis-xs-none dis-sm-none">
                                        <div className="panel-heading">
                                            {t("verified_info")}
                                        </div>
                                        <div className="panel-body p-3">
                                            <ul className="verified-list">
                                                <li>
                                                    {t("email_address")}{" "}
                                                    <span>
                                                        {data.is_verified ? (
                                                            <i className="far fa-check-circle theme-green-clr float-right align-3" />
                                                        ) : (
                                                            <i className="far fa-times-circle text-warning float-right align-3" />
                                                        )}
                                                    </span>
                                                </li>
                                                <li>
                                                    {t("phone_number")}
                                                    <span>
                                                        {data.mobile ? (
                                                            <i className="far fa-check-circle theme-green-clr float-right" />
                                                        ) : (
                                                            <i className="far fa-times-circle text-warning float-right" />
                                                        )}
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="media-body ml-4">
                                    <h1 className="profile-head">
                                        {t("hey")} {data.username}!
                                    </h1>
                                    <h4 className="profile-status top">
                                        {t("joined_in")} {data.joined}
                                    </h4>
                                    <h4>
                                        {data.total_reviews}{" "}
                                        {data.total_reviews <= 1
                                            ? t("review")
                                            : t("reviews")}
                                    </h4>

                                    <div className="profile-content">
                                        <h5 className="top lh-1-4">
                                            {data.description}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default translate(OtherUserProfile);

import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import { translate, t } from "react-multi-lang";

class HostProfileSideBar extends Component {
  constructor(props) {
    super(props);

    // States and props usage
  }
  state = {};

  render() {
    return (
      <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-3">
        <ul className="account-list">
          <li>
            <NavLink activeClassName="active" to={"/host/edit-profile"}>
              {t("edit_profile")}
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName="active" to={"/host/photo"}>
              {t("photos")}
            </NavLink>
          </li>
          <li>
            <NavLink
              activeClassName="active"
              to={"/host/document-verification"}
            >
              {t("document_verificaiton")}
            </NavLink>
          </li>

          <li>
            <NavLink activeClassName="active" to={"/host/payment"}>
              {t("payment_methods")}
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName="active" to={"/host/notification"}>
              {t("notifications")}
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName="active" to={"/host/change-password"}>
              {t("change_password")}
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName="active" to={"/host/review"}>
              {t("reviews")}
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName="active" to={"/host/delete-account"}>
              {t("delete_account")}
            </NavLink>
          </li>
        </ul>
        <Link
          to={"/host/profile"}
          className="grey-outline-btn w-100 bottom btn-small"
        >
          {t("view_profile")}
        </Link>
      </div>
    );
  }
}

export default translate(HostProfileSideBar);

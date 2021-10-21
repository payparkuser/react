import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import { translate, t } from "react-multi-lang";

class SideBar extends Component {
    state = {};
    render() {
        return (
            <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-3">
                <ul className="account-list">
                    <li>
                        <NavLink
                            activeClassName="active"
                            to={"/host/dashboard"}
                        >
                            {t("dashboard")}
                        </NavLink>
                    </li>
                    <li className="active">
                        <NavLink
                            activeClassName="active"
                            to={"/host/transaction-history"}
                        >
                            {t("transactions_history")}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            activeClassName="active"
                            to={"/host/subscriptions"}
                        >
                            {t("subscriptions")}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            activeClassName="active"
                            to={"/host/subscription-history"}
                        >
                            {t("subscription_history")}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            activeClassName="active"
                            to={"/host/booking-management"}
                        >
                            {t("booking_management")}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink activeClassName="active" to={"/host/spaces"}>
                            {t("space_management")}
                        </NavLink>
                    </li>
                </ul>
                <Link
                    to={"/host/edit-profile"}
                    className="grey-outline-btn w-100 bottom btn-small"
                >
                    {t("account_settings")}
                </Link>
            </div>
        );
    }
}

export default translate(SideBar);

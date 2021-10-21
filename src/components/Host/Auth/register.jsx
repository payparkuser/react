import React, { Component } from "react";
import { Link } from "react-router-dom";
import ToastDemo from "../../Helper/toaster";
import HostHelper from "../../Helper/hostHelper";
import { withToastManager } from "react-toast-notifications";
import api from "../../../HostEnvironment";
import { translate, t } from "react-multi-lang";

import configuration from "react-global-configuration";

var const_time_zone = Intl.DateTimeFormat().resolvedOptions().timeZone;

class HostRegister extends HostHelper {
    state = {
        data: {
            name: "",
            email: "",
            password: "",
            device_type: "web",
            device_token: "123466",
            login_by: "manual",
            agree: 0,
            timezone: const_time_zone
        },
        loadingContent: null,
        buttonDisable: false
    };
    handleSubmit = event => {
        event.preventDefault();
        const { path } = this.props.location;
        if (this.state.data.agree != 1) {
            this.setState({
                loadingContent: null,
                buttonDisable: false
            });
            ToastDemo(
                this.props.toastManager,
                "Please click the agree box",
                "error"
            );
        } else {
            this.setState({
                loadingContent: "Loading... Please wait..",
                buttonDisable: true
            });
            api.postMethod("register", this.state.data)
                .then(response => {
                    if (response.data.success === true) {
                        localStorage.setItem(
                            "hostId",
                            response.data.data.provider_id
                        );
                        localStorage.setItem(
                            "accessToken",
                            response.data.data.token
                        );
                        localStorage.setItem("hostLoginStatus", true);

                        window.location = path
                            ? path.from.pathname
                            : "/host/dashboard";
                        ToastDemo(
                            this.props.toastManager,
                            response.data.message,
                            "success"
                        );
                        this.setState({
                            loadingContent: null,
                            buttonDisable: false
                        });
                        // window.locatiom = path
                        //   ? this.props.history.push(path.from.pathname)
                        //   : this.props.history.push("/home");
                        // this.props.history.push("/home");
                    } else {
                        ToastDemo(
                            this.props.toastManager,
                            response.data.error,
                            "error"
                        );
                        this.setState({
                            loadingContent: null,
                            buttonDisable: false
                        });

                        if (
                            response.data.error_code == 1001 ||
                            response.data.error_code == 1001 ||
                            response.data.error_code == 1005 ||
                            response.data.error_code == 1006
                        ) {
                            window.locatiom = this.props.history.push(
                                "/host/login"
                            );
                        }
                    }
                })
                .catch(error => {
                    this.setState({
                        loadingContent: null,
                        buttonDisable: false
                    });
                });
        }
    };
    render() {
        const { data } = this.state;
        return (
            <div className="page-content">
                <div className="prov-login">
                    <h1 className=""> {t("register")} </h1>
                    <form
                        className="top1 prov-login-form"
                        onSubmit={this.handleSubmit}
                    >
                        <div className="form-group input-group">
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                placeholder={t("name")}
                                onChange={this.handleChange}
                                value={data.name}
                            />
                        </div>
                        <div className="form-group input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder={t("email_address")}
                                name="email"
                                onChange={this.handleChange}
                                value={data.email}
                            />
                        </div>
                        <div className="form-group input-group">
                            <input
                                type="password"
                                className="form-control"
                                placeholder={t("password")}
                                name="password"
                                onChange={this.handleChange}
                                value={data.password}
                            />
                        </div>
                        <div className="input-group">
                            <label className="text-none">
                                <input
                                    type="checkbox"
                                    name="agree"
                                    value="1"
                                    onChange={this.handleChange}
                                    className="signup_agree"
                                />{" "}
                                {t("i_agree")}{" "}
                                {configuration.get("configData.site_name")}
                                <Link to={`/page/privacy`} target="_blank">
                                    {" "}
                                    {t("privacy_policy")}{" "}
                                </Link>
                                and
                                <Link to={`/page/terms`} target="_blank">
                                    {" "}
                                    {t("i_agree")}{" "}
                                </Link>
                            </label>
                        </div>

                        <button
                            className="green-btn bottom1 block cmn-btn"
                            disabled={this.state.buttonDisable}
                        >
                            {this.state.loadingContent != null
                                ? this.state.loadingContent
                                : t("register")}
                        </button>
                    </form>

                    <h4 className="m-0 text-center captalize">
                        {t("already_have_an_account")}{" "}
                        <Link
                            to={"/host/login"}
                            className="bold-cls close-login"
                        >
                            {" "}
                            {t("login")}
                        </Link>
                    </h4>
                </div>
            </div>
        );
    }
}

export default withToastManager(translate(HostRegister));

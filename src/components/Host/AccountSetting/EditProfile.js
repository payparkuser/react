import React, { Component } from "react";

import { Link, Redirect } from "react-router-dom";
import ProfileInput from "../../Helper/profileInput";
import HostProfileSideBar from "./hostProfileSideBar";
import HostHelper from "../../Helper/hostHelper";
import { withToastManager } from "react-toast-notifications";
import ToastDemo from "../../Helper/toaster";
import api from "../../../HostEnvironment";
import configuration from "react-global-configuration";
import { translate, t } from "react-multi-lang";

var const_time_zone = Intl.DateTimeFormat().resolvedOptions().timeZone;

class HostEditProfile extends HostHelper {
    constructor(props) {
        super(props);

        // States and props usage
    }

    state = {
        data: null,
        loading: true,
        error: null,
        loginStatus: true,
        profileUpdateStatusContent: null,
        loadingContent: null,
        buttonDisable: false
    };

    componentDidMount() {
        this.getHostDetails();
        if (this.state.error != null) {
            ToastDemo(this.props.toastManager, this.state.error, "error");
        }
    }

    handleSubmit = event => {
        event.preventDefault();
        this.setState({
            loadingContent: "Loading... Please wait..",
            buttonDisable: true
        });
        let hostDetails = { ...this.state.data };
        const data = {
            name: hostDetails.name,
            description: hostDetails.description,
            email: hostDetails.email,
            mobile: hostDetails.mobile,
            timezone: const_time_zone
        };

        api.postMethod("update_profile", data).then(response => {
            if (response.data.success) {
                ToastDemo(
                    this.props.toastManager,
                    response.data.message,
                    "success"
                );
                this.setState({ loadingContent: null, buttonDisable: false });
            } else {
                ToastDemo(
                    this.props.toastManager,
                    response.data.error,
                    "success"
                );
                this.setState({ loadingContent: null, buttonDisable: false });
            }
        });
    };

    render() {
        const { data, loading, error, loginStatus } = this.state;
        if (!loginStatus) {
            return (
                <Redirect
                    to={{
                        pathname: "/host/login",
                        state: { error: error }
                    }}
                />
            );
        }
        return (
            <div className="main">
                <div className="site-content">
                    <div className="top-bottom-spacing">
                        <div className="row">
                            <HostProfileSideBar />
                            <div className="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-9">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="panel">
                                        <div className="panel-heading">
                                            {t("required")}
                                        </div>

                                        <div className="panel-body  account">
                                            <ProfileInput
                                                label={t("name")}
                                                type="text"
                                                placeholder=""
                                                id="fname"
                                                name="name"
                                                value={loading ? "" : data.name}
                                                onChange={this.handleChange}
                                                description=""
                                            />

                                            <ProfileInput
                                                label={t("email_address")}
                                                type="text"
                                                placeholder=""
                                                id="email"
                                                name="email"
                                                value={
                                                    loading ? "" : data.email
                                                }
                                                onChange={this.handleChange}
                                                description={t("email_address_host_description")}
                                            />

                                            <ProfileInput
                                                label={t("phone_number")}
                                                type="text"
                                                placeholder=""
                                                id="number"
                                                name="mobile"
                                                value={
                                                    loading ? "" : data.mobile
                                                }
                                                onChange={this.handleChange}
                                                description={t("phone_number_host_description")}
                                            />

                                            <div className="form-group row">
                                                <div className="col-3 text-right">
                                                    <label>
                                                        {t("describe_yourself")}
                                                    </label>
                                                </div>
                                                <div className="col-9">
                                                    <textarea
                                                        type="text"
                                                        className="form-control"
                                                        rows="4"
                                                        name="description"
                                                        value={
                                                            loading
                                                                ? ""
                                                                : data.description
                                                        }
                                                        onChange={
                                                            this.handleChange
                                                        }
                                                    />
                                                    <h5 className="profile-note">
                                                        {configuration.get(
                                                            "configData.site_name"
                                                        )}{" "}
                                                        {t("describe_yourself_para1")}
                                                    </h5>

                                                    <h5 className="profile-note">
                                                        {t("describe_yourself_para2")}
                                                    </h5>

                                                    <h5 className="profile-note">
                                                        {t("describe_yourself_para3")}{" "}
                                                        {configuration.get(
                                                            "configData.site_name"
                                                        )}
                                                        {t("describe_yourself_para4")}
                                                    </h5>

                                                    <h5 className="profile-note">
                                                        {t("describe_yourself_para5")}
                                                    </h5>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-9 offset-3 text-center">
                                                    <button
                                                        className="green-btn btn-block"
                                                        disabled={
                                                            this.state
                                                                .buttonDisable
                                                        }
                                                    >
                                                        {this.state
                                                            .loadingContent !=
                                                        null
                                                            ? this.state
                                                                  .loadingContent
                                                            : t("save")}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withToastManager(translate(HostEditProfile));

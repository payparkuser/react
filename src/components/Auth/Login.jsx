import React, { Component } from "react";
import ForgotPassword from "../Auth/ForgotPassword";
import InputField from "../Helper/inputfield";
import Helper from "../Helper/Helper";
import api from "../../Environment";
import { withToastManager } from "react-toast-notifications";
import ToastDemo from "../Helper/toaster";
// import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { translate, t } from "react-multi-lang";

import configuration from "react-global-configuration";

var const_time_zone = Intl.DateTimeFormat().resolvedOptions().timeZone;

class Login extends Helper {
    state = {
        data: {
            email: "",
            password: "",
            device_type: "web",
            timezone: const_time_zone,
        },
        loadingContent: null,
        buttonDisable: false,
    };

    responseFacebook = (response) => {
        const { path } = this.props.location;
        if (response) {
            const emailAddress =
                response.email === undefined || response.email === null
                    ? response.id + "@facebook.com"
                    : response.email;
            const socialLoginInput = {
                social_unique_id: response.id,
                login_by: "facebook",
                email: emailAddress,
                name: response.name,
                device_type: "web",
                device_token: "123466",
                timezone: const_time_zone,
            };
            api.postMethod("register", socialLoginInput)
                .then((response) => {
                    if (response.data.success === true) {
                        localStorage.setItem(
                            "userId",
                            response.data.data.user_id
                        );
                        localStorage.setItem(
                            "accessToken",
                            response.data.data.token
                        );
                        localStorage.setItem("userLoginStatus", true);
                        localStorage.setItem(
                            "user_picture",
                            response.data.data.picture
                        );
                        localStorage.setItem(
                            "username",
                            response.data.data.username
                        );

                        window.location = path ? path.from.pathname : "/search";
                        ToastDemo(
                            this.props.toastManager,
                            response.data.message,
                            "success"
                        );
                        this.setState({
                            loadingContent: null,
                            buttonDisable: false,
                        });
                    } else {
                        this.setState({
                            loadingContent: null,
                            buttonDisable: false,
                        });
                        ToastDemo(
                            this.props.toastManager,
                            response.data.error,
                            "error"
                        );
                    }
                })
                .catch((error) => {
                    this.setState({
                        loadingContent: null,
                        buttonDisable: false,
                    });
                });
        }
    };

    responseGoogle = (response) => {
        const { path } = this.props.location;
        const googleResponse = response.profileObj ? response.profileObj : null;
        if (googleResponse) {
            const googleLoginInput = {
                social_unique_id: googleResponse.googleId,
                login_by: "google",
                email: googleResponse.email,
                name: googleResponse.name,
                picture: googleResponse.imageUrl,
                device_type: "web",
                device_token: "123466",
                timezone: const_time_zone,
            };
            api.postMethod("register", googleLoginInput)
                .then((response) => {
                    if (response.data.success === true) {
                        localStorage.setItem(
                            "userId",
                            response.data.data.user_id
                        );
                        localStorage.setItem(
                            "accessToken",
                            response.data.data.token
                        );
                        localStorage.setItem("userLoginStatus", true);
                        localStorage.setItem(
                            "user_picture",
                            response.data.data.picture
                        );
                        localStorage.setItem(
                            "username",
                            response.data.data.username
                        );

                        window.location = path ? path.from.pathname : "/search";
                        ToastDemo(
                            this.props.toastManager,
                            response.data.message,
                            "success"
                        );
                        this.setState({
                            loadingContent: null,
                            buttonDisable: false,
                        });
                    } else {
                        this.setState({
                            loadingContent: null,
                            buttonDisable: false,
                        });
                        ToastDemo(
                            this.props.toastManager,
                            response.data.error,
                            "error"
                        );
                    }
                })
                .catch((error) => {
                    this.setState({
                        loadingContent: null,
                        buttonDisable: false,
                    });
                });
        }
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const { path } = this.props.location;
        this.setState({
            loadingContent: "Loading... Please wait..",
            buttonDisable: true,
        });
        api.postMethod("login", this.state.data)
            .then((response) => {
                if (response.data.success === true) {
                    localStorage.setItem("userId", response.data.data.user_id);
                    localStorage.setItem(
                        "accessToken",
                        response.data.data.token
                    );
                    localStorage.setItem("userLoginStatus", true);
                    localStorage.setItem(
                        "user_picture",
                        response.data.data.picture
                    );
                    localStorage.setItem(
                        "username",
                        response.data.data.username
                    );

                    window.location = path ? path.from.pathname : "/search";
                    ToastDemo(
                        this.props.toastManager,
                        response.data.message,
                        "success"
                    );
                    this.setState({
                        loadingContent: null,
                        buttonDisable: false,
                    });
                } else {
                    this.setState({
                        loadingContent: null,
                        buttonDisable: false,
                    });
                    ToastDemo(
                        this.props.toastManager,
                        response.data.error,
                        "error"
                    );
                }
            })
            .catch((error) => {
                this.setState({ loadingContent: null, buttonDisable: false });
            });
    };

    render() {
        const { data } = this.state;

        return (
            <div>
                <div className="modal fade auth" id="login">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button
                                    type="button"
                                    className="close"
                                    id="close-login"
                                    data-dismiss="modal"
                                >
                                    <i className="material-icons">close</i>
                                </button>
                            </div>

                            <div className="modal-body">
                                <h1 className="section-head">
                                    {t("login_to_continue")}
                                </h1>
                                <form
                                    className="top1"
                                    onSubmit={this.handleSubmit}
                                >
                                    <InputField
                                        type="text"
                                        name="email"
                                        onChange={this.handleChange}
                                        placeholder={t("email")}
                                        iconClassName="fas fa-lock"
                                        value={data.email}
                                    />

                                    <InputField
                                        type="password"
                                        name="password"
                                        onChange={this.handleChange}
                                        placeholder={t("password")}
                                        iconClassName="fas fa-lock"
                                        value={data.password}
                                    />

                                    <button
                                        className="green-btn btn-block bottom1"
                                        disabled={this.state.buttonDisable}
                                    >
                                        {this.state.loadingContent != null
                                            ? this.state.loadingContent
                                            : "login"}
                                    </button>
                                    <a
                                        href="#"
                                        className="forgot-pass close-login"
                                        data-toggle="modal"
                                        data-target="#forgot-password"
                                    >
                                        {t("forgot_password")}
                                    </a>
                                </form>

                                <div className="login-separator">
                                    {t("or_continue_with")}
                                </div>
                                <div className="row">
                                    {configuration.get(
                                        "configData.social_logins.GOOGLE_CLIENT_ID"
                                    ) ? (
                                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 bottom1">
                                            <GoogleLogin
                                                clientId={configuration.get(
                                                    "configData.social_logins.GOOGLE_CLIENT_ID"
                                                )}
                                                render={(renderProps) => (
                                                    <button
                                                        className="social-btn"
                                                        onClick={
                                                            renderProps.onClick
                                                        }
                                                        disabled={
                                                            renderProps.disabled
                                                        }
                                                    >
                                                        <i className="fab fa-google" />{" "}
                                                        {t("google")}
                                                    </button>
                                                )}
                                                buttonText="Login"
                                                onSuccess={this.responseGoogle}
                                                onFailure={this.responseGoogle}
                                                cookiePolicy={
                                                    "single_host_origin"
                                                }
                                            />
                                        </div>
                                    ) : (
                                        ""
                                    )}

                                    {configuration.get(
                                        "configData.social_logins.FB_CLIENT_ID"
                                    ) ? (
                                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 bottom1">
                                            <FacebookLogin
                                                appId={configuration.get(
                                                    "configData.social_logins.FB_CLIENT_ID"
                                                )}
                                                fields="name,email,picture"
                                                scope="public_profile"
                                                callback={this.responseFacebook}
                                                render={(renderProps) => (
                                                    <button
                                                        className="social-btn"
                                                        onClick={
                                                            renderProps.onClick
                                                        }
                                                        disabled={
                                                            renderProps.disabled
                                                        }
                                                    >
                                                        <i className="fab fa-facebook" />{" "}
                                                        {t("facebook")}
                                                    </button>
                                                )}
                                            />
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </div>
                                <p className="line" />
                                <h4 className="m-0 text-center captalize">
                                    {t("do_not_have_an_account")}{" "}
                                    <a
                                        href="#"
                                        className="bold-cls close-login"
                                        data-toggle="modal"
                                        data-target="#signup"
                                    >
                                        {" "}
                                        {t("signup")}
                                    </a>
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
                <ForgotPassword />
            </div>
        );
    }
}

export default withToastManager(translate(Login));

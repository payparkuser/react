import React, { Component } from "react";
import InputField from "../Helper/inputfield";
import Helper from "../Helper/Helper";
import api from "../../Environment";
import { withToastManager } from "react-toast-notifications";
import ToastDemo from "../Helper/toaster";
import { translate, t } from "react-multi-lang";

class ForgotPassword extends Helper {
    state = {
        data: {
            email: "",
            password: "",
            device_type: "web"
        },
        loadingContent: null,
        buttonDisable: false
    };

    handleSubmit = event => {
        event.preventDefault();
        this.setState({
            loadingContent: "Loading... Please wait..",
            buttonDisable: true
        });

        if (this.state.data.email == "") {
            this.setState({ loadingContent: null, buttonDisable: false });
            ToastDemo(
                this.props.toastManager,
                "Please enter the email address",
                "error"
            );

            return false;
        }
        api.postMethod("forgot_password", this.state.data)
            .then(response => {
                if (response.data.success === true) {
                    ToastDemo(
                        this.props.toastManager,
                        response.data.message,
                        "success"
                    );
                    this.setState({
                        loadingContent: null,
                        buttonDisable: false
                    });
                    setTimeout(() => {
                        window.location = "/";
                    }, 2000);
                } else {
                    this.setState({
                        loadingContent: null,
                        buttonDisable: false
                    });
                    ToastDemo(
                        this.props.toastManager,
                        response.data.error,
                        "error"
                    );
                }
            })
            .catch(error => {
                this.setState({ loadingContent: null, buttonDisable: false });
            });
    };

    render() {
        const { data } = this.state;
        return (
            <div>
                <div className="modal fade auth" id="forgot-password">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button
                                    type="button"
                                    className="close"
                                    id="close-forgot"
                                    data-dismiss="modal"
                                >
                                    <i className="material-icons">close</i>
                                </button>
                            </div>

                            <div className="modal-body">
                                <h1 className="section-head">{t("reset_password")}</h1>
                                <p className="small-line" />
                                <h4>
                                    {t("reset_password_text")}
                                </h4>
                                <form
                                    className="top1"
                                    onSubmit={this.handleSubmit}
                                >
                                    <InputField
                                        type="text"
                                        name="email"
                                        onChange={this.handleChange}
                                        placeholder={t("email")}
                                        iconClassName="fas fa-envelope"
                                        value={data.email}
                                    />

                                    <div className="row">
                                        <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                            {/* <a
                        href="#"
                        className="back-to-login close-forgot"
                        href="#"
                        data-toggle="modal"
                        data-target="#login"
                      >
                        <i className="fas fa-chevron-left" />
                        &nbsp;&nbsp;{t("back_to_login")}
                      </a> */}
                                        </div>
                                        <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                            <button
                                                className="green-btn bottom1 btn-block"
                                                disabled={
                                                    this.state.buttonDisable
                                                }
                                                type="submit"
                                            >
                                                {this.state.loadingContent !=
                                                null
                                                    ? this.state.loadingContent
                                                    : t("send_reset_link")}
                                            </button>
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

export default withToastManager(translate(ForgotPassword));

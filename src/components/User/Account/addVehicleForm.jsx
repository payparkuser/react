import React, { Component } from "react";
import api from "../../../Environment";
import { Link } from "react-router-dom";
import ToastDemo from "../../Helper/toaster";
import { withToastManager } from "react-toast-notifications";
import { translate, t } from "react-multi-lang";
const $ = window.$;

class AddVehicleForm extends Component {
    state = {
        formData: {
            vehicle_type: "",
            vehicle_brand: "",
            vehicle_model: "",
            vehicle_number: ""
        },
        addVehicleButton: false,
        addVehilceLoadingContent: null
    };

    handleChange = ({ currentTarget: input }) => {
        const formData = { ...this.state.formData };
        formData[input.name] = input.value;
        this.setState({ formData });
    };

    handleSubmit = event => {
        event.preventDefault();
        this.setState({
            loadingContent: "Loading... Please wait..",
            buttonDisable: true
        });
        const { formData } = this.state;
        if (
            formData.vehicle_brand == "" ||
            formData.vehicle_model == "" ||
            formData.vehicle_number == "" ||
            formData.vehicle_type == ""
        ) {
            ToastDemo(
                this.props.toastManager,
                "Please add all required fields",
                "error"
            );
        } else {
            this.setState({
                addVehilceLoadingContent: "Loading... Please Wait",
                addVehicleButton: true
            });
        }
        this.addVehicleApi();
    };
    addVehicleApi = () => {
        api.postMethod("vehicles_save", this.state.formData).then(response => {
            if (response.data.success) {
                ToastDemo(
                    this.props.toastManager,
                    response.data.message,
                    "success"
                );
                this.setState({
                    loadingContent: null,
                    buttonDisable: false,
                    data: {
                        vehicle_type: "",
                        vehicle_brand: "",
                        vehicle_model: "",
                        vehicle_number: ""
                    }
                });

                $("#AddVehicleModal").modal("hide");
                // this.getVehicleListApiCall();
            } else {
                ToastDemo(
                    this.props.toastManager,
                    response.data.error,
                    "error"
                );
                this.setState({
                    addVehilceLoadingContent: null,
                    addVehicleButton: false
                });
            }
        });
    };
    render() {
        const { formData } = this.state;

        return (
            <div className="modal fade" id="AddVehicleModal">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="modal-body">
                            <h1 className="section-head">{t("add_a_vehicle")}</h1>
                            <hr></hr>
                            <form onSubmit={this.handleSubmit}>
                                <div className="pay-det-group">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label>{t("vehicle_type")}</label>

                                                <input
                                                    type="text"
                                                    className="form-control pay-card-opt"
                                                    placeholder={t("ex_vehicle_type")}
                                                    name="vehicle_type"
                                                    value={
                                                        formData.vehicle_type
                                                    }
                                                    onChange={this.handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label>{t("vehicle_brand")}</label>

                                                <input
                                                    type="text"
                                                    className="form-control pay-card-opt"
                                                    placeholder={t("ex_brand")}
                                                    name="vehicle_brand"
                                                    value={
                                                        formData.vehicle_brand
                                                    }
                                                    onChange={this.handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label>{t("vehicle_model")}</label>

                                                <input
                                                    type="text"
                                                    className="form-control pay-card-opt"
                                                    placeholder={t("ex_vehicle_model")}
                                                    name="vehicle_model"
                                                    value={
                                                        formData.vehicle_model
                                                    }
                                                    onChange={this.handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label>{t("vehicle_number")}</label>

                                                <input
                                                    type="text"
                                                    className="form-control pay-card-opt"
                                                    placeholder={t("ex_vehicle_number")}
                                                    name="vehicle_number"
                                                    value={
                                                        formData.vehicle_number
                                                    }
                                                    onChange={this.handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <button
                                                className="full-btn green-btn"
                                                type="submit"
                                                disabled={
                                                    this.state.addVehicleButton
                                                }
                                            >
                                                {this.state
                                                    .addVehilceLoadingContent !=
                                                null
                                                    ? this.state
                                                          .addVehilceLoadingContent
                                                    : t("add_vehicle")}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withToastManager(translate(AddVehicleForm));

import React, { Component } from "react";
import api from "../../../HostEnvironment";
import { Link } from "react-router-dom";
import Loader from "../../Helper/Loader";
import HostHelper from "../../Helper/hostHelper";
import { withToastManager } from "react-toast-notifications";
import ToastDemo from "../../Helper/toaster";
import dayjs from "dayjs";
import "../../../../src/calendar.scss";
import { translate, t } from "react-multi-lang";

import moment from "moment";
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
var yesterday = moment().subtract( 1, 'day' );
var valid = function( current ){
    return current.isAfter( yesterday );
};

const onlyMonth = {
    month: "numeric"
};
const onlyYear = {
    year: "numeric"
};

class HostAvailability extends Component {
    state = {
        selected: [],
        num: 1,
        availabilities: null,
        loading: true,
        removed: true,
        formData: {
            available_days: this.props.location.state.days
            ? this.props.location.state.days.split(",")
            : "1,2,3,4,5,6".split(",")
        },
        loadingContent: null,
        buttonDisable: false,
        availability_lists: null,
        skipCount: 0,
        loadingStatus: true,
        loadingButtonContent: null,
        loadingButtonContentAvail: null,
        buttonDisableAvailableDays: false,
        workingDays: "1,2,3,4,5,6"
    };
    componentDidMount() {
        this.getAvailabilityListApiCall();
        this.setState({
            workingDays: this.props.location.state.days
                ? this.props.location.state.days
                : "1,2,3,4,5,6"
        });
    }

    handleDelete = (event, available_days) => {
        event.preventDefault();
        api.postMethod("space_availability_list_delete", {
            host_availability_id: available_days.host_availability_id
        }).then(response => {
            if (response.data.success) {
                ToastDemo(
                    this.props.toastManager,
                    response.data.message,
                    "success"
                );
                this.setState({
                    availability_lists: null,
                    skipCount: 0,
                    loading: true
                });
                this.getAvailabilityListApiCall();
            } else {
                ToastDemo(
                    this.props.toastManager,
                    response.data.error,
                    "error"
                );
            }
        });
    };

    getAvailabilityListApiCall() {
        let items;
        api.postMethod("spaces_availability_list", {
            skip: this.state.skipCount,
            space_id: this.props.match.params.id
        }).then(response => {
            if (response.data.success) {
                if (this.state.availability_lists != null) {
                    items = [
                        ...this.state.availability_lists,
                        ...response.data.data
                    ];
                } else {
                    items = [...response.data.data];
                }
                this.setState({
                    availability_lists: items,
                    loading: false,
                    skipCount: response.data.data.length + this.state.skipCount,
                    loadingStatus: true
                });
            }
        });
    }

    loadMore = event => {
        event.preventDefault();
        this.setState({ loadingStatus: false, loadingContent: "Loading..." });
        this.getAvailabilityListApiCall();
    };

    getArrivingDateandTime = title => (...args) => {
        console.log("arg", args);
        const formData = { ...this.state.formData };
        const datess = dayjs(args[0]).format("YYYY-MM-DD HH:mm:ss");
        formData["from_date"] = datess;
        this.setState({ formData });
    };

    getOutDateandTime = title => (...args) => {
        console.log("arg", args);
        const formData = { ...this.state.formData };
        const datess = dayjs(args[0]).format("YYYY-MM-DD HH:mm:ss");
        formData["to_date"] = datess;
        this.setState({ formData });
    };

    handleChange = ({ currentTarget: input }) => {
        const formData = { ...this.state.formData };

        if (input.type == "checkbox") {
            if (input.checked) {
                if (formData[input.name] === undefined) {
                    let array = [];
                    array.push(input.value);
                    formData[input.name] = array;
                    console.log("Array", array);
                    this.setState({ formData });
                } else {
                    formData[input.name].push(input.value);
                    this.setState({ formData });
                }
            } else {
                let index = formData[input.name].indexOf(input.value);

                if (index !== -1) {
                    formData[input.name].splice(index, 1);
                    this.setState({ formData });
                }
            }
        } else {
            formData[input.name] = input.value;
            this.setState({ formData });
        }
    };

    handleSubmit = event => {
        event.preventDefault();
        this.setState({
            loadingButtonContent: "Loading... Please wait..",
            buttonDisable: true
        });
        if (
            this.state.formData.from_date == undefined ||
            this.state.formData.to_date == undefined ||
            this.state.formData.spaces == undefined
        ) {
            ToastDemo(
                this.props.toastManager,
                "Please fill all the fields",
                "error"
            );
            this.setState({ loadingButtonContent: null, buttonDisable: false });
        } else {
            const formData = { ...this.state.formData };
            formData["type"] = 1;
            formData["space_id"] = this.props.match.params.id;
            this.setState({ formData });

            api.postMethod("space_availability_list_save", formData).then(
                response => {
                    if (response.data.success) {
                        ToastDemo(
                            this.props.toastManager,
                            response.data.message,
                            "success"
                        );
                        this.setState({
                            loadingButtonContent: null,
                            buttonDisable: false,
                            availability_lists: null,
                            skipCount: 0,
                            loading: true,
                            formData: {
                                available_days: formData['available_days']
                            }
                        });
                        this.getAvailabilityListApiCall();
                    } else {
                        ToastDemo(
                            this.props.toastManager,
                            response.data.error,
                            "error"
                        );
                        this.setState({
                            loadingButtonContent: null,
                            buttonDisable: false
                        });
                    }
                }
            );
        }
    };

    handleSelectedAvailableDays = value => {
        var myArray = this.state.formData["available_days"];
        return myArray.includes(value);
    };

    handleSubmitAvailableDays = event => {
        event.preventDefault();
        this.setState({
            loadingButtonContentAvail: "Loading... Please wait..",
            buttonDisableAvailableDays: true
        });
        if (this.state.formData.available_days == undefined) {
            ToastDemo(
                this.props.toastManager,
                "Choose the available days and update",
                "error"
            );
            this.setState({
                loadingButtonContentAvail: null,
                buttonDisableAvailableDays: false
            });
        } else {
            const formData = { ...this.state.formData };
            formData[
                "available_days"
            ] = this.state.formData.available_days.toString();
            formData["space_id"] = this.props.match.params.id;
            this.setState({ formData });

            console.log("formdate", formData);
            api.postMethod("spaces_available_days_update", formData).then(
                response => {
                    if (response.data.success) {
                        ToastDemo(
                            this.props.toastManager,
                            response.data.message,
                            "success"
                        );
                        this.setState({
                            loadingButtonContentAvail: null,
                            buttonDisableAvailableDays: false,
                            workingDays: this.state.formData.available_days
                                ? this.state.formData.available_days
                                : "1,2,3,4,5,6"
                        });
                        this.setState({
                            availability_lists: null,
                            skipCount: 0,
                            loading: true
                        });
                    } else {
                        ToastDemo(
                            this.props.toastManager,
                            response.data.error,
                            "error"
                        );
                        this.setState({
                            loadingButtonContentAvail: null,
                            buttonDisableAvailableDays: false
                        });
                    }
                }
            );
        }
    };

    render() {
        const {
            formData,
            buttonDisable,
            loadingButtonContent,
            loadingContent,
            loading,
            availability_lists,
            loadingStatus,
            loadingButtonContentAvail,
            buttonDisableAvailableDays
        } = this.state;

        return (
            <div className="main">
                <div className="site-content">
                    <div className="top-bottom-spacing add-listings">
                        <div className="row">
                            <div className="col-12">
                                <h2 className="text-uppercase">
                                    {t("set_your_availability")}
                                </h2>

                                <h5 className="profile-note">
                                    {t("set_your_availability_para")}
                                </h5>

                                <p className="overview-line-1"></p>
                            </div>

                            <div className="col-12 col-sm-12 col-md-7 col-lg-7 col-xl-8">
                                <div className="host-section row">
                                    <div className="col-12">
                                        <h5 className="m-0 text-uppercase lh-1-4">
                                            {t("choose_available_days")}
                                        </h5>

                                        <p className="overview-line-1"></p>
                                    </div>

                                    <div className="form-group col-12">
                                        {/* <label>Type of space</label> */}

                                        <div className="switch-field">
                                            <input
                                                type="checkbox"
                                                id="sunday"
                                                name="available_days"
                                                value={1}
                                                onChange={this.handleChange}
                                                checked={this.handleSelectedAvailableDays(
                                                    "1"
                                                )}
                                            />
                                            <label htmlFor="sunday">
                                                {t("sunday")}
                                            </label>
                                            <input
                                                type="checkbox"
                                                id="Monday"
                                                name="available_days"
                                                value={2}
                                                onChange={this.handleChange}
                                                checked={this.handleSelectedAvailableDays(
                                                    "2"
                                                )}
                                            />
                                            <label htmlFor="Monday">
                                                {t("monday")}
                                            </label>
                                            <input
                                                type="checkbox"
                                                id="Tuesday"
                                                name="available_days"
                                                value={3}
                                                onChange={this.handleChange}
                                                checked={this.handleSelectedAvailableDays(
                                                    "3"
                                                )}
                                            />
                                            <label htmlFor="Tuesday">
                                                {t("tuesday")}
                                            </label>
                                            <input
                                                type="checkbox"
                                                id="Wednesday"
                                                name="available_days"
                                                value={4}
                                                onChange={this.handleChange}
                                                checked={this.handleSelectedAvailableDays(
                                                    "4"
                                                )}
                                            />
                                            <label htmlFor="Wednesday">
                                                {t("wednesday")}
                                            </label>
                                            <input
                                                type="checkbox"
                                                id="Thursday"
                                                name="available_days"
                                                value={5}
                                                onChange={this.handleChange}
                                                checked={this.handleSelectedAvailableDays(
                                                    "5"
                                                )}
                                            />
                                            <label htmlFor="Thursday">
                                                {t("thursday")}
                                            </label>
                                            <input
                                                type="checkbox"
                                                id="Friday"
                                                name="available_days"
                                                value={6}
                                                onChange={this.handleChange}
                                                checked={this.handleSelectedAvailableDays(
                                                    "6"
                                                )}
                                            />
                                            <label htmlFor="Friday">
                                                {t("friday")}
                                            </label>
                                            <input
                                                type="checkbox"
                                                id="Saturday"
                                                name="available_days"
                                                value={7}
                                                onChange={this.handleChange}
                                                checked={this.handleSelectedAvailableDays(
                                                    "7"
                                                )}
                                            />
                                            <label htmlFor="Saturday">
                                                {t("saturday")}
                                            </label>
                                        </div>
                                    </div>

                                    <div className="form-group col-6">
                                        <button
                                            type="button"
                                            className="green-btn mb-3"
                                            onClick={
                                                this.handleSubmitAvailableDays
                                            }
                                            disabled={
                                                buttonDisableAvailableDays
                                            }
                                        >
                                            {loadingButtonContentAvail != null
                                                ? loadingButtonContentAvail
                                                : t("update")}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-sm-12 col-md-7 col-lg-7 col-xl-8">
                                <div className="host-section row">
                                    <div className="col-12">
                                        <h5 className="m-0 text-uppercase lh-1-4">
                                            {t("choose_available_spaces")}
                                        </h5>
                                        <p>
                                            {t("choose_available_spaces_para")}
                                        </p>
                                        <p className="overview-line-1"></p>
                                    </div>

                                    <div className="form-group col-6">
                                        <label>{t("choose_from_date")}</label>

                                        <Datetime
                                            onChange={this.getArrivingDateandTime(
                                                "Range DatePicker"
                                            )}
                                            isValidDate={ valid }
                                            dateFormat="DD-MM-YYYY" 
                                        />
                                    </div>

                                    <div className="form-group col-6">
                                        <label>Choose To Date</label>

                                        <Datetime
                                            onChange={this.getOutDateandTime(
                                                "Range DatePicker"
                                            )}
                                            isValidDate={ valid }
                                            dateFormat="DD-MM-YYYY"
                                        />
                                    </div>

                                    <div className="form-group col-6">
                                        <label>{t("number_of_spaces")}</label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            id="spaces"
                                            name="spaces"
                                            value={formData.spaces}
                                            onChange={this.handleChange}
                                        />
                                    </div>

                                    <div className="col-12">
                                        <button
                                            type="button"
                                            className="green-btn mb-3"
                                            onClick={this.handleSubmit}
                                            disabled={buttonDisable}
                                        >
                                            {loadingButtonContent != null
                                                ? loadingButtonContent
                                                : "Submit"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-9">
                                <div className="transactions">
                                    <h2 className="sec-tit">
                                        {t("availability_lists")}
                                    </h2>
                                    <div className="tab-content prov-tab-content">
                                        <div
                                            className="tab-pane active"
                                            id="home"
                                            role="tabpanel"
                                        >
                                            <div className="clear-both" />

                                            <div className="trans-table table-responsive">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">
                                                                {t("s_no")}
                                                            </th>
                                                            <th scope="col">
                                                                {t("from_date")}
                                                            </th>
                                                            <th scope="col">
                                                                {t("to_date")}
                                                            </th>
                                                            <th scope="col">
                                                                {t("spaces")}
                                                            </th>
                                                            <th scope="col">
                                                                {t("action")}
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {loading ? (
                                                            ""
                                                        ) : availability_lists.length >
                                                          0 ? (
                                                            availability_lists.map(
                                                                (
                                                                    availability_list,
                                                                    index
                                                                ) => (
                                                                    <tr
                                                                        key={
                                                                            availability_list.from_date
                                                                        }
                                                                    >
                                                                        <td>
                                                                            {index +
                                                                                1}
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                availability_list.from_date
                                                                            }
                                                                        </td>
                                                                        <td scope="row">
                                                                            {
                                                                                availability_list.to_date
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                availability_list.spaces
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            <Link
                                                                                to={
                                                                                    "#"
                                                                                }
                                                                                onClick={event =>
                                                                                    this.handleDelete(
                                                                                        event,
                                                                                        availability_list
                                                                                    )
                                                                                }
                                                                            >
                                                                                <i className="fas fa-trash pink-clr" />
                                                                            </Link>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )
                                                        ) : (
                                                            <tr className="no-data">
                                                                <td colSpan="">
                                                                    <img
                                                                        src={
                                                                            window
                                                                                .location
                                                                                .origin +
                                                                            "/assets/img/parking/no-data.svg"
                                                                        }
                                                                    />
                                                                    <h5>
                                                                        No Data
                                                                        Found
                                                                    </h5>
                                                                </td>
                                                            </tr>
                                                        )}
                                                        {loadingStatus
                                                            ? ""
                                                            : loadingContent}
                                                    </tbody>
                                                </table>
                                                {loading ? (
                                                    ""
                                                ) : availability_lists.length >
                                                  0 ? (
                                                    <Link
                                                        to={"#"}
                                                        onClick={this.loadMore}
                                                    >
                                                        Load More
                                                    </Link>
                                                ) : (
                                                    ""
                                                )}
                                            </div>
                                        </div>
                                        <div
                                            className="tab-pane"
                                            id="profile"
                                            role="tabpanel"
                                            aria-labelledby="profile-tab"
                                        >
                                            ...
                                        </div>
                                        <div
                                            className="tab-pane"
                                            id="contact"
                                            role="tabpanel"
                                            aria-labelledby="contact-tab"
                                        >
                                            ...
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withToastManager(translate(HostAvailability));

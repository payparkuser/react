import React, { Component } from "react";

import HomeRoomContent from "../Home/homeRoomContent";
import { Link } from "react-router-dom";
import api from "../../Environment";
import Helper from "../Helper/Helper";
import MapContainer from "../Helper/mapHelper";
import Loader from "../Helper/Loader";
import Filters from "../Helper/filters";
import SingleParkingDetailHelper from "./singleParkingDetailHelper";
import SingleParkingContentHelper from "./singleParkingContentHelper";
import Map, { GoogleApiWrapper, Marker } from "google-maps-react";
import dayjs from "dayjs";
import { withToastManager } from "react-toast-notifications";
import ToastDemo from "../Helper/toaster";
import customParseFormat from "dayjs/plugin/customParseFormat";

import moment from "moment";

import { apiConstants } from "../../components/Constant/constants";
import configuration from "react-global-configuration";
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
var yesterday = moment().subtract( 1, 'day' );
var valid = function( current ){
    return current.isAfter( yesterday );
};
class Search extends Helper {
    state = {
        first_block: null,
        mainData: null,
        loading: true,
        skipCount: 0,
        loadingStatus: true,
        loadingContent: null,
        contentData: null,
        map: true,
        parkingList: null,
        active: false,
        singleDetails: null,
        position: null,
        matchActiveClass: "best-match",
        formData: {
            checkin: "",
            checkout: "",
            latitude: "",
            longitude: "",
            full_address: "",
        },
        buttonDisable: false,
        loadMorebuttonDisable: false,
        loadMoreContent: "",
        currentLocation: {
            lat: 12.9121,
            lng: 77.6446,
        },
        singleParkingDetailsRes: null,
        singleParkingApiLoading: true,
    };
    constructor(props) {
        super(props);

        // States and props usage
    }

    componentDidMount() {
        let inputData;
        console.log("Props", this.props);
        if (this.props.location.state) {
            const landingData = this.props.location.state;
            const formData = { ...this.state.formData };
            formData["latitude"] = landingData.latitude;
            formData["longitude"] = landingData.longitude;
            formData["checkin"] = landingData.checkin;
            formData["checkout"] = landingData.checkout;
            formData["full_address"] = landingData.full_address;
            this.setState({ formData });

            if (landingData.latitude != "" && landingData.longitude != "") {
                const currentLocation = { ...this.state.currentLocation };
                currentLocation["lat"] = landingData.latitude;
                currentLocation["lng"] = landingData.longitude;
                this.setState({ currentLocation });
            }
            this.searchApiCall(this.props.location.state);
        } else {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        var pos = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        };

                        const currentLocation = {
                            ...this.state.currentLocation,
                        };
                        currentLocation["lat"] = position.coords.latitude;
                        currentLocation["lng"] = position.coords.longitude;
                        this.setState({ currentLocation });
                        console.log("testsfsd");
                        inputData = {
                            latitude: this.state.currentLocation.lat,
                            longitude: this.state.currentLocation.lng,
                        };
                        console.log("intu", inputData);
                        this.searchApiCall(inputData);
                    },
                    (error) => {
                        this.handleCurrentLocationError();
                    }
                );
            } else {
                // Browser doesn't support Geolocation
                alert("Browser doesn't support");
            }
        }
        // setTimeout(() => {
        //   this.searchApiCall(inputData);
        // }, 1000);
    }

    handleCurrentLocationError = () => {
        const inputData = {
            latitude: 12.9121,
            longitude: 77.6446,
        };
        this.searchApiCall(inputData);
        ToastDemo(
            this.props.toastManager,
            "Please enable currect location",
            "error"
        );
    };

    searchApiCall = (inputData, search) => {
        // this.setState({ parkingList: null, loading: true });
        let inputDat;
        if (search != "search") {
            inputDat = { ...inputData, skip: this.state.skipCount };
        } else {
            inputDat = { ...inputData, skip: 0 };
            this.setState({ parkingList: null, skipCount: 0, loading: true });
            const currentLocation = { ...this.state.currentLocation };
            currentLocation["lat"] = inputData.latitude;
            currentLocation["lng"] = inputData.longitude;
            this.setState({ currentLocation });
        }
        let items;
        api.postMethod("home_map", inputDat).then((response) => {
            if (response.data.success) {
                if (this.state.parkingList != null) {
                    items = [...this.state.parkingList, ...response.data.data];
                } else {
                    items = [...response.data.data];
                }
                this.setState({
                    parkingList: items,
                    loading: false,
                    buttonDisable: false,
                    skipCount: response.data.data.length + this.state.skipCount,
                    loadingContent: null,
                });
                // if (response.data.data.length < 1) {
                //   ToastDemo(
                //     this.props.toastManager,
                //     "We don't have parking space in this location. Please try other location.",
                //     "error"
                //   );
                // }
                this.setState({ buttonDisable: false, loadingContent: null });
            } else {
                ToastDemo(
                    this.props.toastManager,
                    response.data.error,
                    "error"
                );
                this.setState({ buttonDisable: false, loadingContent: null });
            }
            // console.log("API", response);
        });
    };

    loadMore = (event) => {
        event.preventDefault();
        let inputData;
        const { formData } = this.state;
        if (
            formData.checkin == "" ||
            formData.checkout == "" ||
            formData.latitude == "" ||
            formData.longitude == ""
        ) {
            inputData = {
                latitude: this.state.currentLocation.lat,
                longitude: this.state.currentLocation.lng,
            };
        } else {
            inputData = { ...this.state.formData };
        }

        this.setState({ loadingStatus: false, loadingContent: "Loading..." });

        this.searchApiCall(inputData);
    };

    toggleMap = (map) => {
        this.setState({ map: map });
    };

    handleClick = (single, event) => {
        event.preventDefault();
        this.setState({ singleDetails: single, active: true });
        const inputData = { space_id: single.space_id };
        this.singleViewApiCall(inputData);
    };

    singleViewApiCall = (inputData) => {
        api.postMethod("spaces_view", inputData).then((response) => {
            if (response.data.success) {
                this.setState({
                    singleParkingDetailsRes: response.data.data,
                    singleParkingApiLoading: false,
                });
            } else {
            }
        });
    };

    handleClose = (event) => {
        event.preventDefault();
        this.setState({ active: false, singleDetails: null });
    };

    renderAutoComplete = () => {
        const { google } = this.props;
        if (!google) {
            return;
        }
        const autocomplete = new google.maps.places.Autocomplete(
            this.autocomplete,
            { types: ["geocode"] }
        );

        autocomplete.setFields(["address_component", "geometry", "name"]);

        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            console.log("Place", place);
            if (!place.geometry) return;
            this.setState({ position: place.geometry.location });
            const formData = { ...this.state.formData };
            formData["latitude"] = place.geometry.location.lat();
            formData["longitude"] = place.geometry.location.lng();
            let full_address = "";
            place.address_components.map(
                (address) =>
                    (full_address =
                        full_address == ""
                            ? address.long_name
                            : full_address + "," + address.long_name)
            );
            formData["full_address"] = full_address;

            this.setState({ formData });
        });
    };

    getDefaultArravingTime = (inputDate) => {
        if (inputDate == null) {
            return "";
        }
        return new Date(inputDate);
    };

    getArrivingDateandTime = (title) => (...args) => {
        const formData = { ...this.state.formData };
        const datess = dayjs(args[0]).format("YYYY-MM-DD HH:mm");
        formData["checkin"] = datess;
        this.setState({ formData });
    };

    convertDate = (inputFormat) => {
        function pad(s) {
            return s < 10 ? "0" + s : s;
        }
        var d = new Date(inputFormat);
        return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join(
            "/"
        );
    };

    getOutDateandTime = (title) => (...args) => {
        console.log("arg", args);
        const formData = { ...this.state.formData };
        const datess = dayjs(args[0]).format("YYYY-MM-DD HH:mm");
        formData["checkout"] = datess;
        //formData["checkout"] = args[0];
        this.setState({ formData });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const { formData } = this.state;
        if (
            formData.checkin == "" ||
            formData.checkout == "" ||
            formData.latitude == "" ||
            formData.longitude == ""
        ) {
            ToastDemo(
                this.props.toastManager,
                "Please give all the required details",
                "error"
            );
        } else {
            this.setState({
                loadingContent: "Loading...",
                buttonDisable: true,
            });
            const search = "search";
            this.searchApiCall(this.state.formData, search);
        }
    };

    processPaymentPage = (event) => {
        event.preventDefault();
        if (localStorage.getItem("userLoginStatus"))
            this.props.history.push("/payment", {
                singleDetails: this.state.singleDetails,
                formData: this.state.formData,
            });
        else
            ToastDemo(
                this.props.toastManager,
                "Please login to continue",
                "error"
            );
    };

    changeActiveClass = (event, keyValue) => {
        event.preventDefault();
        this.setState({ matchActiveClass: keyValue, active: false });
        const { formData } = this.state;
        if (
            formData.checkin == "" ||
            formData.checkout == "" ||
            formData.latitude == "" ||
            formData.longitude == ""
        ) {
            const inputData = {
                latitude: this.state.currentLocation.lat,
                longitude: this.state.currentLocation.lng,
                sort_by: keyValue,
            };
            this.searchApiCall(inputData, "search");
        } else {
            formData["sort_by"] = keyValue;
            this.setState({ formData });
            this.searchApiCall(this.state.formData, "search");
        }
    };

    getListForLatLng = (lat, lng) => {
        this.searchApiCall({ latitude: lat, longitude: lng });
    };

    render() {
        let load = new Loader();
        const {
            loading,
            loadingStatus,
            loadingContent,
            parkingList,
            singleDetails,
            active,
            currentLocation,
            singleParkingDetailsRes,
            singleParkingApiLoading,
        } = this.state;

        let renderParkingList = (
            <div className="parklist-wrap">
                {loading ? (
                    "Loading..."
                ) : parkingList.length <= 0 ? (
                    <p className="text-info">
                        Your search did not return any nearby results. Either
                        all spaces are booked for your search times or there are
                        no {configuration.get("configData.site_name")} spaces in
                        this area yet.
                    </p>
                ) : (
                    parkingList.map((single) => (
                        <a
                            href="#"
                            className="parklist-box"
                            onClick={(event) => this.handleClick(single, event)}
                            key={single.space_id}
                        >
                            <SingleParkingDetailHelper
                                single={single}
                                key={single.host}
                            />
                        </a>
                    ))
                )}

                {loading ? (
                    ""
                ) : parkingList.length > 0 ? (
                    <Link
                        className="btn-sm-green"
                        to={"#"}
                        onClick={this.loadMore}
                    >
                        Load More
                    </Link>
                ) : (
                    ""
                )}
            </div>
        );

        let renderParkingSpaceContent = (
            <div
                className={active ? "single-parking active" : "single-parking"}
            >
                <div className="park-close text-right">
                    <a
                        href="#"
                        className="park-close-link"
                        onClick={this.handleClose}
                    >
                        {" "}
                        <i className="flaticon-close" />
                    </a>
                </div>
                <SingleParkingContentHelper
                    singleDetails={singleDetails}
                    singleParkingDetailsRes={singleParkingDetailsRes}
                    singleParkingApiLoading={singleParkingApiLoading}
                />
                <div className={active ? "reserve-btn active" : "reserve-btn"}>
                    <a
                        href="#"
                        className="green-btn full-btn"
                        onClick={this.processPaymentPage}
                    >
                        Reserve {active ? singleDetails.per_hour_formatted : ""}
                    </a>
                </div>
            </div>
        );
        return (
            <div className="resp-search-sec">
                <div className="parklist-head row">
                    <div className="col-md-5 resp-col-width-1">
                        <div className="input-group dropdown">
                            <div className="input-group-append">
                                <span
                                    className="input-group-text"
                                    id="basic-addon"
                                >
                                    <i className="fas fa-search" />
                                </span>
                            </div>
                            <input
                                type="text"
                                className="form-control form-control-lg dropdown-toggle"
                                data-toggle="dropdown"
                                placeholder={
                                    this.props.location.state
                                        ? this.props.location.state.full_address
                                        : "Search your preferred location..."
                                }
                                onFocus={this.renderAutoComplete}
                                ref={(ref) => (this.autocomplete = ref)}
                            />
                        </div>
                    </div>
                    <div className="col-md-7 resp-col-width-1 resp-margin-top">
                        <div className="row">
                            <div className="col-md-4">
                                <div className="search-sec-date">
                                    <Datetime
                                        onChange={this.getArrivingDateandTime(
                                            "Range DatePicker"
                                        )}
                                        isValidDate={ valid }
                                        dateFormat="DD-MM-YYYY" 
                                        initialValue={
                                            this.props.location.state
                                                ? this.getDefaultArravingTime(
                                                      this.props.location.state
                                                          .checkin
                                                  )
                                                : this.getDefaultArravingTime()
                                        }
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 resp-margin-top-2 resp-margin-bottom-2">
                                <div className="search-sec-date">
                                    <Datetime
                                        onChange={this.getOutDateandTime(
                                            "Range DatePicker"
                                        )}
                                        isValidDate={ valid }
                                        dateFormat="DD-MM-YYYY" 
                                        initialValue={
                                            this.props.location.state
                                                ? this.getDefaultArravingTime(
                                                      this.props.location.state
                                                          .checkout
                                                  )
                                                : this.getDefaultArravingTime()
                                        }
                                    />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div>
                                    <button
                                        className="cmn-btn green-btn small-btn park-search-btn"
                                        onClick={this.handleSubmit}
                                        disabled={this.state.buttonDisable}
                                    >
                                        {loadingContent != null
                                            ? loadingContent
                                            : "Search"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="parklist-content row">
                    <div className="col-md-4 resp-col-width-2 resp-col-width-3">
                        <div className="parking-left">
                            <ul
                                className="nav nav-tabs park-tabs"
                                id="myTab"
                                role="tablist"
                            >
                                <li className="nav-item">
                                    <a
                                        className="nav-link active"
                                        data-toggle="tab"
                                        href="#best-match"
                                        role="tab"
                                        aria-controls="best-match"
                                        aria-selected="true"
                                        onClick={(event) =>
                                            this.changeActiveClass(
                                                event,
                                                "best-match"
                                            )
                                        }
                                    >
                                        Best Match
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        className="nav-link"
                                        data-toggle="tab"
                                        href="#cheapest"
                                        role="tab"
                                        aria-controls="cheapest"
                                        aria-selected="false"
                                        onClick={(event) =>
                                            this.changeActiveClass(
                                                event,
                                                "cheapest"
                                            )
                                        }
                                    >
                                        Cheapest
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        className="nav-link"
                                        data-toggle="tab"
                                        href="#closest"
                                        role="tab"
                                        aria-controls="closest"
                                        aria-selected="false"
                                        onClick={(event) =>
                                            this.changeActiveClass(
                                                event,
                                                "closest"
                                            )
                                        }
                                    >
                                        Closest
                                    </a>
                                </li>
                            </ul>

                            <div className="parking-tab-content">
                                <div className="tab-content" id="myTabContent">
                                    <div
                                        className={
                                            this.state.matchActiveClass ==
                                            "best-match"
                                                ? "tab-pane fade show active"
                                                : "tab-pane fade"
                                        }
                                        id="best-match"
                                        role="tabpanel"
                                    >
                                        {this.state.matchActiveClass ==
                                        "best-match"
                                            ? renderParkingList
                                            : ""}
                                    </div>
                                </div>
                                {active &&
                                this.state.matchActiveClass == "best-match" ? (
                                    <div
                                        className={
                                            active
                                                ? "single-parking active"
                                                : "single-parking"
                                        }
                                    >
                                        <div className="park-close text-right">
                                            <a
                                                href="#"
                                                className="park-close-link"
                                                onClick={this.handleClose}
                                            >
                                                {" "}
                                                <i className="flaticon-close" />
                                            </a>
                                        </div>
                                        <SingleParkingContentHelper
                                            singleDetails={singleDetails}
                                            singleParkingDetailsRes={
                                                singleParkingDetailsRes
                                            }
                                            singleParkingApiLoading={
                                                singleParkingApiLoading
                                            }
                                        />
                                        <div
                                            className={
                                                active
                                                    ? "reserve-btn active"
                                                    : "reserve-btn"
                                            }
                                        >
                                            <a
                                                href="#"
                                                className="green-btn full-btn"
                                                onClick={
                                                    this.processPaymentPage
                                                }
                                            >
                                                Reserve{" "}
                                                {active
                                                    ? singleDetails.per_hour_formatted
                                                    : ""}
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>

                            <div className="parking-tab-content">
                                <div className="tab-content" id="myTabContent">
                                    <div
                                        className={
                                            this.state.matchActiveClass ==
                                            "cheapest"
                                                ? "tab-pane fade show active"
                                                : "tab-pane fade"
                                        }
                                        id="cheapest"
                                        role="tabpanel"
                                    >
                                        {this.state.matchActiveClass ==
                                        "cheapest"
                                            ? renderParkingList
                                            : ""}
                                    </div>
                                </div>
                                {active &&
                                this.state.matchActiveClass == "cheapest" ? (
                                    <div
                                        className={
                                            active
                                                ? "single-parking active"
                                                : "single-parking"
                                        }
                                    >
                                        <div className="park-close text-right">
                                            <a
                                                href="#"
                                                className="park-close-link"
                                                onClick={this.handleClose}
                                            >
                                                {" "}
                                                <i className="flaticon-close" />
                                            </a>
                                        </div>
                                        <SingleParkingContentHelper
                                            singleDetails={singleDetails}
                                            singleParkingDetailsRes={
                                                singleParkingDetailsRes
                                            }
                                            singleParkingApiLoading={
                                                singleParkingApiLoading
                                            }
                                        />
                                        <div
                                            className={
                                                active
                                                    ? "reserve-btn active"
                                                    : "reserve-btn"
                                            }
                                        >
                                            <a
                                                href="#"
                                                className="green-btn full-btn"
                                                onClick={
                                                    this.processPaymentPage
                                                }
                                            >
                                                Reserve{" "}
                                                {active
                                                    ? singleDetails.per_hour_formatted
                                                    : ""}
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>

                            <div className="parking-tab-content">
                                <div className="tab-content" id="myTabContent">
                                    <div
                                        className={
                                            this.state.matchActiveClass ==
                                            "closest"
                                                ? "tab-pane fade show active"
                                                : "tab-pane fade"
                                        }
                                        id="best-match"
                                        role="tabpanel"
                                    >
                                        {this.state.matchActiveClass ==
                                        "closest"
                                            ? renderParkingList
                                            : ""}
                                    </div>
                                </div>
                                {active &&
                                this.state.matchActiveClass == "closest" ? (
                                    <div
                                        className={
                                            active
                                                ? "single-parking active"
                                                : "single-parking"
                                        }
                                    >
                                        <div className="park-close text-right">
                                            <a
                                                href="#"
                                                className="park-close-link"
                                                onClick={this.handleClose}
                                            >
                                                {" "}
                                                <i className="flaticon-close" />
                                            </a>
                                        </div>
                                        <SingleParkingContentHelper
                                            singleDetails={singleDetails}
                                            singleParkingDetailsRes={
                                                singleParkingDetailsRes
                                            }
                                            singleParkingApiLoading={
                                                singleParkingApiLoading
                                            }
                                        />
                                        <div
                                            className={
                                                active
                                                    ? "reserve-btn active"
                                                    : "reserve-btn"
                                            }
                                        >
                                            <a
                                                href="#"
                                                className="green-btn full-btn"
                                                onClick={
                                                    this.processPaymentPage
                                                }
                                            >
                                                Reserve{" "}
                                                {active
                                                    ? singleDetails.per_hour_formatted
                                                    : ""}
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8 resp-col-width-2 resp-col-width-4">
                        <div className="park-right">
                            {loading ? (
                                "Loading..."
                            ) : (
                                <MapContainer
                                    history={this.props.history}
                                    data={parkingList}
                                    onMapPanned={this.getListForLatLng}
                                    currentLocation={currentLocation}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default GoogleApiWrapper({
    apiKey: apiConstants.google_api_key,
})(withToastManager(Search));

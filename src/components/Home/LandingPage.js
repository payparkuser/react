import React, { Component } from "react";
import Helper from "../Helper/Helper";
import Loader from "../Helper/Loader";
import ToastDemo from "../Helper/toaster";
import { withToastManager } from "react-toast-notifications";
import { Link } from "react-router-dom";
import Map, { GoogleApiWrapper, Marker } from "google-maps-react";
import dayjs from "dayjs";
import { apiConstants } from "../../components/Constant/constants";
import { translate, t } from "react-multi-lang";

import configuration from "react-global-configuration";

import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
var yesterday = moment().subtract(1, "day");
var valid = function (current) {
  return current.isAfter(yesterday);
};

class LandingPage extends Helper {
  state = {
    first_block: null,
    mainData: null,
    loading: true,
    second_block: null,
    formData: {
      checkin: "",
      checkout: "",
      latitude: "",
      longitude: "",
    },
  };
  constructor(props) {
    super(props);

    // States and props usage
  }

  componentDidMount() {
    // Call api function
    this.getDefaultLeavingTime();
    window.addEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const { google } = this.props;
    if (!google) {
      return;
    }
    const autocomplete = new google.maps.places.Autocomplete(
      this.autocomplete,
      { types: ["geocode"] }
    );

    autocomplete.unbindAll();
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
      if (!place.geometry) return;
      this.setState({ position: place.geometry.location });
      const formData = { ...this.state.formData };
      formData["latitude"] = place.geometry.location.lat();
      formData["longitude"] = place.geometry.location.lng();
      let full_address = "";
      place.address_components.map(
        (address, index) =>
          (full_address =
            full_address == ""
              ? address.long_name
              : index == 1
              ? full_address
              : full_address + "," + address.long_name)
      );

      formData["full_address"] = full_address;
      this.setState({ formData });
    });
  };

  showParking = (event) => {
    event.preventDefault();

    if (!this.state.formData.full_address) {
      ToastDemo(this.props.toastManager, "Enter the location", "error");
      return false;
    }
    if (!this.state.formData.checkin) {
      ToastDemo(this.props.toastManager, "Choose Arriving date", "error");
      return false;
    }

    if (!this.state.formData.checkout) {
      ToastDemo(this.props.toastManager, "Choose Leaving date", "error");
      return false;
    }

    this.props.history.push("/search", this.state.formData);
  };

  getArrivingDateandTime =
    (title) =>
    (...args) => {
      const formData = { ...this.state.formData };
      const datess = dayjs(args[0]).format("YYYY-MM-DD HH:mm:ss");
      console.log(datess);
      formData["checkin"] = datess;
      this.setState({ formData });
    };

  getOutDateandTime =
    (title) =>
    (...args) => {
      const formData = { ...this.state.formData };
      const datess = dayjs(args[0]).format("YYYY-MM-DD HH:mm:ss");
      formData["checkout"] = datess;
      this.setState({ formData });
    };

  getDefaultLeavingTime = () => {
    var oldDateObj = new Date();
    var newDateObj = new Date();
    newDateObj.setTime(oldDateObj.getTime() + 60 * 60 * 1000);

    return dayjs(newDateObj).format("YYYY-MM-DD HH:mm");
  };
  getDefaultArravingTime = () => {
    return dayjs(new Date()).format("YYYY-MM-DD HH:mm");
  };

  render() {
    let load = new Loader();
    const { loading, mainData, second_block } = this.state;
    let renderSearch = (
      <div>
        <div className="form-group">
          <label>{t("parking_at")}</label>
          <input
            type="text"
            className="form-control"
            placeholder="Where do you want to park?"
            onFocus={this.renderAutoComplete}
            ref={(ref) => (this.autocomplete = ref)}
          />
        </div>
        <div className="form-group row resp-margin-top">
          <div className="col-md-6">
            <label>{t("arriving_on")}</label>
            <div className="">
              <Datetime
                onChange={this.getArrivingDateandTime("Range DatePicker")}
                isValidDate={valid}
                dateFormat="DD-MM-YYYY"
              />
            </div>
          </div>
          <div className="col-md-6 resp-margin-top-2">
            <label>{t("leaving_on")}</label>

            <Datetime
              // initialDate={this.getDefaultLeavingTime()}
              onChange={this.getOutDateandTime("Range DatePicker")}
              // dateFormat={moment().format("DD-MM-YYYY")}
              isValidDate={valid}
              dateFormat="DD-MM-YYYY"
            />
          </div>
        </div>
        <div>
          <button className="cmn-btn green-btn mt-5" onClick={this.showParking}>
            {t("show_parking_spaces")}
          </button>
        </div>
      </div>
    );
    return (
      <div className="main">
        <div
          className="banner-sec bg-img"
          style={{
            backgroundImage: `url('../assets/img/parking/home-banner.png')`,
          }}
        >
          <div className="site-content">
            <div className="banner-inner row">
              {/* <div className="col-md-6">
                                <div className="banner-left pos-rel"></div>
                            </div> */}
              <div className="col-md-12">
                <div class="row">
                  <div class="col-md-6 ml-auto resp-col-width">
                    <div className="banner-right">
                      <h1 className="banner-tit">
                        {t("find_parking_in_seconds")}
                      </h1>
                      <p className="banner-txt mb-0">{t("landing_page_para1")}</p>
                      <p className="banner-txt">{t("landing_page_para2")}</p>
                      <div className="banner-content">
                        <ul className="nav nav-tabs search-tab" role="tablist">
                          <li className="nav-item">
                            <a
                              className="nav-link active"
                              data-toggle="tab"
                              href="#hourly"
                              role="tab"
                              aria-selected="true"
                            >
                              {t("hourly_daily_monthly")}
                            </a>
                          </li>
                          {/* <li className="nav-item">
                                <a
                                className="nav-link"
                                id="profile-tab"
                                data-toggle="tab"
                                href="#monthly"
                                role="tab"
                                aria-selected="false"
                                >
                                Monthly
                                </a>
                            </li> */}
                        </ul>
                        <div className="tab-content search-content">
                          <div
                            className="tab-pane fade show active"
                            id="hourly"
                            role="tabpanel"
                          >
                            {renderSearch}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className="process-section park-section">
          <div className="container">
            <div className="sec-head text-center">
              <div className="title-line"></div>
              <h2>{t("parking_made_easy")}</h2>
              <p>
                You can plan and book your parking at thousands of parking
                spaces across India.
              </p>
            </div>
            <div className="sec-content row">
              <div className="col-md-4">
                <div className="features-box text-center">
                  <img src="../assets/img/svg/parking.svg" />
                  <h3>{t("search")}</h3>
                  <p>{t("search_para")}</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="features-box text-center">
                  <img src="../assets/img/svg/bill.svg" />
                  <h3>{t("book")}</h3>
                  <p>{t("book_para")}</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="features-box text-center">
                  <img src="../assets/img/svg/parking-sign.svg" />
                  <h3>{t("park")}</h3>
                  <p>{t("park_para")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="rent-section cross-shape p-70 bg-img"
          style={{
            backgroundImage: `url('../assets/img/parking/parking.jpg')`,
          }}
        >
          {/* <div className="rent-shape">
            <img src="../assets/img/parking/shape-1.png" />
          </div> */}
          <div className="container">
            <div className="rent-inner row pos-rel">
              <div className="col-md-6">
                <div className="rent-left">
                  <h3 className="white-color rent-tit">
                    {t("do_you_have_an_empty_car_space")}
                  </h3>
                  <p className="white-color rent-txt">
                    {t("do_you_have_an_empty_car_space_para")}
                  </p>
                  <a href="#" className="white-btn">
                    {t("rent_out_your_space")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="download-section p-70">
          <div className="container">
            <div className="sec-head mb-20">
              <div className="title-line m-l"></div>
              <h2>
                {t("download_the")}{" "}
                <span className="green-color"> FREE ParkingPal </span>{" "}
                {t("app")}
              </h2>
            </div>
            <div className="sec-content">
              <div className="row">
                <div className="col-md-5">
                  <p className="sec-txt mb-20">
                    {t("download_app_para")}
                  </p>
                  {/* <div className="send-link-wrap mb-20">
                    <div className="input-group dropdown">
                      <input
                        type="text"
                        className="form-control form-control-lg dropdown-toggle"
                        data-toggle="dropdown"
                        placeholder="try 'london'"
                      />
                      <div className="input-group-append">
                        <span className="input-group-text" id="basic-addon">
                          Send Link
                        </span>
                      </div>
                    </div>
                  </div> */}
                  <div className="download-icon-wrap">
                    {/* <h4 className="download-icon-tit">{t("download_from")}</h4> */}

                    <a
                      href={configuration.get("configData.playstore_user")}
                      className="download-icon"
                    >
                      <img src="../assets/img/parking/googleplay.svg" />
                    </a>

                    <a
                      href={configuration.get("configData.appstore_user")}
                      className="download-icon"
                    >
                      <img src="../assets/img/parking/appstore.svg" />
                    </a>
                  </div>
                </div>
                <div className="col-md-7">
                  <div className="download-img">
                    <img src="../assets/img/parking/mobile-app.png" />
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

export default GoogleApiWrapper({
  apiKey: apiConstants.google_api_key,
})(withToastManager(translate(LandingPage)));

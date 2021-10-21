import React, { Component } from "react";
import api from "../../Environment";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { withToastManager } from "react-toast-notifications";
import ToastDemo from "../Helper/toaster";
import dayjs from "dayjs";
import configuration from "react-global-configuration";
import AddCardForm from "../User/Account/addCardForm";
import AddVehicleForm from "../User/Account/addVehicleForm";
import Helper from "../Helper/Helper";
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import moment from "moment";

var yesterday = moment().subtract( 1, 'day' );
var valid = function( current ){
    return current.isAfter( yesterday );
};
class PaymentPage extends Helper {
  state = {
    loading: true,
    cardList: null,
    cardLoading: true,
    vehiclesList: null,
    vehiclesLoading: true,
    formData: {
      vehicle_type: "",
      vehicle_brand: "",
      vehicle_model: "",
      vehicle_number: "",
    },
    priceCalData: {
      checkin: "",
      checkout: "",
      space_id: 0,
      price_type: "per_hour",
      total_days: 1,
      total_hours: 1,
      total_months: 1,
    },
    activeVehicle: null,
    activeVehicleLoading: true,
    totalPrice: 0,
    actualPrice: 0,
    taxPrice: 0,
    loadingContent: null,
    buttonDisable: false,
    addVehicleButton: false,
    addVehilceLoadingContent: null,
    totalDuration: "1 hr",
    isTotalhrs: true,
    isTotalDays: false,
    isTotalMonths: false,
  };

  stripePromise = loadStripe(
    configuration.get("configData.stripe_publishable_key")
  );

  componentDidMount() {
    if (this.props.location.state) {
      this.setState({ loading: false });
      this.cardsListApi();
      this.vehiclesListApi();
      const priceCalData = { ...this.state.priceCalData };
      priceCalData[
        "space_id"
      ] = this.props.location.state.singleDetails.space_id;
      priceCalData["checkin"] = this.props.location.state.formData.checkin;
      this.setState({ priceCalData });
      this.setState({
        taxPrice: this.props.location.state.singleDetails.tax_price_formatted,
        actualPrice: this.props.location.state.singleDetails.per_hour_formatted,
        totalPrice: this.props.location.state.singleDetails.total_formatted,
      });
    } else {
      // window.location = "/search";
      this.props.history.push("/search");
      ToastDemo(
        this.props.toastManager,
        "Something went wrong. Try again",
        "error"
      );
    }
  }

  //WARNING! To be deprecated in React v17. Use new lifecycle static getDerivedStateFromProps instead.
  componentWillReceiveProps(nextProps) {
    this.cardsListApi();
    this.vehiclesListApi();
  }

  vehiclesListApi = () => {
    if (localStorage.getItem("userLoginStatus")) {
      api.postMethod("vehicles").then((response) => {
        if (response.data.success) {
          this.setState({
            vehiclesList: response.data.data,
            vehiclesLoading: false,
          });
          if (this.state.vehiclesList && this.state.vehiclesList.length > 0) {
            this.setState({
              activeVehicle: this.state.vehiclesList[0],
              activeVehicleLoading: false,
            });
          }
        } else {
          ToastDemo(this.props.toastManager, response.data.error, "error");
        }
      });
    }
  };
  changeVehicle = (event, vehicle) => {
    event.preventDefault();
    this.setState({ activeVehicle: vehicle });
  };

  cardsListApi = () => {
    if (localStorage.getItem("userLoginStatus")) {
      api.postMethod("cards_list").then((response) => {
        if (response.data.success) {
          this.setState({
            cardList: response.data.data,
            cardLoading: false,
          });
        } else {
          this.checkLoginStatus(response.data.error_code);
          ToastDemo(this.props.toastManager, response.data.error, "error");
        }
      });
    }
  };

  changeCard = ({ currentTarget: input }) => {
    console.log("clicked");
    api
      .postMethod("cards_default", { user_card_id: input.value })
      .then((response) => {
        if (response.data.success) {
          ToastDemo(this.props.toastManager, response.data.message, "success");
        } else {
          ToastDemo(this.props.toastManager, response.data.error, "error");
        }
      });
  };

  handleChange = ({ currentTarget: input }) => {
    const priceCalData = { ...this.state.priceCalData };
    priceCalData[input.name] = input.value;
    if (input.name == "price_type") {
      if (input.value == "per_hour") {
        this.setState({
          isTotalhrs: true,
          isTotalDays: false,
          isTotalMonths: false,
        });
      } else if (input.value == "per_day") {
        this.setState({
          isTotalhrs: false,
          isTotalDays: true,
          isTotalMonths: false,
        });
      } else {
        this.setState({
          isTotalhrs: false,
          isTotalDays: false,
          isTotalMonths: true,
        });
      }
    }
    if (input.name == "total_hours") {
      priceCalData[input.name] = input.value <= 23 ? input.value : 1;
    }

    if (input.name == "total_days") {
      priceCalData[input.name] = input.value <= 30 ? input.value : 1;
    }

    this.setState({ priceCalData });
    this.setState({ actualPrice: "Loading..", taxPrice: "Loading..", totalPrice: "Loading..", totalDuration: "Loading.." });
    setTimeout(() => {
      this.spaces_price_calculator();
    }, 1000);
  };

  getDefaultArravingTime = () => {
    let inputDate = this.props.location.state
      ? this.props.location.state.formData.checkin
      : "";
    if (inputDate == null) {
      return "";
    }
    return new Date(inputDate);
  };

  getArrivingDateandTime = (title) => (...args) => {
    this.setState({ actualPrice: "Loading..", taxPrice: "Loading..", totalPrice: "Loadin..", totalDuration: "Loadin.." });
    const priceCalData = { ...this.state.priceCalData };
    const datess = dayjs(args[0]).format("YYYY-MM-DD HH:mm:ss");
    priceCalData["checkin"] = datess;
    this.setState({ priceCalData });
    setTimeout(() => {
      this.spaces_price_calculator();
    }, 1000);
  };

  getOutDateandTime = (title) => (...args) => {
    this.setState({ actualPrice: "Loading..", taxPrice: "Loading..",  totalPrice: "Loadin..", totalDuration: "Loadin.." });
    const priceCalData = { ...this.state.priceCalData };
    const datess = dayjs(args[0]).format("YYYY-MM-DD HH:mm:ss");
    priceCalData["checkout"] = datess;
    this.setState({ priceCalData });
    setTimeout(() => {
      this.spaces_price_calculator();
    }, 1000);
  };

  spaces_price_calculator = () => {
    if (
      this.state.priceCalData.checkin == "" ||
      this.state.priceCalData.price_type == ""
    ) {
      console.log("Heee");
    } else {
      api
        .postMethod("spaces_price_calculator", this.state.priceCalData)
        .then((response) => {
          if (response.data.success) {
            this.setState({
              taxPrice: response.data.data.tax_price_formatted,
              actualPrice: response.data.data.actual_price_formatted,
              totalPrice: response.data.data.total_formatted,
              totalDuration: response.data.data.duration,
            });
          } else {
            ToastDemo(this.props.toastManager, response.data.error, "error");
            this.setState({
              taxPrice: this.props.location.state.singleDetails.tax_price_formatted,
              actualPrice: this.props.location.state.singleDetails.per_hour_formatted,
              totalPrice: this.props.location.state.singleDetails.total_formatted,
              totalDuration: "1 hr",
            });
          }
        });
    }
  };

  bookNow = (event) => {
    event.preventDefault();
    this.setState({
      loadingContent: "Loading... Please wait..",
      buttonDisable: true,
    });
    const { priceCalData } = this.state;
    if (
      priceCalData.checkin == "" ||
      priceCalData.space_id == 0 ||
      this.state.activeVehicle == null
    ) {
      ToastDemo(
        this.props.toastManager,
        "Please add checkin, checkout time and vehicle to proceed..",
        "error"
      );
      this.setState({ loadingContent: null, buttonDisable: false });
    } else {
      const priceCalData = { ...this.state.priceCalData };
      priceCalData[
        "user_vehicle_id"
      ] = this.state.activeVehicle.user_vehicle_id;
      priceCalData["payment_mode"] = "card";
      this.setState({ priceCalData });
      setTimeout(() => {
        this.BookingsCreate();
      }, 1000);
    }
  };

  BookingsCreate = () => {
    api
      .postMethod("spaces_bookings_create", this.state.priceCalData)
      .then((response) => {
        if (response.data.success) {
          ToastDemo(this.props.toastManager, response.data.message, "success");
          this.props.history.push(
            "/history-details/" + response.data.data.booking_id
          );
          this.setState({
            loadingContent: null,
            buttonDisable: false,
          });
        } else {
          ToastDemo(this.props.toastManager, response.data.error, "error");
          this.setState({
            loadingContent: null,
            buttonDisable: false,
          });
        }
      });
  };

  //WARNING! To be deprecated in React v17. Use new lifecycle static getDerivedStateFromProps instead.
  // componentWillReceiveProps(nextProps) {
  //   this.vehiclesListApi();
  // }

  render() {
    const {
      loading,
      cardLoading,
      vehiclesList,
      vehiclesLoading,
      cardList,
      formData,
      activeVehicle,
      activeVehicleLoading,
      loadingContent,
      buttonDisable,
    } = this.state;
    console.log(new Date());
    const singleDetails = this.props.location.state.singleDetails;
    if (loading) {
      return "Loading...";
    } else {
      return (
        <div className="main">
          <div className="container">
            <div className="top-bottom-spacing">
              <h2 className="pay-main-tit">Secure Payment</h2>
              <div className="row">
                <div className="col-md-4">
                  <div className="pay-left">
                    <div className="pay-details-wrap">
                      <div className="pay-location">
                        <p className="loc-name">{singleDetails.space_name}</p>
                      </div>
                      <div className="pay-loc-img">
                        <img src={singleDetails.space_picture} />
                      </div>
                      <div className="pay-loc-date row">
                        <div className="col-md-12 pay-card-opt">
                          <label>Check-In</label>
                          <Datetime
                            onChange={this.getArrivingDateandTime(
                              "Range DatePicker"
                            )}
                            initialValue={this.getDefaultArravingTime()}
                            isValidDate={ valid }
                            dateFormat="DD-MM-YYYY" 
                          />
                        </div>
                        {/* <div className="col-md-6">
                                                    <label>Leaving ON</label>
                                                    <DatePicker
                                                        onChange={this.getOutDateandTime(
                                                        "Range DatePicker"
                                                        )}
                                                        includeTime
                                                    />
                                                    </div> */}
                      </div>

                      <div className="pay-loc-date row">
                        <div className="form-group col-12">
                          <label>Choose Price Type</label>

                          <div className="switch-field">
                            <input
                              type="radio"
                              id="per_hour"
                              name="price_type"
                              value="per_hour"
                              onChange={this.handleChange}
                              defaultChecked
                            />
                            <label htmlFor="Per Hour">Per Hour</label>

                            <input
                              type="radio"
                              id="per_day"
                              name="price_type"
                              value="per_day"
                              onChange={this.handleChange}
                            />
                            <label htmlFor="per_hour">Per Day</label>

                            <input
                              type="radio"
                              id="per_month"
                              name="price_type"
                              value="per_month"
                              onChange={this.handleChange}
                            />
                            <label htmlFor="per_month">Per Month</label>
                          </div>
                        </div>

                        {this.state.isTotalhrs == true ? (
                          <div className="form-group col-12">
                            <label>Enter No of Hrs</label>
                            <p className="text-muted">Min: 1 & Max: 24</p>
                            <input
                              className="form-control"
                              min="1"
                              max="23"
                              step="1"
                              type="number"
                              onChange={this.handleChange}
                              value={this.state.priceCalData.total_hours}
                              name="total_hours"
                            ></input>
                          </div>
                        ) : (
                          ""
                        )}

                        {this.state.isTotalDays == true ? (
                          <div className="form-group col-12">
                            <label>Enter No Of Days</label>
                            <p className="text-muted">Min: 1 & Max: 30</p>
                            <input
                              className="form-control"
                              min="1"
                              max="30"
                              step="1"
                              type="number"
                              onChange={this.handleChange}
                              value={this.state.priceCalData.total_days}
                              name="total_days"
                            ></input>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>

                      <div className="pay-duration text-center">
                        <h4 className="park-sub-tit">
                          {/* {this.state.totalDuration} */}
                          {this.state.isTotalhrs == true ? (
                            <p>{this.state.priceCalData.total_hours} Hrs</p>
                          ) : (
                            ""
                          )}
                          {this.state.isTotalDays == true ? (
                            <p>{this.state.priceCalData.total_days} Days</p>
                          ) : (
                            ""
                          )}
                          {this.state.isTotalMonths == true ? (
                            <p>1 Month</p>
                          ) : (
                            ""
                          )}
                        </h4>
                        <p className="park-txt">Total Duration</p>
                      </div>
                      <div className="pay-price text-right">
                        <h3 className="">
                          <span>Actual Price:</span> {this.state.actualPrice}
                        </h3>
                      </div>
                      <div className="pay-price text-right">
                        <h3 className="">
                          <span>Tax Price:</span> {this.state.taxPrice}
                        </h3>
                      </div>
                      <div className="pay-price text-right">
                        <h3 className="">
                          <span>Total Price:</span> {this.state.totalPrice}
                        </h3>
                      </div>
                    </div>

                    <div className="pay-right-btm">
                      <div className="safe-box resp-mrg-bottom-large">
                        <div className="safe-img">
                          <img
                            src={
                              window.location.origin + "/assets/img/shield.svg"
                            }
                          />
                        </div>
                        <div className="safe-content">
                          <h6>
                            Reserving parking with
                            {configuration.get("configData.site_name")} is safe
                            and secure!
                          </h6>
                          <p>
                            {/* <a href="#" className="green-link"> Read about our cancellation policy </a> */}
                          </p>
                        </div>
                      </div>
                      <ul className="list-unstyled secure-list">
                        <li>
                          <i className="flaticon-tick" />
                          <span>
                            Full refund on short term bookings before start time
                          </span>
                        </li>
                        <li>
                          <i className="flaticon-tick" />
                          <span>Trusted by over 2.5 million motorists</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="pay-right">
                    <div className="pay-right-box">
                      <div className="pay-head row">
                        <div className="col-sm-6 col-xs-12 pay-head-left">
                          <h4 className="pay-tit">1. Vehicle Information</h4>
                        </div>

                        <div className="col-sm-6 col-xs-12 pay-head-right">
                          <a
                            href="#"
                            data-toggle="modal"
                            data-target="#AddVehicleModal"
                            className="green-link edit-link float-right"
                          >
                            Add a new vehicle
                          </a>

                          <AddVehicleForm {...this.props} />
                         
                        </div>
                      </div>
                      <div className="pay-det-block">
                        <div className="pay-det-group">
                          {/* <label>
                                                        {localStorage.getItem(
                                                            "username"
                                                        )}
                                                    </label> */}
                          {/* <p>johndoe@gmail.com</p> */}
                        </div>
                        {/* <div className="pay-det-group">
                                                    <label>Phone Number</label>
                                                    <div className="row">
                                                        <div className="col-sm-8">
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="Phone Number"
                                                        />
                                                        </div>
                                                    </div>
                                                    </div> */}

                        {vehiclesLoading ? (
                          "Loading..."
                        ) : vehiclesList.length > 0 ? (
                          <div className="pay-det-group">
                            <label>Select Vehicle</label>
                            <div className="row">
                              {vehiclesList.map((vehicle, index) => (
                                <a
                                  href="#"
                                  key={index}
                                  className={
                                    activeVehicleLoading
                                      ? ""
                                      : activeVehicle.user_vehicle_id ==
                                        vehicle.user_vehicle_id
                                      ? "sel-vehicle col-5 active"
                                      : "sel-vehicle col-5"
                                  }
                                  onClick={(event) =>
                                    this.changeVehicle(event, vehicle)
                                  }
                                >
                                  <h3>{vehicle.vehicle_number}</h3>
                                  <p className="grey-txt">
                                    {vehicle.vehicle_model}
                                  </p>
                                  <p className="grey-txt">
                                    {vehicle.vehicle_type}
                                  </p>
                                </a>
                              ))}
                            </div>
                          </div>
                        ) : (
                          "Please add vechile"
                        )}
                      </div>
                    </div>
                    <div className="pay-right-box">
                      <div className="pay-head row">
                        <div className="col-sm-6 col-xs-12 pay-head-left">
                          <h4 className="pay-tit">2. Payment Information</h4>
                        </div>
                        <div className="col-sm-6 col-xs-12 pay-head-right text-right">
                          <a
                            href="#"
                            data-toggle="modal"
                            data-target="#AddCardModel"
                            className="green-link edit-link"
                          >
                            add a card
                          </a>
                         
                            <Elements stripe={this.stripePromise}>
                              <AddCardForm {...this.props} />
                            </Elements>
                        </div>
                      </div>
                      <div className="pay-det-block">
                        <div className="pay-det-group pay-method row">
                          {cardLoading
                            ? "Loading..."
                            : cardList.cards.length > 0
                            ? cardList.cards.map((card) => (
                                <div
                                  className="col-md-6"
                                  key={card.user_card_id}
                                >
                                  <div className="form-check form-check-inline add-list-block m-0">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="card"
                                      value={card.user_card_id}
                                      id={card.user_card_id}
                                      defaultChecked={
                                        card.is_default == 1 ? true : false
                                      }
                                      onChange={this.changeCard}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor={card.user_card_id}
                                    >
                                      XXXX...
                                      {card.last_four}
                                    </label>
                                  </div>
                                </div>
                              ))
                            : "Please add card to continue"}
                        </div>

                        <div className="pay-det-group">
                          <button
                            className="green-btn"
                            onClick={this.bookNow}
                            disabled={this.state.buttonDisable}
                          >
                            {this.state.loadingContent != null
                              ? this.state.loadingContent
                              : "Pay Now"}
                          </button>
                        </div>
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
}

export default withToastManager(PaymentPage);

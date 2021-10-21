import React, { Component } from "react";

import { Link } from "react-router-dom";

import Loader from "../../Helper/Loader";

import api from "../../../Environment";
import ToastDemo from "../../Helper/toaster";
import { withToastManager } from "react-toast-notifications";
import Helper from "../../Helper/Helper";
import configuration from "react-global-configuration";
import { translate, t } from "react-multi-lang";

const $ = window.$;
const onlyDay = {
  weekday: "long"
};
const onlyMonth = {
  month: "short"
};
const onlyDate = {
  day: "numeric"
};

class Checkout extends Helper {
  constructor(props) {
    super(props);

    // States and props usage
  }
  state = {
    loading: true,
    adults: 0,
    children: 0,
    infants: 0,
    apiResponses: null,
    apiCallStatus: true,
    total_days_price: null,
    total_guest: null,
    total_days: null,
    total: null,
    description: null,
    step: 1,
    cardList: null,
    cardLoading: true
  };

  componentDidMount() {
    // Call api function

    if (this.props.location.state) {
      this.setState({
        loading: false,
        adults: this.props.location.state.adults,
        children: this.props.location.state.children,
        infants: this.props.location.state.infants
      });
      this.listCardApi();
    } else {
      this.props.history.goBack();
    }
  }

  listCardApi = () => {
    api.postMethod("cards_list").then(response => {
      if (response.data.success) {
        this.setState({
          cardList: response.data.data,
          cardLoading: false
        });
        if (response.data.data.cards.length < 1) {
          ToastDemo(
            this.props.toastManager,
            "There is no card in your account. Please add card and try again.. ",
            "error"
          );
          this.props.history.push("/user-payment");
        }
      } else {
        ToastDemo(
          this.props.toastManager,
          "Something went wrong please try again..",
          "error"
        );
        this.props.history.goBack();
      }
    });
  };

  nextStep = event => {
    event.preventDefault();
    this.setState({ step: 2 });
  };
  prevStep = event => {
    event.preventDefault();
    this.setState({ step: 1 });
  };

  priceCal = async () => {
    const inputDate = {
      adults: this.state.adults,
      children: this.state.children,
      checkin: this.props.location.state.apiResponse.checkin,
      checkout: this.props.location.state.apiResponse.checkout,
      space_id: this.props.location.state.apiResponse.space_id
    };
    await api.postMethod("host_price_calculator", inputDate).then(response => {
      if (response.data.success) {
        this.setState({
          total_days_price: response.data.data.total_days_price,
          apiResponses: response.data.data,
          total_days: response.data.data.total_days,
          total_guests: response.data.data.total_guests,
          total: response.data.data.total,
          apiCallStatus: false
        });
      } else {
        ToastDemo(this.props.toastManager, response.data.error, "error");
      }
    });
  };

  bookingCreate = event => {
    event.preventDefault();
    const inputData = {
      adults: this.state.adults,
      children: this.state.children,
      infants: this.state.infants,
      checkin: this.props.location.state.apiResponse.checkin,
      checkout: this.props.location.state.apiResponse.checkout,
      space_id: this.props.location.state.apiResponse.space_id,
      payment_mode: "card",
      total_guests: this.props.location.state.apiResponse.total_guests,
      description: this.state.description,
      step: 5
    };
    api.postMethod("bookings_create", inputData).then(response => {
      if (response.data.success) {
        ToastDemo(this.props.toastManager, "Booking successfull", "success");
        this.props.history.push("/history");
      } else {
        ToastDemo(this.props.toastManager, response.data.error, "error");
        if (
          response.data.error_code == 1004 ||
          response.data.error_code == 1002
        ) {
          this.props.history.push("/");
          ToastDemo(this.props.toastManager, "Please login to book", "error");
        }
      }
    });
  };

  handleChange = ({ currentTarget: input }) => {
    this.setState({ description: input.value });
  };

  changeCard = ({ currentTarget: input }) => {
    api
      .postMethod("cards_default", { user_card_id: input.value })
      .then(response => {
        if (response.data.success) {
          ToastDemo(this.props.toastManager, response.data.message, "success");
        } else {
          ToastDemo(this.props.toastManager, response.data.error, "error");
        }
      });
  };

  render() {
    const {
      loading,
      loadingStatus,
      loadingContent,
      adults,
      children,
      infants,
      apiCallStatus,
      step,
      cardList,
      cardLoading
    } = this.state;
    if (loading) {
      return "Loading...";
    } else {
      const {
        basicDetails,
        apiResponse,
        providerDetails
      } = this.props.location.state;

      return (
        <div>
          <div className="display-inline pad-1">
            <div className="checkout-left">
              <Link className="navbar-brand" to={"/"}>
                <img
                  data-src={window.location.origin + "/assets/site/favicon.png"}
                  src={configuration.get("configData.site_icon")}
                />
              </Link>
            </div>
            <div className="stepwizard checkout-left">
              <div className="stepwizard-row setup-panel">
                <div className="stepwizard-step">
                  <a
                    href="#step-1"
                    className={
                      step == 1 ? "checkout-head active" : "checkout-head"
                    }
                    onClick={this.prevStep}
                  >
                    1. {t("review_trip_details")}
                    <span>
                      <i className="fas fa-chevron-right ml-3 mr-3" />
                    </span>
                  </a>
                </div>
                <div className="stepwizard-step">
                  <a
                    href="#step-3"
                    className={
                      step == 2 ? "checkout-head active" : "checkout-head"
                    }
                    onClick={this.nextStep}
                  >
                    2. {t("confirm_and_pay")}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="site-content">
            <div className="row">
              <div className="col-sm-12 col-md-6 col-lg-7 col-xl-7">
                <form className="checkout-form" onSubmit={this.bookingCreate}>
                  <div className="mediLink common-msg">
                    <img
                      src="../../../assets/img/dimand.gif"
                      alt="John Doe"
                      className="mr-3 align-self-center common-img"
                    />
                    <div className="media-body">
                      <h4 className="common-text">
                        <span className="bold-cls">
                          {t("this_is_link_rare_find")}
                        </span>{" "}
                        {providerDetails.provider_name}'s place is usually
                        booked.
                      </h4>
                    </div>
                  </div>
                  <div className="">
                    {step == 1 ? (
                      <div className="panel-primary setup-content" id="step-1">
                        <h1 className="checkout-section-head">
                          {t("review_trip_details")}
                        </h1>
                        {/* Calendar section */}
                        <div>
                          <h4 className="checkout-section-subhead">
                            {apiResponse.total_days} in{" "}
                            {basicDetails.space_location}
                          </h4>

                          <div className="row">
                            <div className="col-md-6">
                              <div className="booking-calendar-div">
                                <div className="booking-calendar-div-section">
                                  <p>
                                    {new Date(
                                      apiResponse.checkin
                                    ).toLocaleDateString("en-US", onlyMonth)}
                                  </p>
                                  <p>
                                    {new Date(
                                      apiResponse.checkin
                                    ).toLocaleDateString("en-US", onlyDate)}
                                  </p>
                                </div>
                              </div>
                              <div className="booking-calendar-text-section">
                                <div>
                                  <p>
                                    {new Date(
                                      apiResponse.checkin
                                    ).toLocaleDateString("en-US", onlyDay)}{" "}
                                    check-in
                                  </p>
                                  <h4>{apiResponse.checkin_time}</h4>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="booking-calendar-div">
                                <div className="booking-calendar-div-section">
                                  <p>
                                    {new Date(
                                      apiResponse.checkout
                                    ).toLocaleDateString("en-US", onlyMonth)}
                                  </p>
                                  <p>
                                    {new Date(
                                      apiResponse.checkout
                                    ).toLocaleDateString("en-US", onlyDate)}
                                  </p>
                                </div>
                              </div>
                              <div className="booking-calendar-text-section">
                                <div>
                                  <p>
                                    {new Date(
                                      apiResponse.checkout
                                    ).toLocaleDateString("en-US", onlyDay)}{" "}
                                    {t("checkout")}
                                  </p>
                                  <h4>{apiResponse.checkout_time}</h4>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <hr />

                        <div>
                          <div className="media">
                            <div className="media-body">
                              <h4 className="medium-cls">
                                {t("say_hello_to_your_host")}
                              </h4>
                              <p>
                                Let {providerDetails.provider_name} {t("say_hello_to_your_host_para")}
                              </p>
                            </div>
                            <img
                              src={providerDetails.picture}
                              className=" ml-3 rounded-circle review-img1"
                            />
                          </div>
                          <div className="form-group">
                            <textarea
                              className="form-control"
                              rows="5"
                              id="comment"
                              name="description"
                              onChange={this.handleChange}
                            />
                          </div>
                        </div>

                        {/* Guest details + description */}

                        <button
                          className="green-btn nextBtn checkout-btn"
                          type="button"
                          onClick={this.nextStep}
                        >
                          {t("agree_and_continue")}
                        </button>
                      </div>
                    ) : (
                      ""
                    )}
                    {step == 2 ? (
                      <div className="setup-content" id="step-2">
                        <h1 className="checkout-section-head">
                          {t("confirm_and_pay")}
                        </h1>
                        <div className="form-group">
                          <label>pay with</label>
                          {cardLoading
                            ? t("loading")
                            : cardList.cards.length > 0
                            ? cardList.cards.map(card => (
                                <div
                                  className="form-check add-list-block"
                                  key={card.user_card_id}
                                >
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
                                    className="form-check-label row"
                                    htmlFor={card.user_card_id}
                                  >
                                    <h5 className="flow-check-tit">
                                      XXXX....{card.last_four}
                                    </h5>
                                  </label>
                                  <div className="clear-both" />
                                </div>
                              ))
                            : ""}
                        </div>

                        <h4 className="checkout-text">
                          {t("cancellation_policy")}
                        </h4>
                        <h4 className="checkout-para">
                          {t("cancellation_policy_para")}
                        </h4>

                        <h5 className="checkout-smalltext">
                          {t("complete_payment_para1")}
                          <span className="bold-cls">
                            {t("complete_payment_para2")}
                          </span>
                        </h5>

                        <h5 className="checkout-smalltext">
                          {t("i_agree")}
                          <Link to="#"> {t("house_rules")},</Link>
                          <Link to="#"> {t("cancellation_policy")}, </Link> and to the
                          <Link to="#"> {t("guest_refund_policy")}.</Link>{t("i_agree_para")}
                        </h5>

                        <button className="pink-btn checkout-btn">
                          {t("confirm_and_pay")}
                        </button>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </form>
              </div>

              <div className="col-sm-12 col-md-6 col-lg-5 col-xl-5">
                <div className="checkout-box pricedetails-box">
                  <div className="media">
                    <div className="media-body">
                      <h4 className="mt-0 captalize bold-cls">
                        {basicDetails.space_name}{" "}
                      </h4>
                      <p className="captalize">{basicDetails.space_type}</p>

                      <h5 className="rating-sec">
                        <span className="rating-star">
                          {this.starRatingHost(basicDetails.overall_ratings)}
                        </span>
                        <span>&nbsp;{basicDetails.total_ratings} {t("reviews")}</span>
                      </h5>
                    </div>
                    <img
                      src={basicDetails.space_picture}
                      alt="John Doe"
                      className="ml-3 review-img3"
                    />
                  </div>

                  <p className="overview-line" />
                  <h5 className="choosen-details">
                    <i className="fas fa-user mr-3" />
                    {apiCallStatus
                      ? apiResponse.total_guests
                      : this.state.total_guests}
                    guests
                  </h5>
                  <h5 className="choosen-details">
                    <i className="far fa-calendar-alt mr-3" />
                    {apiResponse.checkin}
                    <i className="fas fa-arrow-right ml-3 mr-3" />
                    {apiResponse.checkout}
                  </h5>

                  <p className="overview-line" />

                  <div className="row">
                    <div className="col-6">
                      <h5 className="choosen-details">
                        {apiResponse.per_day} x{" "}
                        {apiCallStatus
                          ? apiResponse.total_days
                          : this.state.total_days}
                      </h5>
                      {/* <h5 className="choosen-details">Cleaning fee</h5> */}
                      {/* <h5 className="">Service fee</h5> */}
                    </div>
                    <div className="col-6 text-right">
                      <h5 className="choosen-details">
                        {apiResponse.total_days_price}
                      </h5>
                      {/* <h5 className="choosen-details">
                        {apiResponse.cleaning_fee}
                      </h5>
                      <h5 className="">{apiResponse.service_fee}</h5> */}
                    </div>
                  </div>

                  <p className="overview-line" />
                  <div className="row">
                    <div className="col-6">
                      <h5 className="choosen-details">{t("total")}</h5>
                    </div>
                    <div className="col-6 text-right">
                      <h5 className="choosen-details">
                        {apiCallStatus ? apiResponse.total : this.state.total}
                      </h5>
                    </div>
                  </div>
                  <h6 className="top">
                    {t("checkout_para")}
                  </h6>
                </div>
              </div>
              <div className="clearfix" />
            </div>
          </div>
        </div>
      );
    }
  }
}

export default withToastManager(translate(Checkout));

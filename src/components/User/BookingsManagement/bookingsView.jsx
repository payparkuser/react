import React, { Component } from "react";
import api from "../../../Environment";
import { Link } from "react-router-dom";
import { withToastManager } from "react-toast-notifications";
import ToastDemo from "../../Helper/toaster";
import SingleTripPageMap from "../../Helper/singleTripPageMap";
import BookingsReviewModal from "./bookingsReviewModal";
import { translate, t } from "react-multi-lang";
class BookingsView extends Component {
  state = {
    booking_details: null,
    loading: true,
    checkinBtnStatus: 0,
    checkoutBtnStatus: 0,
    cancelBtnStatus: 0,
    reviewBtnStatus: 0,
    messageBtnStatus: 0,
    CheckinApiCalled: false,
    CheckoutApiCalled: false,
    reviewApiCalled: false,
    cancelApiCalled: false
  };

  componentDidMount() {
    this.getSingleHistoryDetailsApiCall();
  }

  getSingleHistoryDetailsApiCall = () => {
    api
      .postMethod("bookings_view", { booking_id: this.props.match.params.id })
      .then(response => {
        if (response.data.success) {
          let booking_details_data = response.data.data;
          this.setState({
            booking_details: booking_details_data,
            loading: false
          });
        }
      });
  };

  bookingCheckin = event => {
    event.preventDefault();
    api
      .postMethod("bookings_checkin", {
        booking_id: this.props.match.params.id
      })
      .then(response => {
        if (response.data.success) {
          this.getSingleHistoryDetailsApiCall();
          ToastDemo(this.props.toastManager, response.data.message, "success");
        } else {
          ToastDemo(this.props.toastManager, response.data.error, "error");
        }
      });
  };

  bookingCheckout = event => {
    event.preventDefault();
    api
      .postMethod("bookings_checkout", {
        booking_id: this.props.match.params.id
      })
      .then(response => {
        if (response.data.success) {
          this.getSingleHistoryDetailsApiCall();
          ToastDemo(this.props.toastManager, response.data.message, "success");
        } else {
          ToastDemo(this.props.toastManager, response.data.error, "error");
        }
      });
  };
  bookingCancel = event => {
    event.preventDefault();
    api
      .postMethod("bookings_cancel", {
        booking_id: this.props.match.params.id
      })
      .then(response => {
        if (response.data.success) {
          this.getSingleHistoryDetailsApiCall();
          ToastDemo(this.props.toastManager, response.data.message, "success");
        } else {
          ToastDemo(this.props.toastManager, response.data.error, "error");
        }
      });
  };

  bookingReview = event => {
    event.preventDefault();
    api
      .postMethod("bookings_rating_report", {
        booking_id: this.props.match.params.id
      })
      .then(response => {
        if (response.data.success) {
          this.getSingleHistoryDetailsApiCall();
          window.location.reload();
          ToastDemo(this.props.toastManager, response.data.message, "success");
        } else {
          ToastDemo(this.props.toastManager, response.data.error, "error");
        }
      });
  };

  render() {
    const { booking_details, loading } = this.state;
    return (
      <div className="main">
        <div className="singlehome-img-sec">
          <img
            src={loading ? "Loading" : booking_details.picture}
            alt="image"
            className="homes-img br-0"
          />
          <div className="top-right">
            <Link
              to={{
                pathname: "/single-trip/chat",
                state: {
                  booking_details: booking_details,
                  page: "history"
                }
              }}
              className="white-btn btn-small m-2"
            >
              <i className="far fa-comment" />
              &nbsp; chat
            </Link>
          </div>
        </div>

        <div className="site-content">
          <div className="top-bottom-spacing">
            <div className="row">
              {loading ? (
                t("loading")
              ) : (
                <div className="col-xl-7 col-lg-10 col-md-10 auto-margin">
                  <div className="media">
                    <div className="media-body mr-3">
                      <a href="#">
                        <p className="red-text txt-overflow">
                          #{booking_details.booking_unique_id}
                        </p>
                      </a>
                      <h1 className="category-section-head">
                        {booking_details.space_name}
                      </h1>
                      <h4 className="captalize section-subhead">
                        {booking_details.full_address}
                      </h4>
                      <p>{booking_details.booking_description}</p>
                    </div>
                    <div>
                      <Link
                        to={`/provider-profile/${booking_details.provider_details.provider_id}`}
                      >
                        <img
                          src={booking_details.provider_details.picture}
                          alt={booking_details.provider_details.provider_name}
                          className="mt-3 rounded-circle review-img"
                        />
                        <p className="text-center top3 mb-0">
                          <a href="#" className="other-proname">
                            {booking_details.provider_details.provider_name}
                          </a>
                        </p>
                      </Link>
                    </div>
                  </div>
                  <div className="row">
                    {booking_details.buttons.checkin_btn_status == 1 ? (
                      <div className="col-md-6">
                        <button
                          className="green-btn btn-block"
                          onClick={this.bookingCheckin}
                        >
                          {t("checkin")}
                        </button>
                      </div>
                    ) : (
                      ""
                    )}
                    {booking_details.buttons.checkout_btn_status == 1 ? (
                      <div className="col-md-6">
                        <button
                          className="green-btn btn-block"
                          onClick={this.bookingCheckout}
                        >
                          {t("checkout")}
                        </button>
                      </div>
                    ) : (
                      ""
                    )}
                    {booking_details.buttons.review_btn_status == 1 ? (
                      <div className="col-md-6">
                        <a
                          className="green-btn btn-block"
                          href="#"
                          data-toggle="modal"
                          data-target="#BookingsReviewModal"
                        >
                          {t("review")}
                        </a>
                      </div>
                    ) : (
                      ""
                    )}

                    {booking_details.buttons.cancel_btn_status == 1 ? (
                      <div className="col-md-6">
                        <button
                          className="danger-outline-btn btn-block"
                          onClick={this.bookingCancel}
                        >
                          {t("cancel")}
                        </button>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="highlights-box">
                    <h2 className="chathead mt-0">{t("parking_details")}</h2>
                    <p className="overview-line" />
                    <div className="single-box">
                      <h5 className="single-box-tit">{t("vehicle_details")}</h5>
                      {booking_details.vehicle_details ? 

                      <div>
                        <p className="single-box-txt">
                            {t("brand")} {booking_details.vehicle_details.vehicle_brand}
                        </p>
                        <p className="single-box-txt">
                            {t("model")} {booking_details.vehicle_details.vehicle_model}
                        </p>
                        <p className="single-box-txt">
                            {t("number")} {booking_details.vehicle_details.vehicle_number}
                        </p>
                        </div>
                        : t("vehicle_deleted")}
                    </div>
                    <div className="single-box">
                          <h5 className="single-box-tit">{t("space_access_details")}</h5>

                          {booking_details.space_dimension ? 
                            <p className="single-box-txt">
                              {t("size")}{" "}
                              {booking_details.space_dimension}
                            </p>
                          : "" }

                          {booking_details.access_method ? 
                            <p className="single-box-txt">
                              {t("access_method")}{" "}
                              {booking_details.access_method}
                            </p>
                          : "" }
                          {booking_details.space_type ?
                            <p className="single-box-txt">
                              {t("space_type")}{" "}
                              {booking_details.space_type}
                            </p>
                          : "" }
                          {booking_details.space_owner_type ? 
                            <p className="single-box-txt">
                              {t("business_type")}{" "}
                              {booking_details.space_owner_type}
                            </p>
                          : ""}
                          {booking_details.access_instructions ? 
                          <p className="single-box-txt">
                            {t("access_instructions")}{" "}
                            {booking_details.access_instructions}
                          </p>
                          : ""}
                        </div>
                    <p className="overview-line" />
                          <h5 className="choosen-details">{booking_details.booking_type_text}</h5>
                    <h5 className="choosen-details">
                      <i className="far fa-calendar-alt mr-3" />
                      {booking_details.checkin} {booking_details.checkin_time}

                      <i className="fas fa-arrow-right ml-3 mr-3" />
                      {booking_details.checkout} {booking_details.checkout_time}
                    </h5>

                    <p className="overview-line" />
                    <div className="row">
                      <div className="col-6">
                        <h5 className="choosen-details">{t("status")}</h5>
                        <h5 className="choosen-details">{t("price_type")}</h5>
                        <h5 className="choosen-details">{t("payment_mode")}</h5>
                        <h5 className="choosen-details">{t("payment_id")}</h5>
                      </div>

                      <div className="col-6 text-right">
                        <h5 className="choosen-details text-success">
                          {booking_details.status_text}
                        </h5>
                        <h5 className="choosen-details text-success">
                          {booking_details.price_type}
                        </h5>
                        <h5 className="choosen-details">
                          {booking_details.pricing_details.payment_mode}
                        </h5>
                        <h5 className="choosen-details">
                          {booking_details.pricing_details.payment_id}
                        </h5>
                      </div>
                    </div>

                    <p className="overview-line" />
                    <div className="row">
                      <div className="col-6">
                        <h5 className="choosen-details">{booking_details.price_type}</h5>
                        <h5 className="choosen-details">{t("duration")}</h5>
                        <h5 className="choosen-details">{t("tax_price")}</h5>
                      </div>
                      <div className="col-6 text-right">
                        <h5 className="choosen-details">
                          {booking_details.pricing_details.price_type_amount_formatted}
                        </h5>
                        <h5 className="choosen-details">
                          {booking_details.duration}
                        </h5>
                        <h5 className="choosen-details">
                          {booking_details.pricing_details.tax_price_formatted}
                        </h5>
                        
                      </div>
                    </div>

                    <p className="overview-line" />
                    <div className="row">
                      <div className="col-6">
                        <h5 className="choosen-details">{t("total")}</h5>
                      </div>
                      <div className="col-6 text-right">
                        <h5 className="choosen-details">
                          {
                            booking_details.pricing_details
                              .paid_amount_formatted
                          }
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {loading ? (
                "Loading"
              ) : (
                <div className="col-xl-5 pl-5 relative">
                  <div className="trips-map-img">
                    {/* <img
                      src={window.location.origin + "/assets/img/map.png"}
                      className="homes-img"
                    /> */}
                    <SingleTripPageMap location={booking_details} />
                  </div>
                </div>
              )}
              <BookingsReviewModal booking_id={this.props.match.params.id} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withToastManager(translate(BookingsView));

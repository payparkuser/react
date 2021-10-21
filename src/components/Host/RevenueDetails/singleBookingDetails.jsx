import React, { Component } from "react";
import api from "../../../HostEnvironment";
import { Link } from "react-router-dom";
import Loader from "../../Helper/Loader";
import { withToastManager } from "react-toast-notifications";
import ToastDemo from "../../Helper/toaster";
import HostHelper from "../../Helper/hostHelper";
import ReviewModel from "./reviewModel";
import { apiConstants } from "../../Constant/constants";
import { translate, t } from "react-multi-lang";

class HostSingleBookingDetails extends HostHelper {
  state = {
    loading: true,
    booking_details: null,
    cancelBtnStatus: 0,
    reviewBtnStatus: 0,
    messageBtnStatus: 0,
    messageApiCalled: false,
    reviewApiCalled: false,
    cancelApiCalled: false
  };
  componentDidMount() {
    this.getBookingDetailsApiCall();
  }
  getBookingDetailsApiCall = () => {
    api
      .postMethod("bookings_view", { booking_id: this.props.match.params.id })
      .then(response => {
        if (response.data.success) {
          this.setState({
            booking_details: response.data.data,
            loading: false
          });
        }
      });
  };
  bookingCancel = event => {
    event.preventDefault();
    api
      .postMethod("bookings_cancel", { booking_id: this.props.match.params.id })
      .then(response => {
        if (response.data.success) {
          this.getBookingDetailsApiCall();
          ToastDemo(this.props.toastManager, response.data.message, "success");
        } else {
          ToastDemo(this.props.toastManager, response.data.error, "error");
        }
      });
  };

  requestAccepted = event => {
    event.preventDefault();
    api
      .postMethod("bookings_approve", {
        booking_id: this.props.match.params.id
      })
      .then(response => {
        if (response.data.success) {
          this.getBookingDetailsApiCall();
          ToastDemo(this.props.toastManager, response.data.message, "success");
        } else {
          ToastDemo(this.props.toastManager, response.data.error, "error");
        }
      });
  };

  requestRejected = event => {
    event.preventDefault();
    api
      .postMethod("bookings_reject", {
        booking_id: this.props.match.params.id
      })
      .then(response => {
        if (response.data.success) {
          this.getBookingDetailsApiCall();
          ToastDemo(this.props.toastManager, response.data.message, "success");
        } else {
          ToastDemo(this.props.toastManager, response.data.error, "error");
        }
      });
  };

  render() {
    let load = new Loader();
    const { loading, booking_details } = this.state;
    return (
      <div className="main">
        <div className="site-content">
          <div className="top-bottom-spacing single-booking">
            <div className="single-book-nav">
              <Link to={"/host/booking-management"} className="back-link">
                <i className="fas fa-chevron-left" /> {t("back")}
              </Link>
            </div>
            <div className="single-booking-content">
              {loading ? (
                ""
              ) : (
                <div>
                  <h3 className="single-place-tit red-text">
                    #{booking_details.booking_unique_id}
                  </h3>
                  <div className="row">
                    <div className="col-md-8">
                      <div className="single-book-left">
                        <div className="single-box">
                          <h6 className="single-note">
                            {booking_details.sub_category_name}
                          </h6>
                          <h3 className="single-place-tit">
                            {booking_details.space_name}
                          </h3>
                          <h5 className="single-place-txt">
                            {booking_details.booking_description}
                          </h5>
                          <p className="single-place-txt">
                            {booking_details.location}
                          </p>
                          {/* <p className="single-place-txt">United Statses</p> */}
                        </div>
                        <div className="single-box">
                          <h5 className="single-box-tit">Vehicle Details</h5>
                          {booking_details.vehicle_details ? 

                            <div>
                            <p className="single-box-txt">
                                Brand:{" "}
                                {booking_details.vehicle_details.vehicle_brand}
                            </p>
                            <p className="single-box-txt">
                                Model:{" "}
                                {booking_details.vehicle_details.vehicle_model}
                            </p>
                            <p className="single-box-txt">
                                Number:{" "}
                                {booking_details.vehicle_details.vehicle_number}
                            </p>
                            </div>
                            :t("vehicle_deleted")}
                        </div>
                        
                        <div className="single-box">
                          <div id="host">
                            <div className="media">
                              <div className="media-body">
                                <h1 className="section-head host-bottom">
                                  {t("booked_by")}{" "}
                                  {booking_details.user_details.user_name}
                                </h1>
                                <h4 className="host-text">
                                  {t("joined_in")}{" "}
                                  {booking_details.user_details.joined}
                                </h4>
                                <h4 className="host-text mb-0">
                                  <span className="text-success">
                                    <i className="fas fa-phone small1 align-3 mr-05" />
                                    {booking_details.user_details.mobile}
                                  </span>
                                </h4>
                              </div>
                              <Link
                                to={`/profile/${booking_details.user_details.user_id}`}
                              >
                                <img
                                  src={booking_details.user_details.picture}
                                  alt={booking_details.user_details.user_name}
                                  className="ml-3 rounded-circle review-img"
                                />
                              </Link>
                            </div>

                            <p className="overview-line" />
                            <h4 className="host-text">
                              {booking_details.user_details.description}
                            </h4>
                          </div>
                        </div>
                        <div className="single-box row">
                            {booking_details.buttons.approve_reject_btn_status ==
                            1 ? (
                                <React.Fragment>
                                <div className="col-md-6">
                                    <Link
                                    className="green-outline-btn btn-block m-0"
                                    to={""}
                                    onClick={e =>
                                        window.confirm("Are you sure you want to approve this booking?") &&
                                        this.requestAccepted(e)
                                      }
                                    >
                                    {t("accept")}
                                    </Link>
                                </div>
                                <div className="col-md-6">
                                    <Link
                                    className="danger-outline-btn btn-block"
                                    to={""}
                                    onClick={e =>
                                        window.confirm("Are you sure you want to reject this booking?") &&
                                        this.requestRejected(e)
                                      }
                                    >
                                    {t("accept")}
                                    </Link>
                                </div>
                                </React.Fragment>
                            ) : (
                                ""
                            )}
                        </div>
                        <div className="single-box row">
                          {booking_details.buttons.review_btn_status == 1 ? (
                            <div className="col-md-6">
                              {/* <button
                                className="green-btn btn-block"
                                onClick={this.bookingReview}
                              > */}
                              <a
                                className="green-btn btn-block"
                                href="#"
                                data-toggle="modal"
                                data-target="#reviewModel"
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
                                onClick={e =>
                                  window.confirm("Are you sure?") &&
                                  this.bookingCancel(e)
                                }
                              >
                                {t("cancel")}
                              </button>
                            </div>
                          ) : (
                            ""
                          )}
                          {booking_details.buttons.message_btn_status == 1 ? (
                            <div className="col-md-6">
                              <Link
                                className="green-btn btn-block"
                                to={{
                                  pathname: "/host/single/chat",
                                  state: {
                                    booking_details: booking_details,
                                    page: "singletrip"
                                  }
                                }}
                              >
                                {t("chat")}
                              </Link>
                            </div>
                          ) : ("")}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="single-book-right">
                        <div className="single-book-img">
                          <img src={booking_details.space_picture} />
                        </div>
                        <div className="single-right-wrap">
                          <div className="check-block row">
                            <div className="col-md-6">
                              <div className="single-box">
                                <h5 className="single-box-sub-tit">Check in</h5>
                                <p className="single-box-sub-txt">
                                  {booking_details.checkin}
                                </p>
                                <p className="single-box-sub-txt">
                                  {booking_details.checkin_time}
                                </p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="single-box">
                                <h5 className="single-box-sub-tit">
                                  {t("check_out")}
                                </h5>
                                <p className="single-box-sub-txt">
                                  {booking_details.checkout}
                                </p>
                                <p className="single-box-sub-txt">
                                  {booking_details.checkout_time}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="table-responsive single-billing-table check-block">
                            <table className="table">
                              <tbody>
                                <tr>
                                  <td>Duration</td>
                                  <td className="text-right text-success">
                                    {booking_details.duration}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Status</td>
                                  <td className="text-right text-success">
                                    {booking_details.status_text}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Payment Mode</td>
                                  <td className="text-right">
                                    {
                                      booking_details.pricing_details
                                        .payment_mode
                                    }
                                  </td>
                                </tr>

                                <tr>
                                  <td>
                                    {t("price_type")}
                                  </td>
                                  <td className="text-right">
                                    {booking_details.price_type_text}
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    {t("total")}
                                  </td>
                                  <td className="text-right">
                                    {booking_details.pricing_details.paid_amount_formatted}
                                  </td>
                                </tr>
                              </tbody>
                              <tfoot>
                                <td>{t("your_earnings")}</td>
                                <td className="text-right">
                                    {booking_details.status == apiConstants.BOOKING_CANCELLED_BY_USER || booking_details.status == apiConstants.BOOKING_CANCELLED_BY_PROVIDER ? "Cancelled" : 
                                  
                                    <span className="text-success">{booking_details.pricing_details
                                      .provider_amount_formatted}</span>
                                  
                                }
                                </td>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <ReviewModel booking_id={this.props.match.params.id} />
      </div>
    );
  }
}

export default withToastManager(translate(HostSingleBookingDetails));

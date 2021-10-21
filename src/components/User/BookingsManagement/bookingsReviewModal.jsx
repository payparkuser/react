import React, { Component } from "react";
import StarRatingComponent from "react-star-rating-component";
import api from "../../../Environment";
import { withToastManager } from "react-toast-notifications";
import ToastDemo from "../../Helper/toaster";
import { translate, t } from "react-multi-lang";
const $ = window.$;

class BookingsReviewModal extends Component {
    state = {
        ratings: 0,
        review: null,
        buttonDisable: false,
        loadingContent: null,
    };
    onStarClick(nextValue, prevValue, name) {
        this.setState({ ratings: nextValue });
    }

    handleChange = ({ currentTarget: input }) => {
        this.setState({ review: input.value });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({
            buttonDisable: true,
            loadingContent: "Loading.. Please wait...",
        });
        api.postMethod("bookings_rating_report", {
            booking_id: this.props.booking_id,
            ratings: this.state.ratings,
            review: this.state.review,
        }).then((response) => {
            if (response.data.success) {
                ToastDemo(
                    this.props.toastManager,
                    response.data.message,
                    "success"
                );
                window.location.reload();
            } else {
                ToastDemo(
                    this.props.toastManager,
                    response.data.error,
                    "error"
                );
            }
            $("#BookingsReviewModal").modal("hide");
            this.setState({ buttonDisable: false, loadingContent: null });
        });
    };

    render() {
        return (
            <div>
                <div className="modal fade " id="BookingsReviewModal">
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
                                <h1 className="section-head">
                                    {t("review_the_trip")}
                                </h1>
                                <p className="small-line" />
                                <h4>{t("rating_and_review")}</h4>
                                <form
                                    className="top1"
                                    onSubmit={this.handleSubmit}
                                >
                                    <div className="row">
                                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                            <span style={{ fontSize: 30 }}>
                                                <StarRatingComponent
                                                    name="ratings"
                                                    starCount={5}
                                                    // value={1}
                                                    starColor={"#338837"}
                                                    emptyStarColor={"#adadad"}
                                                    onStarClick={this.onStarClick.bind(
                                                        this
                                                    )}
                                                />
                                            </span>
                                        </div>

                                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                            <label>{t("your_reviews")}</label>
                                            <textarea
                                                className="form-control"
                                                name="reviews"
                                                onChange={this.handleChange}
                                            />
                                        </div>

                                        <p className="small-line" />

                                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                            <button
                                                className="pink-btn bottom1"
                                                disabled={
                                                    this.state.buttonDisable
                                                }
                                            >
                                                {this.state.loadingContent !=
                                                null
                                                    ? this.state.loadingContent
                                                    : t("submit_review")}
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

export default withToastManager(translate(BookingsReviewModal));

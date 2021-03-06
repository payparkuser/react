import React, { Component } from "react";
import api from "../../Environment";
import BookingsGallery from "../User/BookingsManagement/bookingsGallery";
import Helper from "../Helper/Helper";
import ToastDemo from "../Helper/toaster";
import { withToastManager } from "react-toast-notifications";
import { translate, t } from "react-multi-lang";

class SingleParkingContentHelper extends Helper {
  state = {
    reviews: null,
    reviewLoading: true,
    skipCount: 0,
    loadingStatus: true,
    loadingContent: null,
    contentData: null,
    infoTabActive: true,
    reviewTabActive: false,
    parkTabActive: false,
    singleParkingDetailsRes: null,
    singleParkingApiLoading: true,
    wishlistData: null,
    wishlistLoading: true,
    wishlistStatus: 0
  };
  componentDidMount() {
    this.setState({
      wishlistStatus: this.props.singleDetails.wishlist_status
    });
    console.log("proos", this.props);
    // if (!this.props.singleParkingApiLoading)
    //   this.setState({ singleParkingApiLoading: false });
  }
  //WARNING! To be deprecated in React v17. Use new lifecycle static getDerivedStateFromProps instead.
  componentWillReceiveProps(nextProps) {
    this.setState({
      reviews: null,
      reviewLoading: true,
      skipCount: 0,
      infoTabActive: true,
      reviewTabActive: false,
      parkTabActive: false,
      singleParkingApiLoading: true,
      singleParkingDetailsRes: null
    });
  }
  handleInfo = event => {
    event.preventDefault();
    this.setState({
      infoTabActive: true,
      reviewTabActive: false,
      parkTabActive: false
    });
  };
  reviewsCall = event => {
    event.preventDefault();
    this.reviewsApiCall();
    this.setState({
      infoTabActive: false,
      reviewTabActive: true,
      parkTabActive: false
    });
  };
  handlePark = event => {
    this.setState({
      infoTabActive: false,
      reviewTabActive: false,
      parkTabActive: true
    });
  };
  reviewsApiCall() {
    let items;
    api
      .postMethod("reviews", {
        space_id: this.props.singleDetails.space_id,
        skip: this.state.skipCount
      })
      .then(response => {
        if (response.data.success) {
          if (this.state.reviews != null) {
            items = [...this.state.reviews, ...response.data.data];
          } else {
            items = [...response.data.data];
          }
          this.setState({
            reviews: items,
            reviewLoading: false,
            skipCount: response.data.data.length + this.state.skipCount,
            loadingStatus: true
          });
        }
      });
  }
  loadMore = event => {
    event.preventDefault();
    this.setState({ loadingStatus: false, loadingContent: "Loading..." });

    this.reviewsApiCall();
  };

  handleWishlist = (event, space_id) => {
    event.preventDefault();
    let addWishlist = {
      space_id: space_id,
      clear_all_status: 0
    };
    api.postMethod("wishlist_operations", addWishlist).then(response => {
      if (response.data.success) {
        this.setState({
          wishlistData: response.data.data,
          wishlistLoading: false,
          wishlistStatus: response.data.data.wishlist_status
        });
        ToastDemo(this.props.toastManager, response.data.message, "success");
      } else {
        const check = this.checkLoginUser(response.data);
        if (check) {
          ToastDemo(
            this.props.toastManager,
            "Please login to save the details",
            "error"
          );
        } else {
          ToastDemo(this.props.toastManager, response.data.error, "error");
        }
      }
    });
  };

  render() {
    const { singleDetails } = this.props;
    const {
      reviews,
      reviewLoading,
      loadingContent,
      loadingStatus,
      infoTabActive,
      reviewTabActive,
      parkTabActive,
      wishlistStatus
    } = this.state;
    const { singleParkingDetailsRes, singleParkingApiLoading } = this.props;
    return (
      <div className="single-park-content">
        <div className="single-park-top">
          <h6 className="">
            {singleDetails.is_automatic_booking == 1 ? (
              <span className="reserve-txt">
                <i className="flaticon-flash"></i>{t("instant_booking")}
              </span>
            ) : (
              <span className="text-muted">{t("manual_booking")}</span>
            )}
            <span className="parkname">{singleDetails.space_type}</span>
            <span className="park-address">{singleDetails.space_location}</span>
          </h6>
          <div className="row">
            <div className="col-md-12">
              <div className="flex-content">
              <div className="rating-sec small-rating-sec align-left">
                <span className="rating-star">
                  {this.starRatingHost(singleDetails.overall_ratings, 12)}
                </span>
                <span className="rating-sec-reviews">
                  {singleDetails.total_ratings}
                </span>
              </div>
              <a
                href=""
                className="align-right"
                onClick={event =>
                  this.handleWishlist(event, singleDetails.space_id)
                }
              >
                {wishlistStatus == 1 ? (
                  <img
                    src="../../../assets/img/heart-fill.svg"
                    className="wishlist"
                  ></img>
                ) : (
                  <img
                    src="../../../assets/img/heart.svg"
                    className="wishlist"
                  ></img>
                )}
              </a>
              </div>
            </div>
          </div>
        </div>
        <div className="single-park-mid">
          <div className="row">
            <div className="col-sm-4">
              <h4 className="park-sub-tit">1h</h4>
              <p className="park-txt">{t("min_duration")}</p>
            </div>
            <div className="col-sm-4">
              <h4 className="park-sub-tit">
                {singleDetails.per_hour_formatted}
              </h4>
              <p className="park-txt">{t("per_hour_price")}</p>
            </div>
            <div className="col-sm-4">
              <h4 className="park-sub-tit">
                {singleDetails.total_distance}&nbsp;miles
              </h4>
              <p className="park-txt">{t("to_destination")}</p>
            </div>
          </div>
        </div>
        <div className="single-park-btm">
          <ul className="nav nav-tabs park-tabs single-park-tab" role="tablist">
            <li className="nav-item">
              <a
                className={infoTabActive ? "nav-link active" : "nav-link"}
                id="info-tab"
                data-toggle="tab"
                href="#info"
                role="tab"
                aria-controls="info"
                aria-selected="true"
                onClick={this.handleInfo}
              >
                {t("information")}
              </a>
            </li>
            <li className="nav-item">
              <a
                className={reviewTabActive ? "nav-link active" : "nav-link"}
                id="reviews-tab"
                data-toggle="tab"
                href="#review"
                role="tab"
                aria-controls="review"
                aria-selected="false"
                onClick={this.reviewsCall}
              >
                {t("reviews")}
              </a>
            </li>
            <li className="nav-item">
              <a
                className={parkTabActive ? "nav-link active" : "nav-link"}
                id="howpark-tab"
                data-toggle="tab"
                href="#howpark"
                role="tab"
                aria-controls="howpark"
                aria-selected="false"
                onClick={this.handlePark}
              >
                {t("how_to_park")}
              </a>
            </li>
          </ul>

          <div className="single-park-tab-content tab-content">
            {singleParkingApiLoading ? (
              t("loading")
            ) : (
              <div
                className={
                  infoTabActive ? "tab-pane fade show active" : "tab-pane fade"
                }
                id="info"
                role="tabpanel"
                aria-labelledby="info-tab"
              >
                <p>{t("size")} {singleParkingDetailsRes.dimension}</p>
                <hr></hr>
                {singleParkingDetailsRes.amenities.length > 0
                  ? singleParkingDetailsRes.amenities.map(amenity => (
                      <div>
                        <div className="flex-data" key={amenity.picture}>
                          <div className="parking-des">
                            <p>{amenity.value}</p>
                          </div>
                          <a
                            href="#"
                            data-toggle="modal"
                            data-target="#image-gal"
                            className="info-img"
                          >
                            <img src={amenity.picture} />
                          </a>
                        </div>
                      </div>
                    ))
                  : "no "}
                <hr></hr>
                <div className="parking-des">
                  <p>{singleParkingDetailsRes.space_description}</p>
                </div>

                <hr></hr>

                <div className="flex-data">
                  {singleDetails.gallery.map(image => (
                    <div key={image.picture}>
                      <a
                        href="#"
                        data-toggle="modal"
                        data-target="#image-gal"
                        className="info-img"
                      >
                        <img src={image.picture} />
                      </a>
                    </div>
                  ))}
                  <BookingsGallery details={singleDetails} />
                </div>
              </div>
            )}
            <div
              className={
                reviewTabActive ? "tab-pane fade show active" : "tab-pane fade"
              }
              id="review"
              role="tabpanel"
              aria-labelledby="reviews-tab"
            >
              <div className="reviews-wrap">
                {reviewLoading
                  ? t("loading")
                  : reviews.map(review => (
                      <div
                        className="review-box row1"
                        key={review.booking_user_review_id}
                      >
                        <div className="review-img">
                          <img src={review.user_picture} />
                        </div>
                        <div className="review-content">
                          <h6 className="review-name">{review.user_name}</h6>
                          <p className="review-date">{review.updated}</p>
                          <div className="rating-sec small-rating-sec">
                            <span className="rating-star">
                              {this.starRatingHost(review.ratings, 12)}
                            </span>
                          </div>
                          <p className="review-txt">{review.review}</p>
                        </div>
                      </div>
                    ))}
              </div>
            </div>

            <div
              className={
                parkTabActive ? "tab-pane fade show active" : "tab-pane fade"
              }
              id="howpark"
              role="tabpanel"
              aria-labelledby="howpark-tab"
            >
              <div>
                <div className="howpark-box row1">
                  <div className="parking-des">
                    <p>
                      {singleParkingApiLoading
                        ? "Loading..."
                        : singleParkingDetailsRes.access_note}
                    </p>
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

export default withToastManager(translate(SingleParkingContentHelper));

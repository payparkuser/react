import React, { Component } from "react";
import api from "../../Environment";
import renderHTML from "react-render-html";
import Loader from "../Helper/Loader";
import { translate, t } from "react-multi-lang";

import TripReviewSection from "../User/BookingsManagement/tripReviewSection";
import TripHostSection from "../User/BookingsManagement/tripHostSection";
import TripShowAllAmen from "../User/BookingsManagement/tripShowAllAmen";
import TripLocation from "../User/BookingsManagement/TripLocation";
import "@y0c/react-datepicker/assets/styles/calendar.scss";

import BookingsGallery from "../User/BookingsManagement/bookingsGallery";
import BookingsViewBanner from "../User/BookingsManagement/bookingsViewBanner";

class SingleTripView extends Component {
    state = {
        singleTripDetails: null,
        loading: true,
        formData: {
            space_id: this.props.match.params.id
        }
    };

    componentDidMount() {
        const formData = {
            space_id: this.props.match.params.id
        };
        this.singleTripViewApiCall(formData);
    }

    //WARNING! To be deprecated in React v17. Use new lifecycle static getDerivedStateFromProps instead.
    componentWillReceiveProps(nextProps) {
        const formData = {
            space_id: nextProps.match.params.id
        };
        this.setState({ loading: true });
        this.singleTripViewApiCall(formData);
    }

    singleTripViewApiCall(formData) {
        api.postMethod("spaces_view", formData).then(response => {
            if (response.data.success === true) {
                this.setState({
                    singleTripDetails: response.data.data,
                    loading: false
                });
            }
        });
    }

    render() {
        let load = new Loader();
        var settings = {
            infinite: false,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 1,
            adaptiveHeight: true
        };
        let { singleTripDetails, loading } = this.state;

        return loading ? (
            t("loading")
        ) : (
            <div>
                <BookingsViewBanner basicDetails={singleTripDetails} />

                <BookingsGallery details={singleTripDetails} />

                <div className="main">
                    <div className="site-content">
                        <div className="top-bottom-spacing">
                            <div className="row">
                                <div className="col-xl-7 col-lg-10 col-md-10 auto-margin">
                                    <div id="overview">
                                        <div className="media">
                                            <div className="media-body mr-3">
                                                <a href="#">
                                                    <p className="red-text txt-overflow">
                                                        {
                                                            singleTripDetails.space_location
                                                        }
                                                    </p>
                                                </a>
                                                <h1 className="category-section-head">
                                                    {
                                                        singleTripDetails.space_name
                                                    }
                                                </h1>
                                                <h4 className="captalize section-subhead">
                                                    {
                                                        singleTripDetails.space_location
                                                    }
                                                </h4>
                                            </div>
                                            <div>
                                                <img
                                                    src={
                                                        singleTripDetails.provider_picture
                                                    }
                                                    alt="John Doe"
                                                    className="mt-3 rounded-circle review-img"
                                                />
                                                <p className="text-center top3 mb-0">
                                                    <p className="other-proname">
                                                        {
                                                            singleTripDetails.provider_name
                                                        }
                                                    </p>
                                                </p>
                                            </div>
                                        </div>

                                        <h4 className="single-cat-text">
                                            {renderHTML(
                                                singleTripDetails.space_description
                                            )}
                                        </h4>

                                        <p className="overview-line" />

                                        <h4 className="single-cat-text medium-cls ">
                                            {t("amenties")}
                                        </h4>
                                        <ul className="amenties-list">
                                            {singleTripDetails.amenities
                                                .length > 0 ? (
                                                <div>
                                                    {singleTripDetails.amenities.map(
                                                        amentie => (
                                                            <li className="">
                                                                <img
                                                                    src={
                                                                        amentie.picture
                                                                    }
                                                                    style={{
                                                                        width:
                                                                            "20px",
                                                                        height:
                                                                            "16px"
                                                                    }}
                                                                />
                                                                &nbsp;
                                                                {amentie.value}
                                                            </li>
                                                        )
                                                    )}
                                                    <div className="clearfix" />
                                                    <a
                                                        href="#"
                                                        data-toggle="modal"
                                                        data-target="#amenities"
                                                    >
                                                        <h4 className="amenities-head">
                                                            {t("show_all_amenities")}
                                                        </h4>
                                                    </a>

                                                    <TripShowAllAmen
                                                        amenties={
                                                            singleTripDetails.amenities
                                                        }
                                                    />
                                                </div>
                                            ) : (
                                                <div className="no-data">
                                                    <img
                                                        src={
                                                            window.location
                                                                .origin +
                                                            "/assets/img/parking/no-data.svg"
                                                        }
                                                    />
                                                    <h5>{t("no_data")}</h5>
                                                </div>
                                            )}
                                        </ul>

                                        <p className="overview-line" />
                                    </div>

                                    <TripReviewSection
                                        details={singleTripDetails}
                                    />

                                    <TripHostSection
                                        providerDetails={singleTripDetails}
                                    />

                                    <TripLocation
                                        location={singleTripDetails}
                                    />
                                    <div className="clearfix" />
                                </div>
                                {/* <TripBookingForm
                  basicDetails={singleTripDetails}
                  providerDetails={singleTripDetails}
                  status="host"
                  location={this.props.location}
                /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default translate(SingleTripView);

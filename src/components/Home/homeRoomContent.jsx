import React, { Component } from "react";
import { Link } from "react-router-dom";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

import api from "../../Environment";
import MapContainer from "../Helper/mapHelper";
import Helper from "../Helper/Helper";
import ToastDemo from "../Helper/toaster";
import { withToastManager } from "react-toast-notifications";

class HomeRoomContent extends Helper {
    state = {
        wishlistData: {
            wishlist_status: "",
            space_id: ""
        },
        loading: true,
        space_id: null
    };

    handleClick = (event, data) => {
        event.preventDefault();
        let el = event.target;

        const addWishlist = {
            space_id: data.space_id,
            clear_all_status: 0
        };
        api.postMethod("wishlist_operations", addWishlist).then(response => {
            if (response.data.success) {
                this.setState({
                    wishlistData: response.data.data,
                    loading: false,
                    space_id: data.space_id
                });
                if (response.data.data.wishlist_status) {
                    el.classList.add("pink-clr");
                } else {
                    el.classList.remove("pink-clr");
                }
                ToastDemo(
                    this.props.toastManager,
                    response.data.message,
                    "success"
                );
            } else {
                const check = this.checkLoginUser(response.data);
                if (check) {
                    ToastDemo(
                        this.props.toastManager,
                        "Please login to save the details",
                        "error"
                    );
                } else {
                    ToastDemo(
                        this.props.toastManager,
                        response.data.error,
                        "error"
                    );
                }
            }
        });
    };

    //WARNING! To be deprecated in React v17. Use new lifecycle static getDerivedStateFromProps instead.
    componentWillReceiveProps(nextProps) {
        this.setState({ loading: true });
    }

    render() {
        const { length: count } = this.props.contentDetails;
        const { wishlistData, loading, space_id } = this.state;

        if (count === 0) {
            return <p />;
        }

        var settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1
        };

        return (
            <div className="subcategory-leftsec">
                <div className="section-title">
                    <h1 className="section-head">{this.props.title}</h1>
                    <h4 className="captalize section-subhead">
                        explore some of the best-reviewed homes in the world
                    </h4>
                </div>

                <div className="row">
                    {this.props.contentDetails.map(data => (
                        <div className="subcategory-card" key={data.space_id}>
                            <div className="relative">
                                <section className="home-slider slider">
                                    <Carousel
                                        showThumbs={false}
                                        infiniteLoop={true}
                                        showStatus={false}
                                    >
                                        {data.gallery.length <= 0 ? (
                                            <div
                                                key={data.space_picture}
                                                className="homes-img-sec1"
                                            >
                                                <img
                                                    srcSet={data.space_picture}
                                                    src={data.space_picture}
                                                    alt={data.space_name}
                                                    className="homes-img"
                                                />
                                            </div>
                                        ) : (
                                            data.gallery.map(image => (
                                                <div
                                                    key={image.picture}
                                                    className="homes-img-sec1"
                                                >
                                                    <img
                                                        srcSet={image.picture}
                                                        src={image.picture}
                                                        alt="image"
                                                        className="homes-img"
                                                    />
                                                </div>
                                            ))
                                        )}
                                    </Carousel>
                                </section>
                                <div className="wishlist-icon-sec">
                                    <div className="wishlist-icon">
                                        <Link
                                            className=""
                                            to="#"
                                            onClick={e =>
                                                this.handleClick(e, data)
                                            }
                                        >
                                            {/* {loading ? (
                        ""
                      ) : wishlistData.space_id != "" ? (
                        wishlistData.space_id == data.space_id ? (
                          <i className="fas fa-heart pink-clr" />
                        ) : (
                          <i className="far fa-heart" />
                        )
                      ) : (
                        <i className="far fa-heart" />
                      )} */}
                                            {data.wishlist_status ? (
                                                <i className="fa fa-heart pink-clr" />
                                            ) : (
                                                <i className="fa fa-heart" />
                                            )}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <Link to={`/trip/${data.space_id}`}>
                                <div className="homes-text-sec">
                                    <p className="red-text txt-overflow">
                                        {data.space_location}{" "}
                                        <span className="room-content-dot">
                                            <i className="fas fa-circle" />
                                        </span>{" "}
                                        {data.sub_category_name}
                                    </p>
                                    <h4 className="homes-title txt-overflow">
                                        {data.space_name}
                                    </h4>
                                    <h5 className="homes-price txt-overflow">
                                        <span>
                                            {data.per_day_formatted}{" "}
                                            {data.per_day_symbol}
                                        </span>
                                    </h5>
                                    <h5 className="rating-sec">
                                        <span className="rating-star">
                                            {this.starRatingHost(
                                                data.overall_ratings
                                            )}
                                        </span>
                                        <span>
                                            &nbsp;({data.total_ratings})
                                        </span>
                                    </h5>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default withToastManager(HomeRoomContent);

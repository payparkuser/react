import React, { Component } from "react";
import CalForm from "../Helper/calForm";
import FaqSection from "../Helper/faqSection";
import ToastDemo from "../Helper/toaster";
import { withToastManager } from "react-toast-notifications";
import { Link } from "react-router-dom";

import { translate, t } from "react-multi-lang";

import configuration from "react-global-configuration";

class BecomeAHost extends Component {
  state = {};
  componentDidMount() {
    if (this.props.location.state != null) {
      ToastDemo(
        this.props.toastManager,
        this.props.location.state.error,
        "error"
      );
    }
  }
  render() {
    return (
      <div>
        <div
          className="host-banner-sec"
          style={{
            backgroundImage: `url('../../../assets/img/parking/parking-new-banner.jpg')`
          }}
        >
          <div className="host-banner-sec-overlay">
            <div className="site-content">
              <div className="row">
                <div className="col-md-6 col-lg-6 col-xl-5 host-banner-aligncenter">
                  <div className="">
                    <h2 className="host-banner-subhead">
                      {t("list_your_space_on")} {configuration.get("configData.site_name")}
                    </h2>
                    <h1 className="host-banner-head">
                      {t("host_banner_para")}{" "}
                    </h1>
                    <Link to={"/host/register"} className="green-btn">
                      {t("get_started")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="site-content">
          <div className="host-top-bottom-spacing">
            <div className="host-section-head">
              <h1>
                {t("how_to_rent_your_parking_space")}
              </h1>
            </div>
            <div className="row listings">
              <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mob-listing-view">
                <div className="box outer-box">
                  <div className="inner content">
                    <img
                      src="../assets/img/listing1.jpg"
                      className="listing-img"
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div className="media">
                  <h1 className="count">1</h1>
                  <div className="media-body">
                    <div className="listings-head">
                      <h3>{t("create_your_listing")}</h3>
                    </div>
                    <div className="listings-para">
                      <p>
                        {t("create_your_listing_para1")}
                      </p>
                    </div>
                    <div className="listings-para">
                      <p>
                        {t("create_your_listing_para2")}
                      </p>
                    </div>
                    <div className="listings-para">
                      <p>
                        {t("create_your_listing_para3")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 listing-view text-right">
                <div className="box outer-box">
                  <div className="inner content">
                    <img
                      src="../assets/img/listing1.jpg"
                      className="listing-img"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row listings">
              <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div className="box outer-box">
                  <div className="inner content">
                    <img
                      src="../assets/img/listing4.png"
                      className="listing-img"
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div className="media">
                  <h1 className="count">2</h1>
                  <div className="media-body">
                    <div className="listings-head">
                      <h3>{t("accept_a_booking")}</h3>
                    </div>
                    <div className="listings-para">
                      <p>
                        {t("accept_a_booking_para1")}
                      </p>
                    </div>
                    <div className="listings-para">
                      <p>
                        {t("accept_a_booking_para2")}
                      </p>
                    </div>
                    <div className="listings-para">
                      <p>
                        {t("accept_a_booking_para3")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row listings">
              <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mob-listing-view">
                <div className="box outer-box">
                  <div className="inner content">
                    <img
                      src="../assets/img/listing1.jpg"
                      className="listing-img"
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div className="media">
                  <h1 className="count">3</h1>
                  <div className="media-body">
                    <div className="listings-head">
                      <h3>{t("get_paid")}</h3>
                    </div>
                    <div className="listings-para">
                      <p>
                        {t("get_paid_para1")}
                      </p>
                    </div>
                    <div className="listings-para">
                      <p>
                        {t("get_paid_para2")}
                      </p>
                    </div>
                    <div className="listings-para">
                      <p>
                        {t("get_paid_para3")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 listing-view text-right">
                <div className="box outer-box">
                  <div className="inner content">
                    <img
                      src="../assets/img/listing5.png"
                      className="listing-img"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="site-content">
          <div className="host-top-bottom-spacing">
            <div className="host-section-head">
              <h1>{t("why_host_on_parkingPal")}</h1>
            </div>

            <div className="row">
              <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <div className="media safety">
                  <img
                    src="../assets/img/safety-icon1.png"
                    alt="safety-icon"
                    className="mb-3 rounded-circle"
                  />
                  <div className="media-body">
                    <h2>{t("make_the_world_a_greener_place")}</h2>
                    <p>
                      {t("make_the_world_a_greener_place_para")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <div className="media safety">
                  <img
                    src="../assets/img/safety-icon2.png"
                    alt="safety-icon"
                    className="mb-3 rounded-circle"
                  />
                  <div className="media-body">
                    <h2>{t("dedicated_customer_support")}</h2>
                    <p>
                      {t("dedicated_customer_support_para")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <div className="media safety">
                  <img
                    src="../assets/img/safety-icon3.png"
                    alt="safety-icon"
                    className="mb-3 rounded-circle"
                  />
                  <div className="media-body">
                    <h2>
                      {configuration.get("configData.site_name")} {t("built_on_trust")}
                    </h2>
                    <p>
                      All {configuration.get("configData.site_name")} {t("built_on_trust_para")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FaqSection />

        <div
          className="host-footer-img"
          style={{
            backgroundImage: `url('../../../assets/img/parking/parking-host-bottom.svg')`
          }}
        >
          <div className="site-content">
            <div className="row">
              <div className="col-sm-8 col-md-7 col-lg-6 col-xl-5">
                <div className="host-footer-content">
                  <div>
                    <div className="host-footer-content-head">
                      <h1>{t("start_creating_your_listing")}</h1>
                    </div>
                    <a href="#" className="green-btn">
                      {t("get_started")}
                    </a>
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

export default withToastManager(translate(BecomeAHost));

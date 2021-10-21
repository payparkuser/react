import React, { Component } from "react";
import configuration from "react-global-configuration";

class FaqSection extends Component {
  state = {};
  render() {
    return (
      <div className="site-content">
        <div className="host-top-bottom-spacing">
          <div className="host-section-head">
            <h1>Frequently asked questions</h1>
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <h4 className="faq-text">Getting Started</h4>
              <div id="accordion-faq" className="faq">
                <div className="card">
                  <div className="card-header">
                    <a
                      className="card-link"
                      data-toggle="collapse"
                      href="#collapse1"
                    >
                      <span>
                        <i className="fas fa-chevron-down" />
                      </span>
                      Can I share my home on {configuration.get("configData.site_name")}?
                    </a>
                  </div>
                  <div id="collapse1" className="collapse">
                    <div className="card-body">
                      you can learn about local laws and rules and get advice on
                      hosting responsibly in {configuration.get("configData.site_name")}’s online Help Center.
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header">
                    <a
                      className="card-link"
                      data-toggle="collapse"
                      href="#collapse2"
                    >
                      <span>
                        <i className="fas fa-chevron-down" />
                      </span>
                      Who can be an {configuration.get("configData.site_name")} host?
                    </a>
                  </div>
                  <div id="collapse2" className="collapse">
                    <div className="card-body">
                      It’s easy to become an {configuration.get("configData.site_name")} host in most areas, and
                      it’s always free to create a listing. Entire apartments
                      and homes, private rooms, treehouses, and castles are just
                      a few of the properties hosts have shared on {configuration.get("configData.site_name")}. For
                      more details on what’s expected of hosts, check out
                      {configuration.get("configData.site_name")}’s community standards, which revolve around
                      safety, security, and reliability, and hospitality
                      standards, which help hosts earn great guest reviews.
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header">
                    <a
                      className="card-link"
                      data-toggle="collapse"
                      href="#collapse3"
                    >
                      <span>
                        <i className="fas fa-chevron-down" />
                      </span>
                      Does {configuration.get("configData.site_name")} screen guests?
                    </a>
                  </div>
                  <div id="collapse3" className="collapse">
                    <div className="card-body">
                      {configuration.get("configData.site_name")} verifies some information about guests and hosts
                      to help make our community a safer place for everyone.
                      That includes requiring a profile photo, confirmed phone
                      number, and confirmed email address. As a host, for added
                      security, you can also ask potential guests to provide an
                      official ID and complete {configuration.get("configData.site_name")}’s Verified ID process.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <h4 className="faq-text">Earnings</h4>
              <div id="accordion-faq" className="faq">
                <div className="card">
                  <div className="card-header">
                    <a
                      className="card-link"
                      data-toggle="collapse"
                      href="#collapse4"
                    >
                      <span>
                        <i className="fas fa-chevron-down" />
                      </span>
                      How should I price my listing on {configuration.get("configData.site_name")}?
                    </a>
                  </div>
                  <div id="collapse4" className="collapse">
                    <div className="card-body">
                      What you charge is always up to you, but we do provide
                      tips to help make your space more competitive. When you
                      create a listing on {configuration.get("configData.site_name")}, we suggest a price for your
                      property based on your location and other factors. You can
                      set nightly, weekly, and/or monthly rates. Our Smart
                      Pricing tool can help you get the most from your {configuration.get("configData.site_name")}.
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header">
                    <a
                      className="card-link"
                      data-toggle="collapse"
                      href="#collapse5"
                    >
                      <span>
                        <i className="fas fa-chevron-down" />
                      </span>
                      How do {configuration.get("configData.site_name")} payments work?
                    </a>
                  </div>
                  <div id="collapse5" className="collapse">
                    <div className="card-body">
                      All payments are processed securely through {configuration.get("configData.site_name")}’s
                      online payment system. Guests are charged when a
                      reservation is made, and hosts are paid 24 hours after
                      check-in. How you’re paid is up to you: You can set up
                      direct deposit, PayPal, or a number of other options.
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header">
                    <a
                      className="card-link"
                      data-toggle="collapse"
                      href="#collapse6"
                    >
                      <span>
                        <i className="fas fa-chevron-down" />
                      </span>
                      How much will I earn each year?
                    </a>
                  </div>
                  <div id="collapse6" className="collapse">
                    <div className="card-body">
                    This will depend on how attractive your listing is. Our drivers book their parking based on 3 key factors; location, price and user reviews.
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

export default FaqSection;

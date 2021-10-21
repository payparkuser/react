import React, { Component } from "react";
import Helper from "../Helper/Helper";
import { translate, t } from "react-multi-lang";

class SingleParkingDetailHelper extends Helper {
  state = {};

  render() {
    const { single } = this.props;
    return (
      <div>
        <div className="parklist-img">
          <img src={single.space_picture} />
        </div>
        <div className="parklist-sec">
          <h5 className="park-tit">{single.space_name}</h5>
          <p>
            {single.is_automatic_booking == 1 ? (
              <span className="reserve-txt">
                <i className="flaticon-flash"></i>{t("instant_booking")}
              </span>
            ) : (
              <span className="text-muted">{t("manual_booking")}</span>
            )}
          </p>
          <div className="rating-sec">
            <span className="rating-star">
              {this.starRatingHost(single.overall_ratings, 12)}
            </span>
            <span className="rating-sec-reviews">{single.total_ratings}</span>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <h4 className="park-sub-tit">{single.per_hour_formatted}</h4>
              <p className="park-txt">{t("per_hour_price")}</p>
            </div>
            <div className="col-sm-6">
              <h4 className="park-sub-tit">{single.total_distance} Miles</h4>
              <p className="park-txt">{t("to_destination")}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default translate(SingleParkingDetailHelper);

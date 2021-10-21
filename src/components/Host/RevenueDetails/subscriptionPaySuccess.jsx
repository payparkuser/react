import React, { Component } from "react";
import { Link } from "react-router-dom";
import { translate, t } from "react-multi-lang";

class HostSubPaySuccess extends Component {
    state = {};
    render() {
        return (
            <div className="main">
                <div className="container">
                    <div className="top-bottom-spacing">
                        <div className="payment-status text-center">
                            <img
                                src="../../../assets/img/money.png"
                                className="pay-money"
                            />
                            <h3 className="pay-modal-tit">Thank You!</h3>
                            <p className="pay-modal-txt">
                                {t("payment_successfull")}
                            </p>
                            {/* <p className="pay-modal-sub-txt">
                                Lorem ipsum dolor sit amet, consectetur
                                adipisicing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.
                            </p> */}
                            <Link
                                to={"/host/subscription-history"}
                                className="green-btn invoice-pay-btn small-btn"
                            >
                                {t("view_history")}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default translate(HostSubPaySuccess);

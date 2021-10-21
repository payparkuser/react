import React, { useState, useEffect  } from "react";
import ProfileSideBar from "../../Helper/profileSideBar";
import api from "../../../Environment";
import { Link } from "react-router-dom";
import ToastDemo from "../../Helper/toaster";
import { withToastManager } from "react-toast-notifications";
import AddCardForm from "./addCardForm";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { translate, t } from "react-multi-lang";

import InputField from "../../Helper/inputfield";
import configuration from "react-global-configuration";

const UserPayment = (props) => {

  const [card, setCard] = useState({
    data: [],
    loading: true
  });

  const [billing, setBilling] = useState({
    data: [],
    loading: true,
    isBillingInfoUpdated: false
  });

  useEffect(() => {
    listCardApi();
    billingInfoApi();
  }, []);

  const stripePromise = loadStripe(
    configuration.get("configData.stripe_publishable_key")
  );

  const listCardApi = () => {
    api.postMethod("cards_list").then((response) => {
      if (response.data.success) {
        setCard({
          ...card,
          data: response.data.data,
          loading: false,
        });
      } else {
      }
    });
  }

  const setDefaultCard = (event, card) => {
    event.preventDefault();
    api
      .postMethod("cards_default", {
        user_card_id: card.user_card_id,
      })
      .then((response) => {
        if (response.data.success) {
          ToastDemo(props.toastManager, response.data.message, "success");
          listCardApi();
        } else {
          ToastDemo(props.toastManager, response.data.error, "error");
        }
      });
  };

  const deleteCard = (event, card) => {
    event.preventDefault();
    api
      .postMethod("cards_delete", {
        user_card_id: card.user_card_id,
      })
      .then((response) => {
        if (response.data.success) {
          ToastDemo(props.toastManager, response.data.message, "success");
          listCardApi();
        } else {
          ToastDemo(props.toastManager, response.data.error, "error");
        }
      });
  };

  const handleChange = ({ currentTarget: input }) => {
    const formData = { ...this.state.formData };
    formData[input.name] = input.value;
    setBilling({ formData });
  };

  const billingInfoApi = (event, card) => {
    api.postMethod("billing_info").then((response) => {
      if (response.data.success) {
        setBilling({
          ...billing,
          data: response.data.data,
          loading: false,
          isBillingInfoUpdated: response.data.data.length > 0 ? true : false,
        });
      } else {
      }
    });
  }

  const handleBillingChange = ({ currentTarget: input }) => {
    const data = { ...billing.data };
    data[input.name] = input.value;
    setBilling({ data, isBillingInfoUpdated: true });
  };

  const handleBillingSubmit = (event) => {
    event.preventDefault();
    const { path } = props.location;
    setBilling({
      loadingContent: "Loading... Please wait..",
      buttonDisable: true,
    });

    if (billing.isBillingInfoUpdated == false) {
      ToastDemo(props.toastManager, "Please fill thd details", "error");

      setBilling({ loadingContent: null, buttonDisable: false });

      return true;
    }

    api
      .postMethod("update_billing_info", billing.data)
      .then((response) => {
        if (response.data.success) {
          ToastDemo(props.toastManager, response.data.message, "success");
          billingInfoApi();
        } else {
          ToastDemo(props.toastManager, response.data.error, "error");
        }
      })
      .catch((error) => {
        setBilling({ loadingContent: null, buttonDisable: false });
      });
  };

    return props.configLoading ? (
      ""
    ) : (
        <div className="main">
          <div className="site-content">
            <div className="top-bottom-spacing">
              <div className="row">
                <ProfileSideBar />
                <div className="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-9">
                  <form>
                    <div className="panel">
                      <div className="panel-heading">
                        {t("payment_methods")}{" "}
                      </div>
                      <div className="panel-body account pt-3">
                        <div className="row">
                          {card.loading
                            ? ""
                            : card.data ? card.data.cards.map((card) => (
                                <div
                                  className="col-sm-12 col-md-6 col-lg-6 col-xl-4 top"
                                  key={card.user_card_id}
                                >
                                  <div className="payment-box">
                                    <h5>XXXX XXXX XXXX {card.last_four}</h5>
                                    <div className="payment-bottom">
                                      {card.is_default == 1 ? (
                                        <p className="captalize m-0">
                                          default card
                                          <img
                                            src="../assets/img/credit-card.png"
                                            className="credit-img"
                                          />
                                        </p>
                                      ) : (
                                        <div>
                                          <Link
                                            to="#"
                                            onClick={(event) =>
                                              setDefaultCard(event, card)
                                            }
                                          >
                                            <p className="red-text1 m-0">
                                              set as default
                                            </p>
                                          </Link>
                                          <Link
                                            to="#"
                                            onClick={(event) =>
                                              deleteCard(event, card)
                                            }
                                          >
                                            <p className="captalize m-0">
                                              remove
                                              <img
                                                src="../assets/img/credit-card.png"
                                                className="credit-img"
                                              />
                                            </p>{" "}
                                          </Link>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )) : null }

                          <div className="col-sm-12 col-md-6 col-lg-6 col-xl-4 top">
                            <a
                              href="#"
                              data-toggle="modal"
                              data-target="#AddCardModel"
                            >
                              <div className="payment-box text-center">
                                <i className="material-icons big-icon">
                                  {t("add")}
                                </i>
                                <h4 className="captalize top">
                                  {t("add_a_payment_method")}
                                </h4>
                              </div>
                            </a>
                          </div>
                          <Elements stripe={stripePromise}>
                            <AddCardForm {...props} />
                          </Elements>
                        </div>
                      </div>
                    </div>
                  </form>

                  <div className="panel">
                    <div className="panel-heading">
                      {t("refund_billing_info")}{" "}
                    </div>

                    {billing.loading ? (
                      ""
                    ) : (
                      <div className="panel-body account pt-3">
                        <p className="text-muted">
                          {t("refund_billing_info_para")}
                        </p>
                        <form onSubmit={handleBillingSubmit}>
                          <input
                            type="hidden"
                            value={billing.data ? billing.data.user_billing_info_id : ""}
                          ></input>
                          <div className="form-group">
                            <label>{t("account_holder_name")}</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter holder name"
                              name="account_name"
                              onChange={handleBillingChange}
                              value={billing.data ? billing.data.account_name : ""}
                            />
                          </div>

                          <div className="form-group">
                            <label>{t("account_number")}</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder={t("enter_account_number")}
                              name="account_no"
                              onChange={handleBillingChange}
                              value={billing.data ? billing.data.account_no : ""}
                            />
                          </div>

                            <div className="form-group">
                              <label>{t("ifsc_code")}</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder={t("enter_ifsc_code")}
                                name="route_no"
                                onChange={handleBillingChange}
                                value={billing.data ? billing.data.route_no : ""}
                              />
                            </div>

                          <p> - - OR - - </p>

                          <div className="form-group">
                            <label>{t("paypal_email")}</label>
                            <input
                              type="email"
                              className="form-control"
                              placeholder={t("enter_your_paypal_email")}
                              name="paypal_email"
                              onChange={handleBillingChange}
                              value={billing.data ? billing.data.paypal_email : ""}
                            />
                          </div>

                          <button className="green-btn bottom1">
                            {t("update")}
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
};

export default withToastManager(translate(UserPayment));

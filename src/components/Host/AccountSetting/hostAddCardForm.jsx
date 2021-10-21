import React, { useState } from "react";
import api from "../../../HostEnvironment";
import { Link } from "react-router-dom";
import ToastDemo from "../../Helper/toaster";
import { translate, t } from "react-multi-lang";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const $ = window.$;

const HostAddCardForm = (props) => {

  const stripe = useStripe();
  const elements = useElements();
  const [addCardButtonDisable, setAddCardButtonDisable] = useState(false);
  const [addCardLoadingContent, setAddCardLoadingContent] = useState(null);

  const addCard = async (ev) => {
    ev.preventDefault();

    setAddCardButtonDisable(true);
    setAddCardLoadingContent("Loading... Please wait");
    if (stripe) {
      await stripe
          .createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement),
          })
          .then((payload) => {
            const inputData = {
              card_token: payload.paymentMethod.id,
            };
          api
            .postMethod("cards_add", inputData)
            .then(response => {
              if (response.data.success === true) {
                ToastDemo(
                  props.toastManager,
                  response.data.message,
                  "success"
                );
                $("#AddCardModel").modal("hide");
                window.location = "/host/payment";
              } else {
                setAddCardButtonDisable(false);
                setAddCardLoadingContent(null);
                ToastDemo(
                  props.toastManager,
                  response.data.error,
                  "error"
                );
              }
            })
            .catch(error => {
              setAddCardButtonDisable(false);
                setAddCardLoadingContent(null);
              ToastDemo(props.toastManager, error, "error");
            });
        })
        .catch(error => {
          setAddCardButtonDisable(false);
          setAddCardLoadingContent(null);
          ToastDemo(
            props.toastManager,
            "Please check your card details and try again..",
            "error"
          );
        });
    } else {
      setAddCardButtonDisable(false);
      setAddCardLoadingContent(null);
      ToastDemo(props.toastManager, "Stripe is not configured", "error");
    }
  };

  // const handleChange = ({ currentTarget: input }) => {
  //   const formaData = { ...this.state.formData };
  //   formaData[input.name] = input.value;
  //   this.setState({ formaData });
  // };

    return (
      <div className="modal fade" id="AddCardModel">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
            </div>

            <div className="modal-body">
              <h1 className="section-head">{t("add_a_payment_method")}</h1>
              <img src="../assets/img/cards.png" className="cards-img" />

              <form onSubmit={addCard}>
                {/* <div className="form-group bottom">
                  <label for="card" className="mt-0">
                    card number*
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="cardnumber"
                    onChange={this.handleChange}
                    value={formData.cardnumber}
                  />
                </div>
                <div className="row">
                  <div className="col-12 col-sm-6">
                    <div className="form-group bottom">
                      <label className="mt-0">expires on*</label>
                      <div className="row">
                        <div className="col-6">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="MM/YY"
                            name="expdate"
                            onChange={this.handleChange}
                          />
                        </div>
                        <div className="col-6">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="YYYY"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="form-group bottom">
                      <label className="mt-0">security code*</label>
                      <input
                        type="text"
                        className="form-control"
                        name="cvc"
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-sm-6">
                    <div className="form-group bottom">
                      <label className="mt-0">first name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="firstname"
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="form-group bottom">
                      <label className="mt-0">last name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="lastname"
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                </div>
                <p className="overview-line" /> */}

                <CardElement />
                <div className="text-right">
                  <Link
                    className="grey-outline-btn btn-small"
                    data-dismiss="modal"
                    to="#"
                  >
                    cancel
                  </Link>
                  <button
                    type="submit"
                    className="green-btn btn-small auto-width"
                    disabled={addCardButtonDisable}
                  >
                    {addCardLoadingContent != null ? addCardLoadingContent : t("add_card")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
};

export default translate(HostAddCardForm);

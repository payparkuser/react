import React, { Component } from "react";
import api from "../../../HostEnvironment";
import Map, { GoogleApiWrapper, Marker } from "google-maps-react";
import { withToastManager } from "react-toast-notifications";
import ToastDemo from "../../Helper/toaster";

import { apiConstants } from "../../../components/Constant/constants";
import configuration from "react-global-configuration";
import { translate, t } from "react-multi-lang";

class EditListing extends Component {
  state = {
    formData: {
      service_location_id: 0,
      latitude: "",
      longitude: "",
      city: "",
      state: "",
      country: "",
      street_details: "",
      zipcode: "",
      space_type: "driveway",
      space_owner_type: "owner",
      length_of_space: 1,
      width_of_space: 1,
      height_of_space: 1,
      total_spaces: 1,
      full_address: "",
      is_automatic_booking: 0,
      loading: true,
    },
    serviceLocations: null,
    loadingServiceLocation: true,
    spaceConfigurationAPI: null,
    loadingSpaceConfig: true,
    spaceConfiguration: null,
    loading: true,
    loadingContent: null,
    buttonDisable: false
  };

  componentDidMount() {
    this.getHostDetailsAPI();
    this.getServiceLocationAPI();
    this.getSpaceConfigurationAPI();
  }

  getHostDetailsAPI = () => {
    api
      .postMethod("spaces_view", { space_id: this.props.match.params.id })
      .then(response => {
        if (response.data.success) {
          this.setState({
            formData: response.data.data,
            loading: false
          });
        } else {
          // Do nothing
        }
      });
  };

  getServiceLocationAPI = () => {
    api.postMethod("service_locations").then(response => {
      if (response.data.success) {
        this.setState({
          serviceLocations: response.data.data,
          loadingServiceLocation: false,
          loading: false 
        });
      } else {
        // Do nothing
      }
    });
  };

  getSpaceConfigurationAPI = () => {
    api.postMethod("spaces_configurations", { space_id: this.props.match.params.id }).then(response => {
      if (response.data.success) {
        this.setState({
          spaceConfigurationAPI: response.data.data,
          loadingSpaceConfig: false,
          spaceConfiguration: response.data.data[0].features
        });
      } else {
        // Do nothing
      }
    });
  };

  renderAutoComplete = () => {
    const { google } = this.props;
    if (!google) {
      return;
    }
    const autocomplete = new google.maps.places.Autocomplete(
      this.autocomplete,
      { types: ["geocode"] }
    );

    autocomplete.setFields(["address_component", "geometry", "name"]);

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      console.log("Place", place);
      if (!place.geometry) return;
      this.setState({ position: place.geometry.location });
      const formData = { ...this.state.formData };
      formData["latitude"] = place.geometry.location.lat();
      formData["longitude"] = place.geometry.location.lng();
      let full_address = "";
      const addressOrder = place.address_components.reverse();
      addressOrder.map((address, index) => {
        if (index == 0) formData["country"] = address.long_name;
        if (index == 1) formData["state"] = address.long_name;
        if (index == 2) formData["city"] = address.long_name;
        if (index == 3) formData["street_details"] = address.long_name;
      });

      place.address_components.map(
        address =>
          (full_address =
            full_address == ""
              ? address.long_name
              : full_address + "," + address.long_name)
      );
      formData["full_address"] = full_address;

      this.setState({ formData });
    });
  };

  handleChangeFile = ({ currentTarget: input }) => {
    const formData = { ...this.state.formData };
    if (input.type === "file") {
      formData[input.name] = input.files[0];
      this.setState({ formData });
    }
  };

  handleChange = ({ currentTarget: input }) => {
    const formData = { ...this.state.formData };
    if (input.type == "checkbox") {
      if (input.checked) {
        if (formData[input.name] === undefined) {
          let array = [];
          array.push(input.value);
          formData[input.name] = array;
          this.setState({ formData });
        } else {
          formData[input.name].push(input.value);
          this.setState({ formData });
        }
      } else {
        let index = formData[input.name].indexOf(input.value);
        if (index !== -1) {
          formData[input.name].splice(index, 1);
          this.setState({ formData });
        }
      }
    } else if (input.type == "textarea") {
      formData[input.name] = input.value;
      formData["space_description"] = input.value;
      this.setState({ formData });
    } else {
      formData[input.name] = input.value;
      this.setState({ formData });
      if (input.name == "space_type") {
        this.state.spaceConfigurationAPI.map(detail => {
          if (formData[input.name] == detail.space_type) {
            this.setState({ spaceConfiguration: detail.features });
            formData["amenities"] = [];
            this.setState({ formData });
          }
        });
      }
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({
      loadingContent: "Loading... Please wait..",
      buttonDisable: true
    });
    api.postMethod("spaces_save", this.state.formData).then(response => {
      if (response.data.success) {
        this.setState({ loadingContent: null, buttonDisable: false });
        ToastDemo(this.props.toastManager, response.data.message, "success");
        this.props.history.push("/host/spaces");
      } else {
        this.setState({ loadingContent: null, buttonDisable: false });
        ToastDemo(this.props.toastManager, response.data.error, "error");
      }
    });
  };

  render() {
    const {
      formData,
      serviceLocations,
      loadingServiceLocation,
      loadingSpaceConfig,
      spaceConfiguration,
      loadingContent,
      buttonDisable,
      loading
    } = this.state;
    return (
      <div className="main">
          {loading ? (
                ""
            ) : (
        <div className="site-content">
          <div className="top-bottom-spacing add-listings">
            <div className="row">
              <div className="col-12">
                <h2 className="text-uppercase">{t("rent_out_your_space")}</h2>

                <h5 className="profile-note">
                  {t("rent_out_your_space_para")}
                </h5>

                <p className="overview-line-1"></p>
              </div>

              <div className="col-12 col-sm-12 col-md-7 col-lg-7 col-xl-8">
                <form>
                  <div className="host-section row">
                    <div className="col-12">
                      <h5 className="m-0 text-uppercase lh-1-4">
                        {t("where_is_your_parking_space")}
                      </h5>

                      <p className="overview-line-1"></p>
                    </div>

                    <div className="form-group col-6">
                      <label>{t("choose_service_location")}</label>

                      <select
                        className="form-control custom-select"
                        name="service_location_id"
                        onChange={this.handleChange}
                        value={formData.service_location_id}
                      >
                        <option>{t("select_service_location")}</option>
                        {loadingServiceLocation
                          ? ""
                          : serviceLocations.length > 0
                          ? serviceLocations.map(location => (
                              <option
                                key={location.service_location_id}
                                value={location.service_location_id}
                              >
                                {location.service_location_name}
                              </option>
                            ))
                          : ""}
                      </select>

                      <h5 className="profile-note">
                        {t("service_location_para")}
                      </h5>
                    </div>

                    <div className="form-group col-6">
                      <label>{t("enter_your_space_address")}</label>

                      <input
                        type="text"
                        className="form-control"
                        id="full_address"
                        placeholder={t("type_uk")}
                        onFocus={this.renderAutoComplete}
                        ref={ref => (this.autocomplete = ref)}
                        name="full_address"
                        value={formData.full_address}
                        onChange={this.handleChange}
                      />
                    </div>

                    <div className="form-group col-6">
                      <label>{t("street_details")}</label>

                      <input
                        type="text"
                        className="form-control"
                        id="street_details"
                        name="street_details"
                        value={formData.street_details}
                        onChange={this.handleChange}
                      />
                    </div>

                    <div className="form-group col-3">
                      <label>{t("city")}</label>

                      <input
                        type="text"
                        className="form-control"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={this.handleChange}
                      />
                    </div>

                    <div className="form-group col-3">
                      <label>{t("state")}</label>

                      <input
                        type="text"
                        className="form-control"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={this.handleChange}
                      />
                    </div>

                    <div className="form-group col-3">
                      <label>{t("country")}</label>

                      <input
                        type="text"
                        className="form-control"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={this.handleChange}
                      />
                    </div>

                    <div className="form-group col-3">
                      <label>{t("postal_code")}</label>

                      <input
                        type="text"
                        className="form-control"
                        id="zip_code"
                        name="zipcode"
                        value={formData.zipcode}
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>

                  <div className="host-section row">
                    <div className="col-12">
                      <h5 className="m-0 captalize lh-1-4">{t("about_your_space")}</h5>

                      <p className="overview-line-1"></p>
                    </div>

                    <div className="form-group col-9">
                      <label>{t("type_of_space")}</label>

                      <div className="switch-field">
                        <input
                          type="radio"
                          id="driveway"
                          name="space_type"
                          value="driveway"
                          onChange={this.handleChange}
                          // defaultChecked
                          checked={
                            formData.space_type === "driveway"
                              ? true
                              : false
                          }
                        />
                        <label htmlFor="driveway">{t("driveway")}</label>

                        <input
                          type="radio"
                          id="garage"
                          name="space_type"
                          value="garage"
                          onChange={this.handleChange}
                          checked={
                            formData.space_type === "garage"
                              ? true
                              : false
                          }
                        />
                        <label htmlFor="garage">{t("garage")}</label>

                        <input
                          type="radio"
                          id="carpark"
                          name="space_type"
                          value="carpark"
                          onChange={this.handleChange}
                          checked={
                            formData.space_type === "carpark"
                              ? true
                              : false
                          }
                        />
                        <label htmlFor="carpark">{t("car_park")}</label>
                      </div>
                    </div>
                    <div className="form-group col-9">
                      <label>{formData.space_type}</label>

                      <div className="switch-field">
                        {loadingSpaceConfig
                          ? ""
                          : spaceConfiguration.length > 0
                          ? spaceConfiguration.map((details, index) => (
                              <div key={details.amenity_lookup_id}>
                                <input
                                  type="checkbox"
                                  id={details.amenity_lookup_id}
                                  name="amenities"
                                  value={details.amenity_lookup_id}
                                  onChange={this.handleChange}
                                  checked={
                                    details.is_selected == 1
                                      ? "checked"
                                      : "false"
                                  }
                                />
                                <label htmlFor={details.amenity_lookup_id}>
                                  {details.value}
                                </label>
                              </div>
                            ))
                          : t("no_amenities")}
                      </div>
                    </div>

                    <div className="form-group col-12">
                      <label>{t("number_of_spaces")}</label>

                      <input
                        type="text"
                        className="form-control"
                        id="total_spaces"
                        name="total_spaces"
                        value={formData.total_spaces}
                        onChange={this.handleChange}
                      />
                    </div>

                    <div className="form-group col-12">
                        <h5>{t("parking_slot_dimensions")}</h5>
                    </div>

                    <div className="form-group col-4">
                      <label>{t("width")}</label>

                      <input
                        type="number"
                        className="form-control"
                        id="width_of_space"
                        name="width_of_space"
                        min="1"
                        value={formData.width_of_space}
                        onChange={this.handleChange}
                      />
                    </div>

                    <div className="form-group col-4">
                      <label>{t("height")}</label>

                      <input
                        type="number"
                        className="form-control"
                        id="height_of_space"
                        name="height_of_space"
                        min="1"
                        value={formData.height_of_space}
                        onChange={this.handleChange}
                      />
                    </div>

                    <div className="form-group col-4">
                      <label>{t("length")}</label>

                      <input
                        type="number"
                        className="form-control"
                        id="length_of_space"
                        name="length_of_space"
                        min="1"
                        value={formData.length_of_space}
                        onChange={this.handleChange}
                      />
                    </div>

                    <div className="form-group col-12">
                      <label>{t("i_am_a")}</label>

                      <div className="switch-field">
                        <input
                          type="radio"
                          id="radio-one"
                          name="space_owner_type"
                          value="owner"
                          onChange={this.handleChange}
                          checked={
                            formData.space_owner_type == "owner" ? true : false
                          }
                        />
                        <label htmlFor="radio-one">{t("individual_owner")}</label>
                        <input
                          type="radio"
                          id="radio-two"
                          name="space_owner_type"
                          onChange={this.handleChange}
                          value="business"
                          checked={
                            formData.space_owner_type == "business" ? true : false
                          }
                        />
                        <label htmlFor="radio-two">
                          Business / Organization
                        </label>
                      </div>
                    </div>
                    <div className="form-group col-12">
                      <label>{t("is_instant_booking")}</label>
                      <p className="text-muted">{t("is_instant_booking_para")}</p>
                      <div className="switch-field">
                        <input
                          type="radio"
                          id="radio-automatic"
                          name="is_automatic_booking"
                          value={1}
                          onChange={this.handleChange}
                          checked={
                            formData.is_automatic_booking == 1 ? true : false
                          }
                        />
                        <label htmlFor="radio-automatic">{t("on")}</label>
                        <input
                          type="radio"
                          id="radio-manual"
                          name="is_automatic_booking"
                          onChange={this.handleChange}
                          value={0}
                          checked={
                            formData.is_automatic_booking == 0 ? true : false
                          }
                        />
                        <label htmlFor="radio-manual">{t("off")}</label>
                      </div>
                    </div>
                  </div>


                  <div className="host-section row">
                    <div className="col-12">
                      <h5 className="m-0 text-uppercase lh-1-4">
                        {t("name_and_description")}
                      </h5>

                      <p className="overview-line-1"></p>
                    </div>

                    <div className="form-group col-12">
                      <label>{t("name")}</label>

                      <input
                        type="text"
                        className="form-control"
                        id="space_name"
                        name="space_name"
                        value={formData.space_name}
                        onChange={this.handleChange}
                      />
                    </div>

                    <div className="form-group col-12">
                      <label>{t("description")}</label>
                      <textarea
                        type="text"
                        className="form-control"
                        rows="4"
                        cols="5"
                        name="description"
                        value={formData.space_description}
                        onChange={this.handleChange}
                        placeholder="This is the description that will be shown on your parking space's page. For your own security, do not include your email or phone number."
                      ></textarea>

                      <h5 className="profile-note">
                        {t("description_para")}
                      </h5>
                    </div>
                    <div className="form-group col-12">
                      <label>{t("picture")}</label>

                      <input
                        type="file"
                        name="picture"
                        className="form-control"
                        onChange={this.handleChangeFile}
                      />
                    </div>
                  </div>

                  <div className="host-section row">
                    <div className="col-12">
                      <h5 className="m-0 text-uppercase lh-1-4">
                        {t("pricing_details")}
                      </h5>

                      <p className="overview-line-1"></p>
                    </div>

                    <div className="form-group col-6">
                      <label>{t("per_hour")}</label>

                      <input
                        type="text"
                        className="form-control"
                        id="per_hour"
                        name="per_hour"
                        value={formData.per_hour}
                        onChange={this.handleChange}
                      />
                    </div>

                    <div className="form-group col-6">
                      <label>{t("per_day")}</label>

                      <input
                        type="text"
                        className="form-control"
                        id="per_day"
                        name="per_day"
                        value={formData.per_day}
                        onChange={this.handleChange}
                      />
                    </div>
                    {/* <div className="form-group col-6">
                      <label>{t("per_week")}</label>

                      <input
                        type="text"
                        className="form-control"
                        id="per_week"
                        name="per_week"
                        value={formData.per_week}
                        onChange={this.handleChange}
                      />
                    </div> */}
                    <div className="form-group col-6">
                      <label>{t("per_month")}</label>

                      <input
                        type="text"
                        className="form-control"
                        id="per_month"
                        name="per_month"
                        value={formData.per_month}
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>

                  <div className="host-section row">
                    <div className="col-12">
                      <h5 className="m-0 text-uppercase lh-1-4">
                        {t("access_instructions")}
                      </h5>

                      <p className="overview-line-1"></p>
                    </div>

                    <div className="form-group col-12">
                      <textarea
                        type="text"
                        className="form-control"
                        rows="4"
                        cols="10"
                        name="access_note"
                        value={formData.access_note}
                        onChange={this.handleChange}
                      ></textarea>

                      <h5 className="profile-note">
                        {t("access_instructions_para")}
                      </h5>
                    </div>

                    <div className="form-group col-12">
                      <label>{t("access_methods")}</label>

                      <input
                        type="text"
                        className="form-control"
                        id="access_method"
                        name="access_method"
                        value={formData.access_method}
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <button
                      type="button"
                      className="green-btn mb-3"
                      onClick={this.handleSubmit}
                      disabled={buttonDisable}
                    >
                      {loadingContent != null ? loadingContent : t("add_your_space")}
                    </button>

                    <p>
                      <small className="text-gray mb-5">
                        {t("add_your_space_para1")}
                        {configuration.get("configData.site_name")}'s {t("add_your_space_para2")}  {configuration.get("configData.site_name")} {t("add_your_space_para3")}
                      </small>
                    </p>
                  </div>
                </form>
              </div>

              <div className="col-12 col-sm-12 col-md-5 col-lg-5 col-xl-4">
                <div className="box outer-box length">
                  <div className="inner content">
                    <img
                      src={
                        window.location.origin +
                        "/assets/img/parking/add-list.jpg"
                      }
                      className="listing-img"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
                            )}
      
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: apiConstants.google_api_key
})(withToastManager(translate(EditListing)));

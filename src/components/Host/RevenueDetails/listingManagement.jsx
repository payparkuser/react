import React, { Component } from "react";
import api from "../../../HostEnvironment";
import { Link } from "react-router-dom";
import ToastDemo from "../../Helper/toaster";
import { withToastManager } from "react-toast-notifications";
import { Search, Grid, Header, Segment } from "semantic-ui-react";
import { translate, t } from "react-multi-lang";
import _ from "lodash";
const DATE_OPTIONS = {
  year: "numeric",
  month: "short",
  day: "numeric"
};

class HostListingManagement extends Component {
  state = {
    listings: null,
    loading: true,
    skipCount: 0,
    loadingStatus: true,
    loadingContent: null,
    isLoading: false,
    results: [],
    value: ""
  };
  componentDidMount() {
    this.listingApiCall();
    if (this.props.location.state != null) {
      ToastDemo(
        this.props.toastManager,
        this.props.location.state.message,
        "success"
      );
    }
  }

  handleResultSelect = (e, { result }) =>
    this.setState({ value: result.space_name });

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value });

    setTimeout(() => {
      if (this.state.value.length < 1)
        return this.setState({
          isLoading: false,
          results: [],
          value: ""
        });

      const re = new RegExp(_.escapeRegExp(this.state.value), "i");
      const isMatch = result => re.test(result.space_name);

      this.setState({
        isLoading: false,
        results: _.filter(this.state.listings, isMatch)
      });
    }, 300);
  };

  hostStatusChange = (event, space_id) => {
    event.preventDefault();

    api.postMethod("spaces_status", { space_id: space_id }).then(response => {
      if (response.data.success) {
        this.setState({ loading: true, skipCount: 0, listings: null });
        this.listingApiCall();
        ToastDemo(this.props.toastManager, response.data.message, "success");
      }
    });
  };

  deleteHost = (event, space_id) => {
    event.preventDefault();
    api.postMethod("spaces_delete", { space_id: space_id }).then(response => {
      if (response.data.success) {
        this.setState({ loading: true, skipCount: 0, listings: null });
        this.listingApiCall();
        ToastDemo(this.props.toastManager, response.data.message, "success");
      }
    });
  };

  listingApiCall() {
    let items;
    api
      .postMethod("spaces_index", { skip: this.state.skipCount })
      .then(response => {
        if (response.data.success) {
          if (this.state.listings != null) {
            items = [...this.state.listings, ...response.data.data];
          } else {
            items = [...response.data.data];
          }
          this.setState({
            listings: items,
            loading: false,
            skipCount: response.data.data.length + this.state.skipCount,
            loadingStatus: true
          });
        }
      });
  }
  loadMore = event => {
    event.preventDefault();
    this.setState({ loadingStatus: false, loadingContent: "Loading..." });

    this.listingApiCall();
  };

  render() {
    const { loading, loadingContent, loadingStatus } = this.state;
    let listings;
    const { isLoading, value, results } = this.state;
    if (results.length > 0) {
      listings = results;
    } else {
      listings = this.state.listings;
    }
    return (
      <div className="main">
        <div className="container-fluid">
          <div className="rooms top-bottom-spacing">
            <div className="rooms-head">
              <div className="room-filter input-group mb-3">
                <Grid>
                  <Grid.Column width={6}>
                    <Search
                      loading={isLoading}
                      onResultSelect={this.handleResultSelect}
                      onSearchChange={_.debounce(this.handleSearchChange, 500, {
                        leading: true
                      })}
                      results={results}
                      value={value}
                      {...this.props}
                    />
                  </Grid.Column>
                </Grid>
              </div>
            </div>
            <div className="room-content">
              <div className="rooms-table table-responsive">
                <table className="cmn-table table">
                  <thead>
                    <tr>
                      <th scope="col">S.No</th>
                      <th scope="col">Name</th>
                      <th scope="col">
                        {t("instant_book")} <i className="fas fa-chevron-down" />
                      </th>
                      <th scope="col">
                        {t("space_type")} <i className="fas fa-chevron-down" />
                      </th>
                      <th scope="col">
                        {t("location")} <i className="fas fa-chevron-down" />
                      </th>
                      <th scope="col">
                        {t("status")} <i className="fas fa-chevron-down" />
                      </th>
                      <th scope="col">
                        {t("status")} <i className="fas fa-chevron-down" />
                      </th>
                      <th scope="col">{t("action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      ""
                    ) : listings.length > 0 ? (
                      listings.map((listing, index) => (
                        <tr key={listing.space_id}>
                          <td>{index + 1}</td>
                          <td>
                            <div>
                              <a href="#" className="room-list-img">
                                <img src={listing.space_picture} />
                              </a>
                              <div className="room-list-content">
                                <p className="room-list-tit">
                                  {listing.space_name}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="text-center">
                            {listing.is_automatic_booking == 1 ? (
                              <div className="light-img">
                                <img src="../assets/img/light.svg" />
                              </div>
                            ) : (
                              "-"
                            )}
                          </td>

                          <td className="text-center">{listing.space_type}</td>
                          <td>{listing.space_location}</td>
                          <td>
                            {listing.admin_space_status ? (
                              <small className="text-success">
                                <i className="fas fa-thumbs-up" /> 
                                {t("admin_approved")}
                              </small>
                            ) : (
                              <small className="text-danger">
                                <i className="fas fa-thumbs-down" /> {t("waiting_for_approval")}
                              </small>
                            )}

                            <div className="clearfix" />

                            {listing.provider_space_status ? (
                              <small className="text-success">
                                <i className="fas fa-check" /> {t("visible_for_user")}
                              </small>
                            ) : (
                              <small className="text-danger">
                                <i className="far fa-times-circle" /> {t("hided_for_user")}
                              </small>
                            )}

                            <div className="clearfix" />

                            {listing.is_admin_verified ? (
                              <small className="text-success">
                                <i className="fa fa-eye" /> {t("details_verified")}
                              </small>
                            ) : (
                              <small className="text-danger">
                                <i className="far fa-eye-slash" /> {t("waiting_for_verification")}
                              </small>
                            )}
                          </td>
                          <td>
                            {listing.updated_at
                              ? new Date(listing.updated_at).toLocaleDateString(
                                  "en-US",
                                  DATE_OPTIONS
                                )
                              : "-"}
                          </td>
                          <td>
                            <ul className="action-menu nav">
                              <li className="nav-item dropdown">
                                <a
                                  className="dropdown-toggle action-menu-icon"
                                  href="#"
                                  id="navbarDropdown"
                                  role="button"
                                  data-toggle="dropdown"
                                  aria-haspopup="true"
                                  aria-expanded="false"
                                >
                                  <img src="../assets/img/menu.svg" />
                                </a>
                                <div
                                  className="dropdown-menu dropdown-menu-right animate slideIn"
                                  aria-labelledby="navbarDropdown"
                                >
                                  <Link
                                    className="dropdown-item"
                                    to={`/host/edit-space/${listing.space_id}`}
                                  >
                                    <i className="far fa-edit" /> Edit
                                  </Link>
                                  <a
                                    className="dropdown-item"
                                    href="#"
                                    onClick={event =>
                                      window.confirm("Are you sure?") &&
                                      this.hostStatusChange(
                                        event,
                                        listing.space_id
                                      )
                                    }
                                  >
                                    <i className="far fa-copy" />{" "}
                                    {listing.provider_space_status != 1
                                      ? "Enable Visibility"
                                      : "Disable Visibility"}{" "}
                                  </a>

                                  <Link
                                    className="dropdown-item"
                                    to={`/host/gallery/${listing.space_id}`}
                                  >
                                    <i className="far fa-image" /> Gallery
                                  </Link>
                                  {/* <Link
                                    className="dropdown-item"
                                    to={`/host/availability/${listing.space_id}`}
                                  >
                                    <i className="far fa-image" /> Availability
                                  </Link> */}
                                  <Link
                                    className="dropdown-item"
                                    to={{
                                      pathname: `/host/availability/${listing.space_id}`,
                                      state: {
                                        days: listing.available_days
                                      }
                                    }}
                                  >
                                    <i className="far fa-image" /> Availability
                                  </Link>
                                  <a
                                    className="dropdown-item"
                                    href="#"
                                    onClick={event =>
                                      window.confirm("Are you sure?") &&
                                      this.deleteHost(event, listing.space_id)
                                    }
                                  >
                                    <i className="fas fa-trash-alt" /> Delete
                                  </a>
                                  {listing.complete_percentage >= 75 ? (
                                    <Link
                                      className="dropdown-item"
                                      to={`/host/single/${listing.space_id}`}
                                    >
                                      <i className="fas fa-eye" /> Preview
                                    </Link>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </li>
                            </ul>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="no-data">
                        <td colspan="7">
                          <img src="../assets/img/parking/no-data.svg" />
                          <h5>{t("no_data")}</h5>
                        </td>
                      </tr>
                    )}
                    {loadingStatus ? "" : loadingContent}
                  </tbody>
                </table>
                {loading ? (
                  ""
                ) : listings.length > 0 ? (
                  <Link to={"#"} onClick={this.loadMore}>
                    {t("load_more")}
                  </Link>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withToastManager(translate(HostListingManagement));

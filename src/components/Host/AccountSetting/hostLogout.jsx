import React, { Component } from "react";

class HostLogout extends Component {
  componentDidMount() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("hostId");
    localStorage.removeItem("hostLoginStatus");
    localStorage.removeItem("space_picture");
    localStorage.removeItem("provider_name");
    window.location = "/host";
  }
  render() {
    return null;
  }
}

export default HostLogout;

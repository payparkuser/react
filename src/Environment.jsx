import React from "react";

import { Redirect } from "react-router-dom";
import axios from "axios";
import { withToastManager } from "react-toast-notifications";
import ToastDemo from "./components/Helper/toaster";

import { apiConstants } from "./components/Constant/constants";

const apiUrl = "https://admin-rentpark.rentcubo.info/api/user/"; // Production Mode

// const apiUrl = "http://adminpark-staging.streamtunes.info/api/user/"; // Developement Mode

// const apiUrl = "http://localhost:8000"; // Development Mode

const Environment = {
    postMethod(action, object) {
        let userId =
            localStorage.getItem("userId") !== "" &&
            localStorage.getItem("userId") !== null &&
            localStorage.getItem("userId") !== undefined
                ? localStorage.getItem("userId")
                : "";

        let accessToken =
            localStorage.getItem("accessToken") !== "" &&
            localStorage.getItem("accessToken") !== null &&
            localStorage.getItem("accessToken") !== undefined
                ? localStorage.getItem("accessToken")
                : "";

        const url = apiUrl + action;

        let formData = new FormData();

        // By Default Id and token

        formData.append("id", userId);
        formData.append("token", accessToken);

        var socialLoginUser = 0;

        // append your data
        for (var key in object) {
            formData.append(key, object[key]);

            if (key === "social_unique_id") {
                socialLoginUser = 1;
            }
        }

        // By Default added device type and login type in future use
        if (!socialLoginUser) {
            formData.append("login_by", apiConstants.LOGIN_BY);
        }

        formData.append("device_type", apiConstants.DEVICE_TYPE);
        formData.append("device_token", apiConstants.DEVICE_TOKEN);

        return axios.post(url, formData);
    },

    getMethod(action, object) {
        let userId =
            localStorage.getItem("userId") !== "" &&
            localStorage.getItem("userId") !== null &&
            localStorage.getItem("userId") !== undefined
                ? localStorage.getItem("userId")
                : "";
        let accessToken =
            localStorage.getItem("accessToken") !== "" &&
            localStorage.getItem("accessToken") !== null &&
            localStorage.getItem("accessToken") !== undefined
                ? localStorage.getItem("accessToken")
                : "";

        const url = apiUrl + action;

        let formData = new FormData();

        // By Default Id and token

        formData.append("id", userId);
        formData.append("token", accessToken);

        // append your data
        for (var key in object) {
            formData.append(key, object[key]);
        }

        // By Default added device type and login type in future use

        formData.append("login_by", apiConstants.LOGIN_BY);
        formData.append("device_type", apiConstants.DEVICE_TYPE);
        formData.append("device_token", apiConstants.DEVICE_TOKEN);

        return axios.get(url, formData);
    },
    postMethodWithResponse(action, object) {
        let userId =
            localStorage.getItem("userId") !== "" &&
            localStorage.getItem("userId") !== null &&
            localStorage.getItem("userId") !== undefined
                ? localStorage.getItem("userId")
                : "";

        let accessToken =
            localStorage.getItem("accessToken") !== "" &&
            localStorage.getItem("accessToken") !== null &&
            localStorage.getItem("accessToken") !== undefined
                ? localStorage.getItem("accessToken")
                : "";

        const url = apiUrl + action;

        let formData = new FormData();

        // By Default Id and token
        formData.append("id", userId);

        formData.append("token", accessToken);

        var socialLoginUser = 0;

        // append your data
        for (var key in object) {
            formData.append(key, object[key]);
            if (key === "social_unique_id") {
                socialLoginUser = 1;
            }
        }

        // By Default added device type and login type in future use
        if (!socialLoginUser) {
            formData.append("login_by", apiConstants.LOGIN_BY);
        }

        formData.append("device_type", apiConstants.DEVICE_TYPE);

        formData.append("device_token", apiConstants.DEVICE_TOKEN);

        axios.post(url, formData).then(response => {
            console.log("postMethodWithResponse", response);
            if (response.data.success) {
                return response;
            } else {
                if (
                    response.data.error == 1001 ||
                    response.data.error == 1002 ||
                    response.data.error == 1003 ||
                    response.data.error == 1004 ||
                    response.data.error == 1005 ||
                    response.data.error == 1006 ||
                    response.data.error == 1007
                ) {
                    localStorage.setItem("userLoginStatus", false);
                }

                setTimeout(() => {
                    window.location = "/logout";
                }, 1000);

                return response;
            }
        });
    }
};

export default Environment;

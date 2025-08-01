import axios from "axios";
import Modal, {
  ModalVariants,
} from "@hid-galaxy-ui/galaxy-react/components/Modal";
import { environment } from "../common/environment";
// import { root } from "./../index";

export function serviceCall(url = ``, method = "GET", data = {}, headers = {}) {
  return axios({
    url,
    method,
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      ...{
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "x-token": sessionStorage.getItem("authToken"),
      }, ...headers
    },
    // withCredentials: true,
    redirect: "follow",
    data: JSON.stringify(data),
  }).then((response) => {
    return response;
  });
}

export function sessionExpired() {
  function handleClose() {
    let location = window.location;
    let loginUrl = location.origin + "/mobile-identities";
    window.location = loginUrl;
    window.close();
  }

  const element = (
    <Modal
      size={ModalVariants.Medium}
      onClose={() => handleClose()}
      headerText="Session Timed Out"
      footerConfig={{
        primaryBtnLabel: "OK",
        onClickPrimaryBtn: handleClose,
      }}
      isDisplayCloseButton={false}
    >
      <p>Missing authentication.</p>
      <br />
      <p>Kindly Login Again</p>
    </Modal>
  );
  // root.render(element);
}

export const getAccessToken = async (issuanceToken) => {
  try {
    const response = await serviceCall(
      environment.GET_TOKEN_DETAILS,
      "POST",
      {issuanceToken}
    );
    if(response.data) {
      sessionStorage.setItem("accessToken", response.data.accessToken);
      console.log("response getAccessToken", response.data);
    }
    return response;
  } catch (err) {
    return err;
  }
};

export const provisionAPI = async (postData) => {
  try {
    const response = await serviceCall(
      environment.PROVISIONING,
      "POST",
      postData,      
      { Authorization: `Bearer ${sessionStorage.getItem("accessToken")}` }
    );
    console.log("response getAccessToken", response.data)
    return response;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const platformListAPI = async (postData) => {
  try {
    const response = await serviceCall(
      environment.PLATFORMS,
      "POST",
      postData,      
      { Authorization: `Bearer ${sessionStorage.getItem("accessToken")}` }
    );
    //console.log("response platformListAPI", response.data)
    return response;
  } catch (err) {
    return err;
  }
};

export const getApplicationDetails = async () => {
  try {
    const response = await serviceCall(
      environment.APPLICATION_DETAILS,
    );
    if(response.data) {
      sessionStorage.setItem("google-clientId", response.data.google.clientId);
      sessionStorage.setItem("google-clientSecret", response.data.google.clientSecret);
      sessionStorage.setItem("google-redirectUrl", response.data.google.redirectUrl);
      sessionStorage.setItem("applicationId", response.data.applicationId);
    }
    return response;
  } catch (err) {
    console.error(err);
  }
};
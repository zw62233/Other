import { ReactElement, useEffect, useState } from "react";
import { Loader, LoaderSizes, Typography, TypographyVariant } from "@hid-galaxy-ui/galaxy-react";
import googleWalletBadge from "../../assets/images/google_wallet_badge.png";
import googleWalletBtn from '../../assets/images/google_wallet_button.png';
import { provisionAPI } from "../../service/service";
import { useLocation, useNavigate } from "react-router-dom";
import { qrCodePath } from "../../AppRoutes";
import NeedFurtherHelpComponent from "../pages/NeedFurtherHelpComponent";
import { getDeviceType } from "../../utils";

declare global {
  interface Window {
    getGoogleWalletUrl: (blob: any) => string;
  }
}
export default function GoogleWalletComponent(): ReactElement {
  const location = useLocation();
  const navigate = useNavigate();

  const [deviceType, setDeviceType] = useState("Unknown");
  const [errorMessage, setErrorMessage] = useState("");
  const [showLoader, setShowLoader] = useState(false);

  //const provisioningError = 'Error occurred while provisioning Pass, please try again.'

  useEffect(() => {
    setDeviceType(getDeviceType())
  }, []);
  const invokeProvisionAPI = async () => {
    try {
      setErrorMessage('');
      setShowLoader(true);
      if (!location?.state?.issuanceCode) {
        throw new Error("No issuance code");
      }
      if (!location?.state?.googleIdToken || !location?.state?.googleAccessToken) {
        throw new Error("Issue with Google login");
      }
      const provisionResponse: any = await provisionAPI({
        "issuanceToken": location?.state?.issuanceCode,
        "walletType": "GOOGLE_WALLET",
        "googleWallet": {
          "idToken": location?.state?.googleIdToken,
          "accessToken": location?.state?.googleAccessToken
        }
      });
      if (provisionResponse.data &&
        provisionResponse.data.provisioningData &&
        provisionResponse.data.provisioningData.googleWallet &&
        provisionResponse.data.provisioningData.googleWallet.blob) {
        goToGoogleWallet(provisionResponse.data.provisioningData.googleWallet.blob);
      } else {
        setErrorMessage(provisionResponse?.responseHeader?.statusMessage || 
          provisionResponse?.response?.data?.responseHeader?.statusMessage);
      }
      setShowLoader(false);
    } catch (error:any) {
      setErrorMessage(error?.message)
      setShowLoader(false);
    }
  }
  const goToGoogleWallet = (blob: string) => {
    const googleWalletUrl = window.getGoogleWalletUrl(blob);
    if (deviceType === "android") {
      window.open(googleWalletUrl);
    } else {
      navigate(qrCodePath, {
        state: { code: googleWalletUrl },
      })
    }
  };
  return (
    <>
      <div className="hid-grid hid-layout__pl-04 hid-layout__pb-05 hid-layout__mr-03">
        <div className="hid-grid__column hid-grid__column--12-xs hid-text-center">
          <img
            alt=""
            src={googleWalletBadge}
            className="google-wallet-badge-img"
          />
        </div>
      </div>
      <div className="inner-app-container">
        <div className="hid-grid-container hid-align-div">      
          <div className="hid-grid__column hid-grid__column--12-xs">
            <div className="hid-grid hid-layout__mb-05">
              <div className="hid-grid__column">
                {showLoader && (
                  <div className="hid-spacing__mt-03 hid-text-center">
                    <Loader isOverlay variant={LoaderSizes.large} />
                  </div>
                )}
                {!errorMessage ? <>
                  <Typography
                    variant={TypographyVariant.H2}
                    className="hid-origo-font-family hid-layout__mt-05"
                  >
                    Add your Badge to Google Wallet
                  </Typography>
                  <Typography
                    variant={TypographyVariant.BodyShortMarketing}
                    className=" hid-layout__mt-02"
                  >
                    Just click the button below to and add your badge to your Android phone.
                  </Typography>
                  <div style={{ cursor: "pointer" }} id="googleWallet" className="hid-layout__mt-05" onClick={invokeProvisionAPI}><img
                    alt=""
                    src={googleWalletBtn}
                  />
                  </div></> : <Typography variant={TypographyVariant.H2}
                    className=" hid-layout__mt-02">{errorMessage}</Typography>
                }
              </div>
            </div>
          </div>
          <NeedFurtherHelpComponent />
        </div>
      </div>
    </>
  );
}
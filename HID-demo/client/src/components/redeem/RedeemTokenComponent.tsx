import { ReactElement, useEffect, useState } from "react";
import { Loader, LoaderSizes, Typography, TypographyVariant } from "@hid-galaxy-ui/galaxy-react";
import GoogleLoginComponent from "../googleLogin/GoogleLoginComponent";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppleWalletComponent from "../appleWallet/AppleWalletComponent";
import { useLocation } from "react-router-dom";
import { platformListAPI } from "../../service/service";
import NeedFurtherHelpComponent from "../pages/NeedFurtherHelpComponent";
import { getDeviceType } from "../../utils";

export default function RedeemTokenComponent(): ReactElement {
  const location = useLocation();
  const [supportedPlatforms, setSupportedPlatforms] = useState<any[]>([]);
  const [showLoader, setShowLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [platformSpecificError, setPlatformSpecificError] = useState<string>('');
  const [deviceType, setDeviceType] = useState<string>('');
  const platformList = async (_deviceType: string) => {
    try {
      setShowLoader(true);
      setErrorMessage('');
      setPlatformSpecificError('');
      let platformResponse:any = await platformListAPI({
        "issuanceToken": location?.state?.issuanceCode
      });
      if (platformResponse && platformResponse.status === 200) {
        const platformList = platformResponse?.data?.supportedServiceList;
        setSupportedPlatforms(platformList);

        if(_deviceType === 'android' && platformList.indexOf('GOOGLE_WALLET') === -1) {
          setPlatformSpecificError('This pass can only be redeemed on Apple devices. Please use an Apple device or compatible web browser (Desktop/laptop) to access the redemption link.')
        }

        if(_deviceType === 'apple' && platformList.indexOf('APPLE_WALLET') === -1) {
          setPlatformSpecificError('This pass can only be redeemed on Android devices. Please use any Android device or compatible web browser (Desktop/laptop) to access the redemption link.')
        }

        if (((platformList.length >= 1 && platformList.indexOf('APPLE_WALLET') === -1
          && platformList.indexOf('GOOGLE_WALLET') === -1) ) || platformList.length === 0){
            setErrorMessage('This functionality is not supported on your platform. Please contact your administrator for assistance.');
        }

      } else {
        setErrorMessage(platformResponse?.responseHeader?.statusMessage || 
          platformResponse?.response?.data?.responseHeader?.statusMessage);
      }
      setShowLoader(false);
    } catch (error: any) {
      setShowLoader(false)
      setErrorMessage(error?.message)
      setSupportedPlatforms([]);
    }
  }

  useEffect(() => {
    try {
      if (location?.state?.issuanceCode) {
        let _deviceType = getDeviceType();
        platformList(_deviceType);
        setDeviceType(_deviceType);        
      }
    } catch (error) {
      console.error(error);
    }
  }, [location?.state?.issuanceCode])

  return (
    <>
      <div className="hid-grid div-show-for-mobile hid-layout__pl-04 hid-layout__pb-05 hid-layout__mr-03">
        <div className="hid-grid__column">
          <Typography
            variant={TypographyVariant.H1}
            className="hid-origo-font-family"
          >
            Choose your Wallet
          </Typography>
          <Typography
            variant={TypographyVariant.BodyShortMarketing}
            className=" hid-layout__mt-02"
          >
            To add your Pass to your Wallet, please choose the device you wish to redeem your Pass.
          </Typography>
        </div>
      </div>
      <div className="inner-app-container">
        <div className="hid-grid-container">
          <div className="hid-grid__column hid-grid__column--12-xs">
            <div className="hid-grid hid-text-center div-hide-for-mobile hid-layout__mb-05">
              <div className="hid-grid__column">
                <Typography
                  variant={TypographyVariant.H1}
                  className="hid-origo-font-family"
                >
                  Choose your Wallet
                </Typography>
                <Typography
                  variant={TypographyVariant.BodyShortMarketing}
                  className=" hid-layout__mt-02"
                >
                  To add your Pass to your Wallet, please choose the device you wish to redeem your Pass.
                </Typography>
              </div>
            </div>
            <div className="hid-grid">
              {showLoader && (
                <div className="hid-spacing__mt-03 hid-text-center">
                  <Loader isOverlay variant={LoaderSizes.large} />
                </div>
              )}
              {errorMessage && <div className="hid-grid__column hid-grid__column--12-xs hid-layout__mt-02 error-msg hid-text-center">{errorMessage}</div>}

              {platformSpecificError && 
                <>
                <div className="hid-grid__column hid-grid__column--12-xs hid-layout__mt-02 error-msg hid-text-center">
                  <strong>Redemption Not Allowed</strong>
                </div>
                <div className="hid-grid__column hid-grid__column--12-xs hid-layout__mt-02 error-msg hid-text-center">{platformSpecificError}</div>
                </>
              }

              {!platformSpecificError && <>
                {(supportedPlatforms.includes('APPLE_WALLET') && deviceType !== 'android')&& <div className="hid-grid__column  hid-grid__column--12-xs hid-grid__column--5-lg" style={{ display: "flex", justifyContent: "center" }}>
                  <div className="hid-grid apple-wallet-div ">
                    <div className="hid-grid__column hid-grid__column--12-xs  hid-layout__pl-05">
                      <div className="hid-grid">
                        <div className="hid-grid__column hid-grid__column--12-xs   hid-layout__mb-01">
                          <Typography
                            variant={TypographyVariant.H1}
                          >Apple Wallet</Typography>
                        </div>
                        <div className="hid-grid__column  hid-grid__column--12-xs hid-layout__pb-04">Redeem on Apple device
                        </div>
                        <div className="hid-grid__column  hid-grid__column--12-xs hid-layout__pt-04">
                          <AppleWalletComponent issuanceCode={location?.state?.issuanceCode}/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>}
                <div className="hid-grid__column hid-text-center hid-grid__column--12-xs hid-grid__column--2-lg"></div>
                {(supportedPlatforms.includes('GOOGLE_WALLET') && deviceType !== 'apple') && <div className="hid-grid__column  hid-grid__column--12-xs hid-grid__column--5-lg" style={{ display: "flex", justifyContent: "center" }}>

                  <div className="hid-grid google-wallet-div ">
                    <div className="hid-grid__column hid-grid__column--12-xs  hid-layout__pl-05">
                      <div className="hid-grid">
                        <div className="hid-grid__column hid-grid__column--12-xs   hid-layout__mb-01">
                          <Typography
                            variant={TypographyVariant.H1}
                          >Google Wallet</Typography>
                        </div>
                        <div className="hid-grid__column  hid-grid__column--12-xs hid-layout__pb-04">Redeem on Android device
                        </div>
                        <div className="hid-grid__column  hid-grid__column--12-xs hid-layout__pt-04">
                          <GoogleOAuthProvider clientId={sessionStorage.getItem('google-clientId') || ''}>
                            <GoogleLoginComponent issuanceCode={location?.state?.issuanceCode} />
                          </GoogleOAuthProvider>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>}
              </>}
            </div>
          </div>
          <NeedFurtherHelpComponent/>          
        </div>
      </div>
    </>
  );
}
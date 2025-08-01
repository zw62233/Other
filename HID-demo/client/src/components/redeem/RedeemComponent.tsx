import { ReactElement, useEffect, useState } from "react";
import Button from "@hid-galaxy-ui/galaxy-react/components/Button";
import TextField from "@hid-galaxy-ui/galaxy-react/components/TextInput";
import { getAccessToken, getApplicationDetails } from "../../service/service";
import { Loader, PasswordInput, Typography, TypographyVariant } from "@hid-galaxy-ui/galaxy-react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router";
import { LoaderSizes } from "@hid-galaxy-ui/galaxy-react/components/Loader/loaderEnums";
import { redeemTokenPath } from "../../AppRoutes";

export default function RedeemComponent(): ReactElement {
  const navigate = useNavigate();
 
  const [emailAddress, setEmailAddress] = useState("test@example.com")
  const [password, setPassword] = useState("example")

  const [getParams, setGetParams] = useSearchParams();
  const [issuanceCode, setIssuanceCode] = useState<string | null>(null);
  const [issuanceError, setIssuanceError] = useState<string | null>('');
  const [errMessage, setErrMessage] = useState<string | null>('');
  const [showLoader, setShowLoader] = useState(false);

   useEffect(() => {    
    const _issuanceCode = getParams.get('issuanceCode');
    if (!_issuanceCode) {
      //setIssuanceError('Issuance token is missing to proceed.');
      navigate("/wpp/pageNotFound", { replace: true });
    }
    setIssuanceCode(atob(_issuanceCode || ''));
  }, [getParams])

  const onEnterPress = (e: any) => {
    if (e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault();
      emailAddress && password && handleNext();
    }
  }

  const handleNext = async () => {
    setShowLoader(true);
    setErrMessage('');
    if (issuanceCode) {
      try {
        getApplicationDetails();
        const response:any = await getAccessToken(issuanceCode);       
        if (response && response.data && response.status === 200) {
          if(response.data && response.data.accessToken) {
            setShowLoader(false);
            navigate(redeemTokenPath, {
              state: { token: response.data.accessToken, issuanceCode: issuanceCode },
            })
          }
        } else {
          //setErrMessage('Error occurred while fetching access token.');
          setErrMessage(response?.responseHeader?.statusMessage || 
            response?.response?.data?.responseHeader?.statusMessage);
        }
        setShowLoader(false);
        console.log('response', response);
      }
      catch (err:any) {
        console.log('err', err);

        setShowLoader(false);
        setErrMessage(err?.message)
      }
    }
  };
  return (
    <div className="inner-app-container-token">
      <div className="hid-grid-container hid-grid-example">
        <div className="hid-grid__column hid-grid__column--12-xs hid-grid__column--12-sm hid-grid__column--12-md hid-grid__column--12-lg">
          <div className="hid-grid">
            <div className="hid-grid__column hid-grid__column--12-xs">
              {issuanceError || errMessage ? (
                <h5 className="heading-5 error-msg margin-bottom-22">
                  {issuanceError || errMessage}
                </h5>
              ) : (
                ""
              )}
            </div>
            <div className="hid-grid__column hid-grid__column--12-xs">
              <Typography
                variant={TypographyVariant.H1}
                className="hid-origo-font-family h1-title"
              >
                Sign In
              </Typography>

              <h5
                className="hid-origo-font-family hid-layout__mt-02 hid-layout__mb-02"
              >
                To add your Pass to your Wallet, sign in with your credentials.
              </h5>              
              {showLoader && (
                  <div className="hid-spacing__mt-03 hid-text-center">
                    <Loader isOverlay variant={LoaderSizes.large}/>
                  </div>
                )}
              <div className="hid-layout__mt-02">
                <TextField
                  label="E-mail"
                  id="emailAddress"
                  name="emailAddress"
                  placeholder="Type E-mail here"
                  value={emailAddress}
                  onChange={(event: any): void => { setEmailAddress(event.currentTarget.value.trim()) }}
                  inputProps={{ 'onKeyDown': (event: any): void => onEnterPress(event) }}
                  disabled={true}
                /></div>
              <div className="hid-layout__mt-02">
                <PasswordInput
                  label="Password"
                  id="password"
                  name="password"
                  placeholder="Type password here"
                  value={password}
                  onChange={(event: any): void => { setPassword(event.currentTarget.value.trim()) }}
                  inputProps={{ 'onKeyDown': (event: any): void => onEnterPress(event) }}
                  disabled={true}
                /></div>
              <div className="hid-layout__mt-05">
                <Button
                  label="PROCEED"
                  variant="primary"
                  className={`btn-primary btn-width-300`}
                  disabled={emailAddress.length === 0 || password.length === 0 || issuanceError?.length !== 0}
                  onClick={handleNext}
                /></div>
            </div>
          </div>
        </div>       
      </div>
    </div>
  );
}
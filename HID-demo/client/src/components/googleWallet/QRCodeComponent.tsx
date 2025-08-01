import { ReactElement, useEffect, useState } from "react";
import { Typography, TypographyVariant } from "@hid-galaxy-ui/galaxy-react";
import QRCode from "react-qr-code";
import { useLocation } from "react-router-dom";
import NeedFurtherHelpComponent from "../pages/NeedFurtherHelpComponent";

export default function QRCodeComponent(): ReactElement {
  const location = useLocation();
  const [qrCode, setQRCode] = useState<string>("");
  useEffect(() => {
    if(location.state.code) {
      setQRCode(location.state.code);
    }
  }, [location.state.code]);
  return (
    <>
      <div className="inner-app-container">
        <div className="hid-grid-container hid-text-center">
          <div className="hid-grid__column hid-grid__column--12-xs">
            <div className="hid-grid hid-layout__mb-05 hid-layout__mt-05">
              <div className="hid-grid__column">
                {qrCode && <QRCode value={qrCode}/>}
                <Typography
                  variant={TypographyVariant.H1}
                  className="hid-origo-font-family hid-layout__mt-02"
                >
                  Scan QR Code
                </Typography>
                <Typography
                  variant={TypographyVariant.BodyShortMarketing}
                  className=" hid-layout__mt-02"
                >
                  Scan QR on the Device to Redeem Pass
                </Typography>
              </div>
            </div>
          </div>
         <NeedFurtherHelpComponent/>
        </div>
      </div>
    </>
  );
}
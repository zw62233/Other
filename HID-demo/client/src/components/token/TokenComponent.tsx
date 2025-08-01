import { ReactElement, useState } from "react";
import Button from "@hid-galaxy-ui/galaxy-react/components/Button";
import TextField from "@hid-galaxy-ui/galaxy-react/components/TextInput";
import { Typography, TypographyVariant } from "@hid-galaxy-ui/galaxy-react";
import { useNavigate } from "react-router";
import { redeemPath } from "../../AppRoutes";

export default function TokenComponent(): ReactElement {
  const navigate = useNavigate();
  const [invitationCode, setInvitationCode] = useState("");

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      handleNext();
    }
  };
  const handleNext = async () => {
    if (invitationCode) {
      navigate(redeemPath + "?issuanceCode=" + btoa(invitationCode));
    }
  };
  return (
    <div className="inner-app-container-token">
      <div className="hid-grid-container hid-grid-example">
        <div className="hid-grid__column--12-xs hid-grid__column--12-sm hid-grid__column--12-md hid-grid__column--12-lg">
          <div className="hid-grid" style={{justifyContent: "center"}}>
             <div className="">
             <div className="hid-layout__mt-02"><Typography
                variant={TypographyVariant.H1}
                className="hid-origo-font-family h1-title"
              >
                Invitation Code
              </Typography></div>        
              <div className="hid-layout__mt-02">
                <TextField
                  id="invitationCode"
                  name="invitationCode"
                  placeholder="Type Invitation Code here"
                  value={invitationCode}
                  onChange={(event: any): void => { setInvitationCode(event.currentTarget.value.trim()) }}
                  inputProps={{ 'onKeyDown': (event: any): void => handleKeyDown(event) }}
                /></div>
              <div className="hid-layout__mt-05">
                <Button
                  label="PROCEED"
                  variant="primary"
                  className={`btn-primary btn-width-300`}
                  disabled={invitationCode?.length === 0}
                  onClick={handleNext}
                /></div>
            </div>
          </div>
        </div>
        <div className="hid-grid hid-layout__pb-06">
          <div className="hid-grid__column hid-flex">
          </div>
        </div>
      </div>
    </div>
  );
}
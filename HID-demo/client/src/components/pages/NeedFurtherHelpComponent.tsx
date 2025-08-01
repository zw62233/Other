import { Modal, Typography, TypographyVariant } from "@hid-galaxy-ui/galaxy-react";
import { useState } from "react";

export default function NeedFurtherHelpComponent() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div className="hid-grid__column hid-grid__column--12-xs">
        <div className="hid-grid">
          <div className="hid-grid__column hid-text-center hid-layout__mt-03 cursor-pointer" onClick={() => setShowModal(true)}>Need Further Help?</div></div>
      </div>
      {showModal &&
        <Modal
          isFocusTrapActive={false}
          width={400}
          onClose={() => {
            setShowModal(false);
          }}
          headerText={"Need Further Help?"}
          isDisplayCloseIcon={true}
        >
          <div>
            <Typography
              className="hid-origo-font-family"
              variant={TypographyVariant.BodyShortMarketing}
            >
              We are here to assist you! If you have any questions, require additional support, or need guidance on any issue, feel free to reach out to us
            </Typography>
          </div>
        </Modal>}
    </>
  );
}
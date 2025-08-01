import { ReactElement, FC } from "react";

const FooterComponent: FC = (): ReactElement => {
  return (
    <footer className="hid-footer" data-testid="footer">
      <div className="hid-footer--base">
        <div className="hid-grid-container">
          <div className="hid-grid">
            <div className="hid-grid__column hid-grid__column--12-xs">
              <div className="hid-flex">
                <span>
                  ©{new Date().getFullYear()} HID Global Corporation/ASSA ABLOY AB. All Rights Reserved</span>
                <ul className="hid-footer__nav">
                  <li className="hid-footer__nav-list">
                  <span className="footer-privacy-notice-margin">
                    <a
                      href="https://www.hidglobal.com/about/privacy"
                      className="hid-link"
                      target="_blank"
                      rel="noreferrer"
                    >
                    Privacy Statement
                    </a>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default FooterComponent;
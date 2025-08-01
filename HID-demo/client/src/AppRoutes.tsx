import { RouteObject, useRoutes } from "react-router-dom";
import App from "./App";
import PageNotFound from "./components/pages/PageNotFound";
import RedeemComponent from "./components/redeem/RedeemComponent";
import GoogleWalletComponent from "./components/googleWallet/GoogleWalletComponent";
import QRCodeComponent from "./components/googleWallet/QRCodeComponent";
import TokenComponent from "./components/token/TokenComponent";
import RedeemTokenComponent from "./components/redeem/RedeemTokenComponent";

export const APP_MAIN_PATH = '/';
export const APP_SUB_PATH = 'wpp';
export const appRootPath = APP_MAIN_PATH + APP_SUB_PATH;

export const tokenPath = appRootPath + "/token";
export const redeemPath = appRootPath + "/redeem";
export const redeemTokenPath = appRootPath + "/redeemToken";
export const addToGoogleWalletPath = appRootPath + "/addToGoogleWallet";
export const qrCodePath = appRootPath + "/qrCode";

let appPaths: Array<RouteObject> = [
  {
    path: tokenPath,
    element: <TokenComponent />,
  },
  {
    path: redeemPath,
    element: <RedeemComponent />,
  },
  {
    path: redeemTokenPath,
    element: <RedeemTokenComponent />,
  },
  {
    path: addToGoogleWalletPath,
    element: <GoogleWalletComponent />,
  },
  {
    path: qrCodePath,
    element: <QRCodeComponent />,
  },
];

let notFoundPath: Array<RouteObject> = [
  { path: "*", element: <PageNotFound /> },
];

export function AppRoutes() {
  let element = useRoutes([
    {
      path: "/",
      element: <App />,
      children: [...appPaths, ...notFoundPath],
    },
  ]);
  return element;
}
export const getDeviceType = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform.toLowerCase();
  let deviceType = "Unknown Device";
  if (/iphone|ipad|ipod/.test(userAgent)) {
    deviceType = "apple";
  } else if (/android/.test(userAgent)) {
    deviceType = "android";
  } else if (/win|linux/.test(platform)) {
    deviceType = "desktop";
  } else if (/mac/.test(userAgent)) {
    deviceType = "desktop";
  }
  return deviceType;
}

# HID Origo Unified Web Provisioning – Sample Application

This is a sample web provisioning application that integrates with HID Origo services to demonstrate pass issuance for Apple and Google Wallets.

---

## 📦 Prerequisites

Make sure the following dependencies are installed:

- **Java**: 8  
- **Node.js**: 23.11 or later  
- **npm**: 10.9.2 or later  

---

## 🛠️ Building the Application

Navigate to the project root and run:

```bash
./gradlew build -x test
```

This command performs the following:

- Builds the frontend UI files  
- Moves the UI files into the Java `resources` directory  
- Packages everything into a JAR:  
  `origo-webpush-provisioning-0.0.1.jar`

---

## 🚀 Running the Application

1. Move to the directory containing `origo-webpush-provisioning-0.0.1.jar`.
2. Place your `application.yml` configuration file in the same directory.
3. Edit the `application.yml` with your environment-specific values.
4. Start the application using:

```bash
java -jar origo-webpush-provisioning-0.0.1.jar --spring.config.location=application.yml
```

Once running, the app will be accessible at:  
**[http://localhost:9090](http://localhost:9090)**

---

## 🧪 Testing Web Provisioning Flow

1. Start the sample application.
2. Open your browser and visit:  
   **[http://localhost:9090/wpp/token](http://localhost:9090/wpp/token)**
3. Use the **HID Origo Credential Management API** to create a new `Pass`.
4. Enter the generated `issuanceToken` on the webpage and click **Proceed**.
5. Based on the pass template, you will see one or two platform options:
   - **Google Wallet**:  
     - You’ll be redirected to a Google login.
     - After authentication, a QR code will be displayed.
     - Scan it with an NFC-capable Android device to add the pass.
   - **Apple Wallet**:  
     - A new window will prompt for iCloud sign-in.
     - Follow the on-screen instructions to complete the process.

---

## ❗ Error Handling

The provisioning API may respond with error messages structured as follows:

```jsonc
{
  "responseHeader": {
    "statusCode": "405",
    "statusMessage": "The Application-ID HTTP header was missing or contained an invalid value.",
    "subStatusCode": "METHOD_NOT_SUPPORTED"
  }
}
```

---

## ⚙️ Configuration: `application.yml`

```yaml
server:
  port: 9090

spring:
  application:
    name: Origo WebPush Provisioning

web-push:
  profile: prod
  application-id: ${WPP_APPLICATION_ID:<Your Application ID>}
  auth-url: ${WPP_AUTH_BASE_URL:https://api.origo.hidglobal.com}
  provisioning-url: ${WPP_BASE_URL:https://web.api.origo.hidglobal.com}

  client-details:
    organization-id: ${WPP_ORG_ID:<Your Org Id>}
    client-id: ${WPP_CLIENT_ID:<Your Org's Client ID>}
    client-secret: ${WPP_CLIENT_SECRET:<Your Org's Secret>}

  google:
    client-id: ${WPP_GOOGLE_CLIENT_ID:<Whitelisted Google Client ID>}
    client-secret: ${WPP_GOOGLE_CLIENT_SECRET:<Google Client Secret>}
    redirect-url: ${WPP_GOOGLE_REDIRECT_URI:<Redirect URI as per Google OAuth setup>}
    provisioning-url: ${WPP_GOOGLE_BASE_URL:https://www.googleapis.com/}

    
error-mapping-details:
    INVALID_ISSUANCE_TOKEN: ${ERROR_ISS_TOKEN_INVALID_DES:There was an issue processing your request. If this issue continues, the link may have expired or is no longer valid. Please request a new one or contact support for assistance}
    ISSUANCE_TOKEN_EXPIRED: ${ERROR_ISS_TOKEN_EXPIRED_DES:There was an issue processing your request. If this issue continues, the link may have expired or is no longer valid. Please request a new one or contact support for assistance}
    UN_SUPPORTED_REQUEST: ${ERROR_UNSUPPORTED_REQ_DES:There was an issue processing your request. If this issue continues, the link may have expired or is no longer valid. Please request a new one or contact support for assistance}
    CARD_IN_TOO_MANY_WALLETS: ${ERROR_CARD_IN_TOO_MANY_DES:You already have a card on your device. If you don't see it or face any issues, please contact support for assistance}

```

---

## 📋 Example `application.yml` for Production

```yaml
server:
  port: 9090

spring:
  application:
    name: Origo WebPush Provisioning

web-push:
  profile: prod
  application-id: ${WPP_APPLICATION_ID:{{Application ID provided by HID PS}}}
  auth-url: ${WPP_AUTH_BASE_URL:https://api.origo.hidglobal.com}
  provisioning-url: ${WPP_BASE_URL:https://web.api.origo.hidglobal.com}
  client-details:
    organization-id: ${WPP_ORG_ID:1004146}
    client-id: ${WPP_CLIENT_ID:1004146-OSRV5871524580}
    client-secret: ${WPP_CLIENT_SECRET:Welcome@123}
  google:
    client-id: ${WPP_GOOGLE_CLIENT_ID:xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com}
    client-secret: ${WPP_GOOGLE_CLIENT_SECRET:xxxxxx-xxxxxxxxxxxxxxxx-xxxxxxxxxxx}
    redirect-url: ${WPP_GOOGLE_REDIRECT_URI:http://localhost:9090}
    provisioning-url: ${WPP_GOOGLE_BASE_URL:https://www.googleapis.com/}
  apple:
    partner-id: ${WPP_APPLE_PARTNER_ID:ORG-e1c8ac3a-3a84-43e6-b593-738ecc8ebbd9}
    provisioning-url: ${WPP_APPLE_BASE_URL:https://apple-pay.apple.com}
  error-mapping-details:
    INVALID_ISSUANCE_TOKEN: ${ERROR_ISS_TOKEN_INVALID_DES:There was an issue processing your request. If this issue continues, the link may have expired or is no longer valid. Please request a new one or contact support for assistance}
    ISSUANCE_TOKEN_EXPIRED: ${ERROR_ISS_TOKEN_EXPIRED_DES:There was an issue processing your request. If this issue continues, the link may have expired or is no longer valid. Please request a new one or contact support for assistance}
    UN_SUPPORTED_REQUEST: ${ERROR_UNSUPPORTED_REQ_DES:There was an issue processing your request. If this issue continues, the link may have expired or is no longer valid. Please request a new one or contact support for assistance}
    CARD_IN_TOO_MANY_WALLETS: ${ERROR_CARD_IN_TOO_MANY_DES:You already have a card on your device. If you don't see it or face any issues, please contact support for assistance}
```

import appleWalletBtn from '../../assets/images/apple_wallet_button.png';
import { environment } from '../../common/environment';
import axios from 'axios';

interface IAppleWalletProps {
  issuanceCode: string;
}
declare global {
  interface Window {
    invokeAppleWallet: (env: string, issuanceCode: string, applicationID: string | null, provisioningAPI: string, accessToken: any, axios: any) => void;
  }
}

const AppleWalletComponent = (props: IAppleWalletProps) => {
  const handleAddToAppleWallet = () => {
    try {
      const env = 'preprod';
      const applicationID = sessionStorage.getItem('applicationId');
      const provisioningAPI = environment.PROVISIONING;
      const accessToken = sessionStorage.getItem('accessToken');

      window.invokeAppleWallet(env, props.issuanceCode, applicationID, provisioningAPI, accessToken, axios);

    } catch (error) {
      console.error('Failed on try:', error);
    }
  };

  return (
    <>
      <div onClick={handleAddToAppleWallet} className='cursor-pointer' id="addPasses">
        <img
          alt=""
          src={appleWalletBtn}
          className="hid-origo__email-template-logo"
          width="193"
          height="61"
        />
      </div>    
    </>
  );
};

export default AppleWalletComponent;
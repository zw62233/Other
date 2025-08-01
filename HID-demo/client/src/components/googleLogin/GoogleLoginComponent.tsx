import { useGoogleLogin } from '@react-oauth/google';
import googleWalletBtn from '../../assets/images/google_wallet_button.png';
import { useNavigate } from 'react-router-dom';
import { addToGoogleWalletPath } from '../../AppRoutes';

interface IGoogleLoginComponent {
    issuanceCode: string;
}
declare global {
    interface Window {
        invokeGoogleWallet: (accessToken: any) => void;
    }
}
const GoogleLoginComponent = (props: IGoogleLoginComponent) => {
    const navigate = useNavigate();
    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            const googleAccessToken = tokenResponse.code;
            const googleResponseData: any = await window.invokeGoogleWallet(googleAccessToken);
            if (googleResponseData !== null && googleResponseData.id_token) {
                const IDToken = googleResponseData?.id_token;
                if (IDToken && googleAccessToken) {
                    navigate(addToGoogleWalletPath, {
                        state: { googleAccessToken: googleAccessToken, googleIdToken: IDToken, issuanceCode: props.issuanceCode },
                    })
                }
            }
        },
        flow: 'auth-code', // Ensures the ID token is included in the response
    });

    return (
        <>
            <div onClick={login} style={{ cursor: "pointer" }} id="gWalletBtn"><img
                alt=""
                src={googleWalletBtn}
                className="hid-origo__email-template-logo"
            />
            </div>
        </>
    );
};
export default GoogleLoginComponent;
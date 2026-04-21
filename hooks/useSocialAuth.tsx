import { useSSO } from "@clerk/expo";
import { useState } from "react";
import { Alert } from "react-native";



const useSocialAuth = () => {
    const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null); 
    const {startSSOFlow} = useSSO();
    const handleSocialAuth = async (strategy: "oauth_google" | "oauth_github" | "oauth_apple") => {
        if (loadingStrategy) return; // Prevent multiple simultaneous auth attempts
        setLoadingStrategy(strategy);
        try {
            const {createdSessionId,setActive} = await startSSOFlow({strategy});
            if(!createdSessionId || !setActive) {
                Alert.alert("Sign In Error", "Failed to create session. Please try again.");
                return;
            }
            await setActive({session: createdSessionId});
        } catch (error) {
            Alert.alert("Authentication Error", "An error occurred during social authentication. Please try again.");
            console.error("SSO Error:", error);
        } finally {
            setLoadingStrategy(null);
        }
    }

    return {loadingStrategy, handleSocialAuth};
}

export default useSocialAuth;
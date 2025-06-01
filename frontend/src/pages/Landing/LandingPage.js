import React from "react";
import AuthBanner from "../../components/Auth/AuthBanner";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { userLogin } from "../../api/users";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../../components/LoadingComponent";

const LandingPage = () => {
  const { isAuthenticated, getAccessTokenSilently, logout, isLoading } =
    useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const backendLogin = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          await userLogin(token);
          navigate("/home");
        } catch (error) {
          console.error("Error during login:", error);
          if (
            !error.response ||
            (error.response && error.response.status !== 200)
          ) {
            console.warn("User login failed");
            logout({
              returnTo: `${window.location.origin}?error=login_failed`,
            });
          }
        }
      }
    };

    backendLogin();
  }, [isAuthenticated, getAccessTokenSilently, navigate, logout]);
  return (
    <>
      {!isAuthenticated && (
        <div
          style={{
            height: "95vh",
            width: "100vw",
            backgroundImage: "linear-gradient(to top, #002A5C, #0056BD)",
          }}
        >
          <AuthBanner />
        </div>
      )}
      {isLoading && <LoadingComponent />}
    </>
  );
};

export default LandingPage;

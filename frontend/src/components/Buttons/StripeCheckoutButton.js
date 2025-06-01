import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";

import {
  createStripeCheckoutSession,
  validateStripeAccount,
} from "../../api/payments";
import { getCurrentUserId } from "../../api/users";

const StripeCheckoutButton = ({ listingId, userId }) => {
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);
  const [isSeller, setIsSeller] = useState(false);

  const createCheckoutSession = async (listingId) => {
    // Create Stripe Account
    const createRes = await createStripeCheckoutSession(listingId);

    // Redirect to Stripe Connect
    const redirectUrl = createRes.data.redirect_url;
    window.location.replace(redirectUrl);
  };

  useEffect(() => {
    const validateUserPaymentMethod = async (userId) => {
      try {
        await validateStripeAccount(userId);
        setHasPaymentMethod(true);
      } catch (err) {
        setHasPaymentMethod(false);
      }

      const currentUserId = await getCurrentUserId();
      setIsSeller(currentUserId === userId);
    };
    validateUserPaymentMethod(userId);
  }, [userId]);

  return (
    hasPaymentMethod &&
    !isSeller && (
      <Button
        color="primary"
        variant="outlined"
        sx={{ mx: 1, width: "45%" }}
        onClick={() => createCheckoutSession(listingId)}
      >
        Pay
      </Button>
    )
  );
};

export default StripeCheckoutButton;

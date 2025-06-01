import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";

import { getCurrentUserId } from "../../api/users";
import {
  createStripeAccount,
  connectStripeAccount,
  validateStripeAccount,
} from "../../api/payments";

const StripeAccountButton = () => {
  const [hasPaymentMethod, setHasPaymentMethod] = useState(0);

  const createAndConnectStripeAccount = async () => {
    try {
      // Create Stripe Account
      await createStripeAccount();
    } catch (err) {
      console.warn("Could not create Stripe Account");
      return;
    }

    try {
      // Connect Stripe Account
      const connectRes = await connectStripeAccount();
      // Redirect to Stripe Connect
      const redirectUrl = connectRes.data.redirect_url;
      window.location.replace(redirectUrl);
    } catch (err) {
      console.warn("Could not connect Stripe Account and redirect");
    }
  };

  const manageStripeAccountLink = async () => {
    // Connect Stripe Account
    const connectRes = await connectStripeAccount();
    // Redirect to Stripe Connect
    const redirectUrl = connectRes.data.redirect_url;
    window.location.replace(redirectUrl);
  };

  useEffect(() => {
    const validateUserPaymentMethod = async () => {
      const userId = await getCurrentUserId();
      try {
        await validateStripeAccount(userId);
        setHasPaymentMethod(1);
      } catch (err) {
        setHasPaymentMethod(2);
      }
    };

    validateUserPaymentMethod();
  }, []);

  if (hasPaymentMethod === 1) {
    return (
      <Button
        color="primary"
        variant="outlined"
        onClick={() => manageStripeAccountLink()}
      >
        Update Payment Method
      </Button>
    );
  } else if (hasPaymentMethod === 2) {
    return (
      <Button
        color="primary"
        variant="contained"
        onClick={() => createAndConnectStripeAccount()}
      >
        + Add Payment Method
      </Button>
    );
  } else {
    return (
      <Button color="primary" variant="contained">
        Loading...
      </Button>
    );
  }
};

export default StripeAccountButton;

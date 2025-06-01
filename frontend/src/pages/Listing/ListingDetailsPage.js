import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import QueryString from "query-string";

import ListingDetails from "../../components/Listing/Details/ListingDetails";
import { Alert } from "@mui/material";

const ListingDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentCanceled, setPaymentCanceled] = useState(false);

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const values = QueryString.parse(location.search);

    if (values.success) {
      setPaymentSuccess(true);
    }

    if (values.canceled) {
      setPaymentCanceled(true);
    }
  }, [location.search]);

  return (
    <>
      {paymentSuccess && (
        <Alert
          onClose={() => {
            setPaymentSuccess(false);
          }}
        >
          Payment Successful! - A receipt will be sent to your email shortly.
        </Alert>
      )}

      {paymentCanceled && (
        <Alert
          severity="info"
          onClose={() => {
            setPaymentCanceled(false);
          }}
        >
          Payment Checkout Session Canceled!
        </Alert>
      )}
      <ListingDetails id={id} />
    </>
  );
};

export default ListingDetailsPage;

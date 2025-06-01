import React from "react";
import { Button } from "@mui/material";

const ListingFormSubmit = ({ onClick }) => {
  return (
    <Button
      variant="contained"
      sx={{ marginTop: "1em" }}
      type="submit"
      onClick={onClick}
    >
      Upload Listing
    </Button>
  );
};

export default ListingFormSubmit;

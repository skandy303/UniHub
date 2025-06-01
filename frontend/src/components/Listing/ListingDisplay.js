import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import VerticalListingContainer from "./VerticalListingContainer";

const ListingDisplay = ({ heading, listings }) => {
  /* Listing Model 
        title
        content 
        date
        user 
        condition
        category
        subcategory
    */
  return (
    <Box
      sx={{
        flexGrow: 1,
        color: "primary.main",
        p: 2,
      }}
    >
      <Typography variant="h6">{heading}</Typography>
      <Box
        sx={{
          flexGrow: 1,
          color: "primary.main",
          display: "flex",
          p: 1,
        }}
      >
        {listings.length > 0 && (
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {listings.map((listing) => (
              <Grid item xs={2} sm={4} md={4} key={listing.id}>
                <VerticalListingContainer key={listing.id} listing={listing} />
              </Grid>
            ))}
          </Grid>
        )}
        {listings.length === 0 && (
          <Typography variant="h6">No listings to display</Typography>
        )}
      </Box>
    </Box>
  );
};

export default ListingDisplay;

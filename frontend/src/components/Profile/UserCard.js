import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Grid, Typography } from "@mui/material";
import StripeAccountButton from "../Buttons/StripeAccountButton";
import { useAuth0 } from "@auth0/auth0-react";

const UserCard = ({ rating, listingCount }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth0();

  const handleCreateListing = () => {
    navigate("/listing");
  };

  if (isLoading) {
    return <div>Loading ...</div>;
  } else {
    if (isAuthenticated) {
      //handleBackendRequest();
      return (
        <Box
          sx={{
            // flexGrow: 1,
            color: "primary.main",
            p: 2,
          }}
        >
          <Typography variant="h6">Profile</Typography>
          <Box
            sx={{
              border: "1px solid black",
              paddingTop: 3,
              flexGrow: 1,
              display: "flex",
              flexDirection: "row",
              color: "primary.main",
              p: 3,
            }}
          >
            <Box
              component="img"
              sx={{
                maxWidth: "20vw",
              }}
              alt={user.name}
              src={user.picture}
            />
            <Grid container sx={{ mx: 2 }}>
              <Grid item xs={12} sm={12}>
                <Typography variant="h5" sx={{ textDecoration: "underline" }}>
                  {user.name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Typography variant="h7">
                  {listingCount} Active Listings
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Button
                  variant="contained"
                  sx={{ marginRight: 1 }}
                  onClick={handleCreateListing}
                >
                  + Create Listing
                </Button>
                <StripeAccountButton />
              </Grid>
            </Grid>
          </Box>
        </Box>
      );
    }
  }
};

export default UserCard;

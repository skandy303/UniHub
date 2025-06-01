import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Avatar,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { listingDetails, createConversation } from "../../../api/listings";
import StripeCheckoutButton from "../../Buttons/StripeCheckoutButton";

const ListingDetails = ({ id }) => {
  // Replace these with actual image URLs for your listing
  const navigate = useNavigate();
  const imageUrls = [
    "https://picsum.photos/400/500",
    "https://picsum.photos/200/300",
    "image3.jpg",
    "image4.jpg",
    "image5.jpg",
  ];

  const [mainImage, setMainImage] = useState(imageUrls[0]);
  const [listing, setListing] = useState(null);
  const [owner, setOwner] = useState(false);

  const handleImageClick = (url) => {
    setMainImage(url);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await listingDetails(id);
        setListing(data["Listing"]);
        setOwner(data["Owner"]);

        if (data["Listing"] && data["Listing"]["images"].length > 0) {
          setMainImage(data["Listing"]["images"][0]);
        }
      } catch (error) {
        console.error("Failed to fetch listing:", error);
        if (error.response && error.response.status !== 200) {
          navigate("/page-not-found");
        }
      }
    };

    fetchData();
  }, [id, navigate]);

  const contactSeller = async (listing) => {
    await createConversation(listing);
    window.location.href = "/messages";
  };

  return (
    <>
      {listing && (
        <>
          <Grid
            container
            spacing={2}
            sx={{ display: "flex", flexDirection: "row" }}
            justifyContent="center"
            alignItems="center"
            mb={3}
            py={4}
          >
            <Grid
              item
              xs={12}
              sm={12}
              md={10}
              lg={10}
              display="flex"
              flexDirection={"column"}
              boxShadow={3}
              justifyContent="center"
              alignItems="center"
              width="10%"
            >
              <Typography variant="h4" sx={{ textDecoration: "underline" }}>
                {listing.title}
              </Typography>
              <Box
                sx={{ display: "flex", flexDirection: "row" }}
                mt={1.8}
                ml={2}
              >
                <Box
                  width={400}
                  height={540}
                  border={1}
                  borderColor="black"
                  style={{
                    backgroundImage: `url(https://unihub-c09.me/api/listings/images/${mainImage.id})`,
                    backgroundSize: "cover",
                    marginBottom: "50px",
                    borderRadius: "16px",
                  }}
                  sx={{ boxShadow: 6 }}
                />
              </Box>
              <Grid
                container
                display="flex"
                flexDirection="row"
                justifyContent="space-evenly"
                mt={2}
                ml={4}
              >
                {listing["images"].map(
                  (image, index) =>
                    image !== mainImage && (
                      <Box
                        key={index}
                        width={100}
                        height={100}
                        mb={3}
                        border={1}
                        borderColor="black"
                        style={{
                          backgroundImage: `url(https://unihub-c09.me/api/listings/images/${image.id})`,
                          backgroundSize: "cover",
                          borderRadius: "16px",
                        }}
                        onClick={() => handleImageClick(image)}
                        cursor="pointer"
                      />
                    )
                )}
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={10}
              lg={10}
              boxShadow={3}
              marginTop="40px"
            >
              <Grid container spacing={4} sx={{ p: 4 }}>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  sx={{ display: "flex", minHeight: "400px" }}
                >
                  <Card elevation={4} sx={{ width: "100%" }}>
                    <CardContent>
                      <Typography variant="h4" component="div">
                        Details
                      </Typography>
                      <Divider sx={{ mt: 1, mb: 2 }} />
                      <Typography variant="h6">Description:</Typography>
                      <Typography variant="body1" sx={{ ml: 2 }} paragraph>
                        {listing["content"]}
                      </Typography>
                      <Typography variant="h6" sx={{ mt: 2 }}>
                        Condition:
                      </Typography>
                      <Typography variant="body1" sx={{ ml: 2 }}>
                        {listing["condition"]}
                      </Typography>
                      <Typography variant="h6" sx={{ mt: 2 }}>
                        Price:
                      </Typography>
                      <Typography variant="body1" sx={{ ml: 2 }}>
                        ${listing["price"]}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  sx={{ display: "flex", minHeight: "400px" }}
                >
                  <Card elevation={4} sx={{ width: "100%" }}>
                    <CardContent>
                      <Typography variant="h4" component="div">
                        Seller Information
                      </Typography>
                      <Divider sx={{ mt: 1, mb: 2 }} />
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          sx={{ width: 160, height: 160 }}
                          src="profile-image.jpg" // Replace this with the actual profile image URL
                        />
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="h6">
                            {listing.user.name.split("@")[0]}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-evenly"
                        mt={2}
                      >
                        {!owner && (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => contactSeller(listing.id)}
                            sx={{ width: "45%" }}
                          >
                            Contact Seller
                          </Button>
                        )}
                        <StripeCheckoutButton
                          listingId={listing.id}
                          userId={listing.user.id}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
      {!listing && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            width: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </>
  );
};

export default ListingDetails;

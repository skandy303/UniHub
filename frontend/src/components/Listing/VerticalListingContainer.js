import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Typography,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
} from "@mui/material";

const VerticalListingContainer = ({ listing }) => {
  /* Listing Model 
        title
        content 
        date
        user 
        condition
        category
        subcategory
    */
  const navigate = useNavigate();

  return (
    <Card
      sx={{ minWidth: 200 }}
      onClick={() => navigate(`/listing/${listing.id}`)}
    >
      {" "}
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={`https://unihub-c09.me/api/listings/images/${listing.images[0].id}`}
          alt="listing image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {listing.title}
          </Typography>
          <Typography gutterBottom variant="h5" component="div">
            ${listing.price}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {listing.content.slice(0, 150)}
            {listing.content.length > 150 && <>...</>}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default VerticalListingContainer;

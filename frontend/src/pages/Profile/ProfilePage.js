import React, { useState, useEffect } from "react";
import GradientBanner from "../../components/Banner/GradientBanner";
import UserCard from "../../components/Profile/UserCard";
import ListingDisplay from "../../components/Listing/ListingDisplay";
import { Pagination, Grid } from "@mui/material";

import { getUserListings } from "../../api/listings";

const ProfilePage = () => {
  const [listings, setListings] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchListings = async (page) => {
    const res = await getUserListings(page);
    setListings(res.Listings);
    setTotalPages(res.TotalPages);
    setTotalCount(res.TotalCount);
  };

  useEffect(() => {
    document.title = "My Profile | UniHub";
    fetchListings(currPage);
  }, [currPage]);

  const handlePageChange = (event, value) => {
    setCurrPage(value);
  };

  return (
    <div>
      <GradientBanner title="My Profile" />
      <UserCard listingCount={totalCount} />
      <ListingDisplay heading="My Listings" listings={listings} />
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ paddingTop: 2, paddingBottom: 2 }}
      >
        <Pagination count={totalPages} onChange={handlePageChange} />
      </Grid>
    </div>
  );
};

export default ProfilePage;

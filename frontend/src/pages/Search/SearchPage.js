import React, { useState, useEffect } from "react";
import SearchBar from "../../components/Search/SearchBar";
import ListingDisplay from "../../components/Listing/ListingDisplay";
import { Pagination, Box, Grid } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { getSearchReults } from "../../api/listings";

const SearchPage = () => {
  const { isLoading, error } = useAuth0();

  const [searchTerm, setSearchTerm] = useState("");
  const [listings, setListings] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const searchListings = async (text, page) => {
    const res = await getSearchReults(text, page);
    setListings(res.Listings);
    setTotalPages(res.TotalPages);
  };

  useEffect(() => {
    document.title = "Search | UniHub";
    searchListings(searchTerm, currPage);
  }, [searchTerm, currPage]);

  const handlePageChange = (event, value) => {
    setCurrPage(value);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "100%",
      }}
    >
      <Box>
        {!error && isLoading && <p>Loading...</p>}
        {!error && !isLoading && (
          <>
            <SearchBar searchTermSetter={setSearchTerm} />
            <ListingDisplay heading="Search Results" listings={listings} />
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              sx={{ paddingTop: 2, paddingBottom: 2 }}
            >
              <Pagination count={totalPages} onChange={handlePageChange} />
            </Grid>
          </>
        )}
      </Box>
    </Box>
  );
};

export default SearchPage;

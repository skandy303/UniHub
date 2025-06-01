import React, { useState, useEffect } from "react";
import SearchBar from "../../components/Search/SearchBar";
import ListingDisplay from "../../components/Listing/ListingDisplay";
import ListingSelectField from "../../components/Listing/Form/ListingSelectField";
import { Pagination, Box, Grid } from "@mui/material";
import CategoryDonut from "../../components/Statistics/CategoryPopularity";

import { useAuth0 } from "@auth0/auth0-react";

import { fetchCategories } from "../../api/listings";
import { getSearchReults } from "../../api/listings";

const SearchPage = () => {
  const { isLoading, error } = useAuth0();
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [category, setCategory] = useState("All");
  const [categoryId, setCategoryId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [listings, setListings] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const searchListings = async (text, category, page) => {
    const res = await getSearchReults(text, category, page);
    setListings(res.Listings);
    setTotalPages(res.TotalPages);
  };

  const fetchCategoryOptions = async () => {
    const response = await fetchCategories();
    const options = response.Categories.concat({ id: 0, name: "All" });
    setCategoryOptions(options);
  };

  useEffect(() => {
    fetchCategoryOptions();
  }, []);

  useEffect(() => {
    document.title = "Search | UniHub";
    searchListings(searchTerm, category, currPage);
  }, [searchTerm, category, currPage]);

  const handlePageChange = (event, value) => {
    setCurrPage(value);
  };

  const handleCategoryChartOnClick = (categoryName) => {
    const selectedCategory = categoryOptions.find(
      (option) => option.name === categoryName
    );
    setCategoryId(selectedCategory.id);
    setCategory(selectedCategory.name);
  };

  const handleCategoryChange = (event) => {
    setCategoryId(event.target.value);
    const selectedCategory = categoryOptions.find(
      (option) => option.id === event.target.value
    );

    setCategory(selectedCategory.name);
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
            <Box
              sx={{
                p: 2,
              }}
            >
              <ListingSelectField
                label="Category"
                options={categoryOptions}
                onChange={handleCategoryChange}
                current={categoryId}
              />
              <CategoryDonut setCategory={handleCategoryChartOnClick} />
            </Box>
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

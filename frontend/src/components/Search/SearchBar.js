import React from "react";
import { useState } from "react";

import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ searchTermSetter }) => {
  const [queryText, setQueryText] = useState("");

  const handleChange = (event) => {
    setQueryText(event.target.value);
    searchTermSetter(event.target.value);
  };

  return (
    <Box
      sx={{
        paddingTop: 3,
        flexGrow: 1,
        height: 200,
        backgroundImage: "linear-gradient(to top, #002A5C, #0056BD)",
        color: "secondary.main",
        p: 5,
      }}
    >
      <Typography variant="h4">What are you looking for?</Typography>
      <TextField
        value={queryText}
        onChange={handleChange}
        color="secondary"
        id="standard-search"
        type="search"
        variant="standard"
        sx={{
          width: "90vw",
          borderBottom: "1px solid white",
          input: { color: "white" },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon color="secondary" />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default SearchBar;

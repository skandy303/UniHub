import React from "react";
import { TextField, InputLabel, InputAdornment } from "@mui/material";

const ListingTextField = ({ id, label, onChange }) => {
  const inputProps =
    label === "Price"
      ? {
          type: "number",
          pattern: "[0-9]*",
        }
      : {};

  const startAdornment =
    label === "Price" ? (
      <InputAdornment position="start">$</InputAdornment>
    ) : null;
  const maxLength = () => {
    if (label === "Title") {
      return { maxLength: 59 };
    } else if (label === "Price") {
      return {
        type: "number",
        pattern: "[0-9]*",
      };
    } else {
      return { maxLength: 550 };
    }
  };
  const isMultiline = label === "Description";

  return (
    <>
      <InputLabel
        sx={{
          width: "100%",
          textAlign: "left",
          fontSize: "1.5em",
          color: "primary.main",
        }}
      >
        {label}
      </InputLabel>
      <TextField
        id={id}
        sx={{
          marginBottom: "1em",
          width: "100%",
        }}
        inputProps={maxLength()}
        InputProps={{
          startAdornment,
        }}
        multiline={isMultiline} // Set multiline based on the label
        rows={isMultiline ? 4 : 1}
        onChange={onChange}
        required
      />
    </>
  );
};

export default ListingTextField;

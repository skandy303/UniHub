import React, { useEffect } from "react";
import { InputLabel, Select, MenuItem } from "@mui/material";

const ListingSelectField = ({ label, current, options, onChange }) => {
  const [selectedValue, setSelectedValue] = React.useState("");

  const handleChange = (event) => {
    const value = event.target.value;

    // Check if the value matches one of the available options
    const availableValues = options.map((option) =>
      typeof option === "object" ? option.id : option
    );
    if (availableValues.includes(value)) {
      setSelectedValue(value);
      if (onChange) {
        onChange(event); // Pass the entire event object
      }
    } else {
      // Log a message to help you debug the issue
      console.warn(
        `An out-of-range value (${value}) was provided for the select component with label "${label}".`
      );
      setSelectedValue(""); // Reset the selected value to an empty string
    }
  };
  useEffect(() => {
    setSelectedValue(current);
  }, [options, current]);
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
      <Select
        sx={{
          marginBottom: "1em",
          width: "100%",
        }}
        value={selectedValue}
        onChange={handleChange}
        required
      >
        {options.map((option) => {
          const isObject = typeof option === "object";
          const value = isObject ? option.id : option;
          const displayText = isObject ? option.name : option;
          const parentID = isObject && option.parentID ? option.parentID : "";

          return (
            <MenuItem key={`${parentID}-${value}`} value={value}>
              {displayText}
            </MenuItem>
          );
        })}
      </Select>
    </>
  );
};

export default ListingSelectField;

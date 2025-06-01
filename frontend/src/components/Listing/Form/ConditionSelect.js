import React from "react";
import { InputLabel, Select, MenuItem } from "@mui/material";

const ConditionSelect = ({ label, onChange }) => {
  const [selectedValue, setSelectedValue] = React.useState("");

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);

    if (onChange) {
      onChange(event);
    }
  };

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
        <MenuItem value="Brand New">Brand New</MenuItem>
        <MenuItem value="Used">Used</MenuItem>
        <MenuItem value="Used - Like New">Used - Like New</MenuItem>
      </Select>
    </>
  );
};

export default ConditionSelect;

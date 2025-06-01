import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  IconButton,
  Button,
  ImageList,
  ImageListItem,
  Typography,
} from "@mui/material";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ConditionSelect from "./ConditionSelect";

import ListingTextField from "./ListingTextFields";
import ListingSelectField from "./ListingSelectField";
// import ListingUploadField from "./ListingImages";
import ListingFormSubmit from "./FormSubmit";
import {
  fetchCategories,
  fetchSubcategories,
  submitForm,
  generateDescription,
} from "../../../api/listings";

const ListingForm = () => {
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [images, setImages] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const navigate = useNavigate();

  const fetchCategoryOptions = async () => {
    const response = await fetchCategories();
    setCategoryOptions(response.Categories);
  };

  const generateErrorMessage = () => {
    const emptyFields = [];
    if (!title) emptyFields.push("Title");
    if (!description) emptyFields.push("Description");
    if (!price) emptyFields.push("Price");
    if (!condition) emptyFields.push("Condition");
    if (!category) emptyFields.push("Category");
    if (!subcategory) emptyFields.push("Subcategory");
    if (!images.length) emptyFields.push("Images");
    if (description.length > 550)
      emptyFields.push("Description (too long) (max characters:550)");

    return `Please fill in the following fields: ${emptyFields.join(", ")}`;
  };

  const handleCategoryChange = async (event) => {
    const selectedCategory = categoryOptions.find(
      (option) => option.id === event.target.value
    );

    if (selectedCategory) {
      setCategory(selectedCategory.name);
      const response = await fetchSubcategories(selectedCategory.id);
      const subcategoriesWithParentID = response.Subcategories.map(
        (subcat) => ({
          ...subcat,
          parentID: selectedCategory.id,
        })
      );
      setSubcategoryOptions(subcategoriesWithParentID);
      setSubcategory("");
    } else {
      setSubcategoryOptions([]);
    }
  };

  const handleSubCategoryChange = async (event) => {
    const selectedCategory = subcategoryOptions.find(
      (option) => option.id === event.target.value
    );

    if (selectedCategory) {
      await setSubcategory(selectedCategory.name);
      const suggestion = await handleDescription();
      document.getElementById("description-field").value = suggestion;
      setDescription(suggestion);
    } else {
      setSubcategory("");
    }
  };

  async function handleDescription() {
    if (title === "" || price === "" || condition === "" || category === "") {
      return description;
    }

    const suggestion = await generateDescription({
      description: `Title: ${title}, Price: ${price}, Condition: ${condition}, Category: ${category}`,
    });
    return suggestion.Description;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      title === "" ||
      description === "" ||
      price === "" ||
      condition === "" ||
      category === "" ||
      subcategory === "" ||
      images.length === 0 ||
      description.length > 550
    ) {
      setSnackbarOpen(true);
      return;
    }
    let formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("condition", condition);
    formData.append("category", category);
    formData.append("subcategory", subcategory);

    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }
    await submitForm(formData);

    navigate("/profile");
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  function addImages(e) {
    const newFiles = Array.from(e.target.files);
    const updatedImages = [...images, ...newFiles].slice(0, 8);
    setImages(updatedImages);
  }

  function createImageList() {
    return images.map((file, index) => (
      <ImageListItem key={`${file.name}-${index}`}>
        <img
          src={URL.createObjectURL(file)}
          srcSet={URL.createObjectURL(file)}
          alt={file.name}
          loading="lazy"
        />
        <IconButton
          fontSize="small"
          edge="end"
          color="inherit"
          onClick={() => onRemove(index)}
          sx={{
            position: "absolute",
            top: 5,
            right: 15,
            backgroundColor: "white",
            "&:hover": { backgroundColor: "red" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </ImageListItem>
    ));
  }

  function onRemove(index) {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  }

  function onAddClick(e) {
    e.currentTarget.value = null;
  }

  useEffect(() => {
    fetchCategoryOptions();
  }, []);

  return (
    <Box
      sx={{
        flexGrow: 1,
        color: "primary.main",
        p: 2,
      }}
    >
      <form>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "auto",
            width: "80%",
          }}
        >
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
          >
            <MuiAlert
              elevation={6}
              variant="filled"
              severity="error"
              onClose={handleCloseSnackbar}
            >
              {generateErrorMessage()}
            </MuiAlert>
          </Snackbar>
          <ListingTextField
            label="Title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <ListingTextField
                label="Price"
                onChange={(e) => setPrice(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <ConditionSelect
                label="Condition"
                onChange={(e) => setCondition(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <ListingSelectField
                label="Category"
                options={categoryOptions}
                onChange={handleCategoryChange}
                current=""
              />
            </Grid>
            <Grid item xs={6}>
              <ListingSelectField
                key={category}
                label="Subcategory"
                options={subcategoryOptions}
                onChange={handleSubCategoryChange}
                current=""
              />
            </Grid>
            <Grid item xs={12}>
              <ListingTextField
                id="description-field"
                label="Description"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              />
            </Grid>
          </Grid>
          {/* <ListingUploadField onChange={(e) => setImages(e.target.files)} /> */}
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            Images
          </Typography>
          <ImageList
            variant="quilted"
            sx={{ width: "80%", height: "max-content" }}
            cols={4}
            rowHeight={300}
          >
            {createImageList()}
            {images.length < 8 && (
              <ImageListItem>
                <Button
                  component="label"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <AddIcon sx={{ fontSize: 100 }} />
                  <input
                    type="file"
                    accept="image/jpeg, image/jpg"
                    multiple
                    onChange={addImages}
                    onClick={onAddClick}
                    required
                    hidden
                  />
                </Button>
              </ImageListItem>
            )}
          </ImageList>
          <Typography>Uploaded Images: {images.length}</Typography>
          <ListingFormSubmit onClick={handleSubmit} />
        </Box>
      </form>
    </Box>
  );
};

export default ListingForm;

import { client } from "./constants";

const getUserListings = async (pageNum) => {
  try {
    const response = await client.get(
      `listings/user?count=6&pageNum=${pageNum}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching search results:", error);
    throw error;
  }
};

const getSearchReults = async (searchTerm, category, pageNum) => {
  try {
    const response = await client.get(
      `listings/search?term=${searchTerm}&category=${category}&count=12&pageNum=${pageNum}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching search results:", error);
    throw error;
  }
};

const getListingsByCategory = async (category, pageNum) => {
  try {
    const response = await client.get(
      `listings/browse?category=${category}&count=12&pageNum=${pageNum}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching search results:", error);
    throw error;
  }
};

const generateDescription = async (data) => {
  try {
    const response = await client.get(
      `listings/getSuggestions?description=${data.description}`,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error generating description:", error);
    throw error;
  }
};

const submitForm = async (data) => {
  try {
    const response = await client.post("listings/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting form:", error);
    throw error;
  }
};

const fetchCategories = async () => {
  try {
    const response = await client.get("listings/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

const fetchSubcategories = async (selectedCategory) => {
  try {
    const response = await client.get(
      `listings/categories/${selectedCategory}/subcategories`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    throw error;
  }
};

const listingDetails = async (id) => {
  try {
    const response = await client.get("listings/" + id);
    return response.data;
  } catch (error) {
    console.error("Error fetching listing details:", error);
    throw error;
  }
};

const createConversation = async (listing) => {
  try {
    const response = await client.get(
      `listings/createConversation?Listing=${listing}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching listing details:", error);
    throw error;
  }
};

const CategoryStatistics = async () => {
  try {
    const response = await client.get(`listings/statistics`);
    return response.data;
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    throw error;
  }
};

export {
  getUserListings,
  getSearchReults,
  getListingsByCategory,
  fetchCategories,
  fetchSubcategories,
  submitForm,
  listingDetails,
  generateDescription,
  CategoryStatistics,
  createConversation,
};

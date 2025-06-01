import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/Landing/LandingPage";
import HomePage from "./pages/Home/HomePage";
import ProfilePage from "./pages/Profile/ProfilePage";
import { ListingPage } from "./pages/Listing/CreateListingPage";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import NavBar from "./components/Navigation/NavBar";
import ConversationsApp from "./components/Messaging/ConversationsApp";
import ListingDetailsPage from "./pages/Listing/ListingDetailsPage";
import Box from "@mui/material/Box";
import PageNotFound from "./pages/Home/PageNotFound";
import Unauthorized from "./pages/Home/Unauthorized";
import "./styles/App.css";
import Footer from "./components/Footer/Footer";

const App = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <NavBar />
      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100vh - 128px)",
          width: "100%",
        }}
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/Unauthorized" element={<Unauthorized />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/listing"
            element={
              <ProtectedRoute>
                <ListingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <ConversationsApp listing="-1" customer="-1" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/listing/:id"
            element={
              <ProtectedRoute>
                <ListingDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <PageNotFound />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
};

export default App;

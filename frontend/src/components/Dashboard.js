import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Box,
  Alert,
  Snackbar,
} from "@mui/material";

const API_BASE_URL = "https://syncthreads-a.onrender.com"; // Replace with your production URL if needed

const Dashboard = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logoutError, setLogoutError] = useState(null);
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    console.log("🔄 Checking session...");

    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please login.");

        const response = await axios.get(`${API_BASE_URL}/api/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (isMounted) setCards(response.data.cards);
      } catch (err) {
        console.error(
          "❌ Dashboard Load Error:",
          err.response?.data || err.message
        );
        if (isMounted) {
          setError(
            err.response?.data?.message || "Failed to load dashboard data."
          );
        }

        if (
          err.response?.status === 401 ||
          err.message.includes("No token found")
        ) {
          handleSessionExpired();
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSessionExpired = () => {
    if (!localStorage.getItem("token")) return;

    console.warn("⚠️ Session expired, logging out...");

    localStorage.removeItem("token");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    setError("Session expired. Redirecting...");
    setTimeout(() => {
      if (window.location.pathname !== "/login") navigate("/login");
    }, 2000);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/logout`,
        {},
        { withCredentials: true }
      );

      localStorage.removeItem("token");
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setLogoutSuccess(true);
      navigate("/"); // Direct navigation, no timeout
    } catch (err) {
      console.error("❌ Logout Failed:", err.response?.data || err.message);
      setLogoutError(
        err.response?.data?.message || "Logout failed. Please try again."
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        color: "white",
        padding: 3,
      }}
    >
      <Box
        display="flex"
        justifyContent="flex-end"
        width="100%"
        maxWidth="1200px"
      >
        <Button
          variant="contained"
          sx={{
            background: "linear-gradient(90deg, #ff8a00 0%, #da1b60 100%)",
            color: "white",
            fontWeight: "bold",
            "&:hover": { opacity: 0.9 },
          }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      <Typography
        variant="h4"
        align="center"
        sx={{ mt: 2, mb: 3, fontWeight: "bold" }}
      >
        Welcome to Your Dashboard 🚀
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {logoutError && (
        <Alert severity="error" onClose={() => setLogoutError(null)}>
          {logoutError}
        </Alert>
      )}

      {loading ? (
        <CircularProgress sx={{ color: "#ff8a00", mb: 2 }} />
      ) : cards.length > 0 ? (
        <Container>
          <Grid
            container
            spacing={3}
            sx={{ maxWidth: "1200px", justifyContent: "center" }}
          >
            {cards.map((card) => (
              <Grid item xs={12} sm={6} md={4} key={card.id}>
                <Card
                  sx={{
                    background: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                    borderRadius: "12px",
                    color: "white",
                    cursor: "pointer",
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.3)",
                    },
                  }}
                  onClick={() => navigate("/map")}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {card.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      ) : (
        <Typography>No data available.</Typography>
      )}

      <Snackbar
        open={logoutSuccess}
        autoHideDuration={3000}
        onClose={() => setLogoutSuccess(false)}
        message="Logged out successfully!"
      />
    </Box>
  );
};

export default Dashboard;

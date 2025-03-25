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

const Dashboard = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logoutError, setLogoutError] = useState(null);
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://syncthreads-a.onrender.com/api/dashboard", {
        withCredentials: true,
      })
      .then((res) => {
        setCards(res.data.cards);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Unauthorized:", err.response?.data);
        setLoading(false);
        setError(
          err.response?.data?.message || "Failed to load dashboard data."
        );
        if (err.response?.status === 401) {
          navigate("/");
        }
      });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://syncthreads-a.onrender.com/api/logout",
        {},
        { withCredentials: true }
      );
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setLogoutSuccess(true);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err.response?.data);
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
            padding: "8px 16px",
            fontWeight: "bold",
            "&:hover": {
              opacity: 0.9,
            },
          }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      <Typography
        variant="h4"
        align="center"
        sx={{ marginBottom: 3, fontWeight: "bold" }}
      >
        Welcome to Your Dashboard 🚀
      </Typography>

      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error}
        </Alert>
      )}

      {logoutError && (
        <Alert severity="error" onClose={() => setLogoutError(null)}>
          {logoutError}
        </Alert>
      )}

      {loading ? (
        <CircularProgress sx={{ color: "#ff8a00" }} />
      ) : (
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
                  "&:hover": { transform: "scale(1.05)" },
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
      )}

      <Snackbar
        open={logoutSuccess}
        autoHideDuration={6000}
        onClose={() => setLogoutSuccess(false)}
        message="Logged out successfully!"
      />
    </Box>
  );
};

export default Dashboard;

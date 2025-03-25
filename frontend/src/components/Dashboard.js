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
} from "@mui/material";

const Dashboard = () => {
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/dashboard", { withCredentials: true }) // ✅ Send cookies
      .then((res) => setCards(res.data.cards))
      .catch((error) => {
        console.error("Unauthorized:", error.response?.data);
        navigate("/"); // Redirect to login if unauthorized
      });
  }, [navigate]);

  // Logout Function
  const handleLogout = () => {
    axios
      .post("http://localhost:5000/api/logout", {}, { withCredentials: true })
      .then(() => navigate("/"))
      .catch((error) => console.error("Logout failed:", error.response?.data));
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
      {/* Logout Button */}
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

      {cards.length === 0 ? (
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
    </Box>
  );
};

export default Dashboard;

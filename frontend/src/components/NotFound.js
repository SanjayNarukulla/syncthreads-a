import { Box, Typography, Button, Container, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/"); // Navigate back to the home page
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        color: "white",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            padding: 4,
            borderRadius: "12px",
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(10px)",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ color: "#ffcc00" }}>
            404 - Page Not Found
          </Typography>
          <Typography variant="body1" paragraph>
            Oops! The page you're looking for doesn't exist.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGoHome}
            sx={{ mt: 3 }}
          >
            Go to Home
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default NotFound;

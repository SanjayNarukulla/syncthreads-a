import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Typography, Box, Paper } from "@mui/material";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  //  Redirect if already authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      axios
        .get("https://syncthreads-a.onrender.com/api/dashboard", {
          withCredentials: true,
        })
        .then(() => {
          localStorage.setItem("isAuthenticated", "true");
          navigate("/dashboard");
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [navigate]);

  if (loading) return <p>Loading...</p>;

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent page reload

    try {
      const response = await axios.post(
        "https://syncthreads-a.onrender.com/api/login",
        { username, password },
        { withCredentials: true } // ✅ Allow cookies
      );

      localStorage.setItem("isAuthenticated", "true"); // ✅ Store login state
      navigate("/dashboard");
    } catch (error) {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          padding: 4,
          width: 380,
          borderRadius: 4,
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, color: "#fff", fontWeight: 600 }}>
          Welcome Back 👋
        </Typography>

        <Typography sx={{ color: "#ddd", mb: 3 }}>
          Enter your credentials to continue
        </Typography>

        <form onSubmit={handleLogin} style={{ width: "100%" }}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "#fff",
                "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                "&:hover fieldset": { borderColor: "#fff" },
              },
              "& .MuiInputLabel-root": { color: "#ddd" },
            }}
          />

          <TextField
            label="Password"
            type="password"
            variant="outlined"
            autoComplete="current-password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "#fff",
                "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                "&:hover fieldset": { borderColor: "#fff" },
              },
              "& .MuiInputLabel-root": { color: "#ddd" },
            }}
          />

          <Button
            variant="contained"
            fullWidth
            type="submit"
            sx={{
              mt: 1,
              background: "linear-gradient(90deg, #ff8a00 0%, #da1b60 100%)",
              color: "#fff",
              borderRadius: 3,
              padding: "10px",
              fontSize: "1rem",
              "&:hover": { opacity: 0.9 },
            }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;

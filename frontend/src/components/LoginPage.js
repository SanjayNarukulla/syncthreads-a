import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  IconButton,
  InputAdornment,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const API_BASE_URL = "https://syncthreads-a.onrender.com";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          if (isMounted) setCheckingSession(false);
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/api/session`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (isMounted && res.status === 200) {
          console.log("✅ Session active, redirecting...");
          navigate("/dashboard");
        }
      } catch (error) {
        if (isMounted) {
          console.error("🚨 Session expired, logging out...", error);
          localStorage.removeItem("token");
          localStorage.removeItem("username");
        }
      } finally {
        if (isMounted) setCheckingSession(false);
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/login`,
        { username: username.trim(), password: password.trim() },
        { withCredentials: true }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", username);
      console.log("✅ Login successful, redirecting...");
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Login Error:", error.response?.data || error.message);
      setError(
        error.response?.data?.message || "Invalid credentials, try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
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

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin} style={{ width: "100%" }}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            disabled={loading}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            disabled={loading}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            fullWidth
            type="submit"
            disabled={loading}
            sx={{ mt: 1 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;

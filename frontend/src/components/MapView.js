import { useEffect, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Icon, Style } from "ol/style";
import axios from "axios";
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import "ol/ol.css";

// Default map settings
const defaultCenter = fromLonLat([78.9629, 20.5937]); // India
const defaultZoom = 5;

const MapView = () => {
  const [map, setMap] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState("osm");
  const [markerLayer, setMarkerLayer] = useState(null);
  const [searchLocation, setSearchLocation] = useState("");

  // Base layers
  const layers = {
    osm: new TileLayer({ source: new OSM() }),
    satellite: new TileLayer({
      source: new XYZ({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      }),
    }),
    dark: new TileLayer({
      source: new XYZ({
        url: "https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      }),
    }),
  };

  // Initialize map
  useEffect(() => {
    const newMap = new Map({
      target: "map",
      layers: [layers[selectedLayer]],
      view: new View({
        center: defaultCenter,
        zoom: defaultZoom,
      }),
    });

    setMap(newMap);

    // Create a marker layer
    const vectorLayer = new VectorLayer({
      source: new VectorSource(),
    });

    newMap.addLayer(vectorLayer);
    setMarkerLayer(vectorLayer);

    return () => newMap.setTarget(null);
  }, []);

  // Change base layer
  useEffect(() => {
    if (map) {
      map.getLayers().setAt(0, layers[selectedLayer]);
    }
  }, [selectedLayer, map]);

  // Fetch markers from API
  useEffect(() => {
    axios
      .get("https://syncthreads-a.onrender.com/api/map")
      .then((res) => {
        if (markerLayer) {
          const vectorSource = markerLayer.getSource();
          res.data.markers.forEach((marker) => {
            const feature = new Feature({
              geometry: new Point(fromLonLat(marker.position)),
            });
            feature.setStyle(
              new Style({
                image: new Icon({
                  src: "https://openlayers.org/en/latest/examples/data/icon.png",
                  scale: 0.05,
                }),
              })
            );
            vectorSource.addFeature(feature);
          });
        }
      })
      .catch(() => alert("Error fetching map markers"));
  }, [markerLayer]);

  // Locate user
  const locateUser = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map
          .getView()
          .animate({ center: fromLonLat([longitude, latitude]), zoom: 12 });
      },
      () => alert("Unable to retrieve your location")
    );
  };

  // Click to add marker
  useEffect(() => {
    if (map && markerLayer) {
      map.on("click", (event) => {
        const clickedCoord = event.coordinate;
        const newFeature = new Feature({
          geometry: new Point(clickedCoord),
        });

        newFeature.setStyle(
          new Style({
            image: new Icon({
              src: "https://openlayers.org/en/latest/examples/data/icon.png",
              scale: 0.05,
            }),
          })
        );

        markerLayer.getSource().addFeature(newFeature);
      });
    }
  }, [map, markerLayer]);

  // Search Location Functionality
  const handleSearch = () => {
    axios
      .get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchLocation}`
      )
      .then((res) => {
        if (res.data.length > 0) {
          const { lon, lat } = res.data[0];
          map.getView().animate({
            center: fromLonLat([parseFloat(lon), parseFloat(lat)]),
            zoom: 12,
          });
        } else {
          alert("Location not found!");
        }
      })
      .catch(() => alert("Error fetching location"));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        color: "white",
        padding: 3,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            borderRadius: "12px",
            background: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
            color: "white",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: "bold", marginBottom: 3, color: "#ffcc00" }}
          >
            🌍 OpenLayers Map
          </Typography>

          {/* Map Controls */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 2,
            }}
          >
            <Button variant="contained" color="success" onClick={locateUser}>
              📍 Locate Me
            </Button>

            <Select
              value={selectedLayer}
              onChange={(e) => setSelectedLayer(e.target.value)}
              sx={{
                background: "white",
                borderRadius: "5px",
                minWidth: "150px",
              }}
            >
              <MenuItem value="osm">🛣️ Streets</MenuItem>
              <MenuItem value="satellite">🛰️ Satellite</MenuItem>
              <MenuItem value="dark">🌙Dark Mode</MenuItem>
            </Select>
          </Box>

          {/* Search Bar */}
          <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search Location"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              sx={{ background: "white", borderRadius: "5px" }}
            />
            <Button variant="contained" color="primary" onClick={handleSearch}>
              🔍 Search
            </Button>
          </Box>

          {/* Map Container */}
          <Box
            id="map"
            sx={{ height: "450px", width: "100%", borderRadius: "10px" }}
          ></Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default MapView;

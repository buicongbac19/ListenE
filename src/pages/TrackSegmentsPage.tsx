"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Breadcrumbs,
  Link,
  Skeleton,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  Paper,
} from "@mui/material";
import { ArrowBack, Home, PlayArrow, CheckCircle } from "@mui/icons-material";
import { motion } from "framer-motion";
import { ITrackItem } from "../types/track";
import { ISegmentItem } from "../types/segment";

const mockTracks: ITrackItem[] = [
  {
    id: 1,
    name: "Introducing Yourself",
    sessionId: 1,
    duration: "0:45",
    difficulty: "Easy",
    completed: true,
  },
  {
    id: 2,
    name: "Greeting Someone New",
    sessionId: 1,
    duration: "1:12",
    difficulty: "Easy",
    completed: true,
  },
  // Add other tracks as needed
];

const mockSegments: ISegmentItem[] = [
  {
    id: 1,
    trackId: 1,
    name: "Segment 1: Basic Introduction",
    duration: "0:15",
    audioUrl:
      "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3",
    transcript: "Hi, my name is Sarah.",
    completed: true,
  },
  {
    id: 2,
    trackId: 1,
    name: "Segment 2: Where You're From",
    duration: "0:12",
    audioUrl:
      "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3",
    transcript: "I'm from Canada.",
    completed: false,
  },
  {
    id: 3,
    trackId: 1,
    name: "Segment 3: Greeting",
    duration: "0:18",
    audioUrl:
      "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3",
    transcript: "It's nice to meet you. What's your name?",
    completed: false,
  },
  {
    id: 4,
    trackId: 2,
    name: "Segment 1: Initial Greeting",
    duration: "0:20",
    audioUrl:
      "https://assets.mixkit.co/music/preview/mixkit-hip-hop-02-614.mp3",
    transcript: "Hello there! I don't think we've met before.",
    completed: false,
  },
  {
    id: 5,
    trackId: 2,
    name: "Segment 2: Self Introduction",
    duration: "0:15",
    audioUrl:
      "https://assets.mixkit.co/music/preview/mixkit-hip-hop-02-614.mp3",
    transcript: "I'm John.",
    completed: false,
  },
  {
    id: 6,
    trackId: 2,
    name: "Segment 3: Asking Name",
    duration: "0:10",
    audioUrl:
      "https://assets.mixkit.co/music/preview/mixkit-hip-hop-02-614.mp3",
    transcript: "What's your name?",
    completed: false,
  },
];

const TrackSegmentsPage = () => {
  const { trackId } = useParams();
  const navigate = useNavigate();
  const [track, setTrack] = useState<ITrackItem | null>(null);
  const [segments, setSegments] = useState<ISegmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchTrackAndSegments = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const foundTrack =
        mockTracks.find((t) => t.id === Number(trackId)) || null;
      const trackSegments = mockSegments.filter(
        (s) => s.trackId === Number(trackId)
      );

      setTrack(foundTrack);
      setSegments(trackSegments);
      setLoading(false);
    };

    fetchTrackAndSegments();
  }, [trackId]);

  const handleSegmentClick = (segmentId: number) => {
    navigate(`/track/${trackId}/segment/${segmentId}`);
  };

  const handlePracticeAll = () => {
    navigate(`/track/${trackId}`);
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ pb: 6, pt: 10 }}>
        <Skeleton variant="text" height={30} width={200} />
        <Skeleton variant="text" height={40} sx={{ mt: 2 }} />
        <Skeleton variant="text" height={24} width={120} sx={{ mt: 1 }} />

        <Box sx={{ mt: 4 }}>
          <Skeleton variant="text" height={40} width={150} />
          <List sx={{ mt: 1 }}>
            {Array.from(new Array(3)).map((_, index) => (
              <ListItem key={index} disablePadding>
                <Skeleton variant="rectangular" height={72} width="100%" />
              </ListItem>
            ))}
          </List>
        </Box>
      </Container>
    );
  }

  if (!track) {
    return (
      <Container maxWidth="md" sx={{ pb: 6, pt: 10 }}>
        <Typography variant="h4">Track not found</Typography>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ pb: 6, pt: 10 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link
            underline="hover"
            color="inherit"
            sx={{ display: "flex", alignItems: "center" }}
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            <Home sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate(`/session/${track.sessionId}`)}
            style={{ cursor: "pointer" }}
          >
            Back to Session
          </Link>
          <Typography color="text.primary">{track.name} Segments</Typography>
        </Breadcrumbs>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(`/session/${track.sessionId}`)}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              {track.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <Chip
                label={track.difficulty}
                size="small"
                color={
                  track.difficulty === "Easy"
                    ? "success"
                    : track.difficulty === "Medium"
                    ? "primary"
                    : "error"
                }
                sx={{ fontWeight: 500, mr: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                Duration: {track.duration}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            bgcolor: "primary.light",
            color: "white",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h6" gutterBottom>
              Practice All Segments Together
            </Typography>
            <Typography variant="body2">
              Practice the entire track in one session
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<PlayArrow />}
            onClick={handlePracticeAll}
            sx={{
              px: 3,
              py: 1,
              bgcolor: "white",
              color: "primary.main",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.9)",
              },
            }}
          >
            Làm Tất Cả
          </Button>
        </Paper>

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 600, mt: 6 }}
        >
          Segments ({segments.length})
        </Typography>
        <Divider sx={{ mb: 4 }} />

        <motion.div variants={container} initial="hidden" animate="show">
          <List sx={{ bgcolor: "background.paper", borderRadius: 2 }}>
            {segments.map((segment, index) => (
              <motion.div key={segment.id} variants={item}>
                <ListItem
                  disablePadding
                  sx={{
                    mb: 2,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    overflow: "hidden",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <ListItemButton
                    onClick={() => handleSegmentClick(segment.id)}
                  >
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          bgcolor: segment.completed
                            ? "success.main"
                            : "primary.main",
                          color: "white",
                        }}
                      >
                        {segment.completed ? <CheckCircle /> : index + 1}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {segment.name}
                          </Typography>
                          {segment.completed && (
                            <Chip
                              size="small"
                              label="Completed"
                              color="success"
                              variant="outlined"
                              sx={{ ml: 2 }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Duration: {segment.duration}
                        </Typography>
                      }
                    />
                    <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<PlayArrow />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSegmentClick(segment.id);
                        }}
                      >
                        Practice
                      </Button>
                    </Box>
                  </ListItemButton>
                </ListItem>
              </motion.div>
            ))}
          </List>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default TrackSegmentsPage;

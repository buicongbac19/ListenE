"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Breadcrumbs,
  Link,
  Skeleton,
  Divider,
  LinearProgress,
  Chip,
  Avatar,
} from "@mui/material";
import {
  ArrowBack,
  Home,
  PlayArrow,
  CheckCircle,
  Headphones,
  VolumeUp,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { ISessionItem } from "../types/session";
import { ITrackItem } from "../types/track";

const mockSessions: ISessionItem[] = [
  {
    id: 1,
    name: "Greetings and Introductions",
    topicId: 1,
    topicName: "Daily Conversations",
  },
  { id: 2, name: "Small Talk", topicId: 1, topicName: "Daily Conversations" },
];

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
  {
    id: 3,
    name: "Asking About Someone's Day",
    sessionId: 1,
    duration: "0:58",
    difficulty: "Easy",
    completed: false,
  },
  {
    id: 4,
    name: "Formal Introductions",
    sessionId: 1,
    duration: "1:24",
    difficulty: "Medium",
    completed: false,
  },
  {
    id: 5,
    name: "Introducing a Friend",
    sessionId: 1,
    duration: "1:05",
    difficulty: "Medium",
    completed: false,
  },
  {
    id: 6,
    name: "Remembering Names",
    sessionId: 1,
    duration: "1:18",
    difficulty: "Medium",
    completed: false,
  },
  {
    id: 7,
    name: "Business Introductions",
    sessionId: 1,
    duration: "1:32",
    difficulty: "Hard",
    completed: false,
  },
  {
    id: 8,
    name: "Cultural Greetings",
    sessionId: 1,
    duration: "1:45",
    difficulty: "Hard",
    completed: false,
  },

  {
    id: 9,
    name: "Weather Talk",
    sessionId: 2,
    duration: "0:52",
    difficulty: "Easy",
  },
  {
    id: 10,
    name: "Weekend Plans",
    sessionId: 2,
    duration: "1:08",
    difficulty: "Medium",
  },
];

const SessionDetailsPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<ISessionItem | null>(null);
  const [tracks, setTracks] = useState<ITrackItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchSessionDetails = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const foundSession =
        mockSessions.find((s) => s.id === Number(sessionId)) || null;
      const sessionTracks = mockTracks.filter(
        (t) => t.sessionId === Number(sessionId)
      );

      setSession(foundSession);
      setTracks(sessionTracks);
      setLoading(false);
    };

    fetchSessionDetails();
  }, [sessionId]);

  const handleTrackClick = (trackId: number) => {
    navigate(`/track/${trackId}`);
  };

  const calculateProgress = () => {
    if (tracks.length === 0) return 0;

    const completedTracks = tracks.filter((track) => track.completed).length;
    return Math.round((completedTracks / tracks.length) * 100);
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
      <Container maxWidth="lg" sx={{ pb: 6, pt: 10 }}>
        <Skeleton variant="text" height={30} width={200} />
        <Skeleton variant="text" height={40} sx={{ mt: 2 }} />
        <Skeleton variant="text" height={24} width={120} sx={{ mt: 1 }} />

        <Box sx={{ mt: 4 }}>
          <Skeleton variant="text" height={40} width={150} />
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {Array.from(new Array(4)).map((_, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Skeleton variant="rectangular" height={100} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    );
  }

  if (!session) {
    return (
      <Container maxWidth="lg" sx={{ pb: 6, pt: 10 }}>
        <Typography variant="h4">Session not found</Typography>
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
    <Container maxWidth="lg" sx={{ pb: 6, pt: 10 }}>
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
            onClick={() => navigate(`/topic/${session.topicId}`)}
            style={{ cursor: "pointer" }}
          >
            {session.topicName}
          </Link>
          <Typography color="text.primary">{session.name}</Typography>
        </Breadcrumbs>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(`/topic/${session.topicId}`)}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            {session.name}
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" color="text.secondary" paragraph>
            Practice your listening and speaking skills with these audio tracks.
            Listen carefully and try to repeat what you hear.
          </Typography>

          <Box sx={{ mt: 3, mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Session Progress
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {calculateProgress()}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={calculateProgress()}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: "rgba(0,0,0,0.05)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        </Box>

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 600, mt: 6 }}
        >
          Tracks ({tracks.length})
        </Typography>
        <Divider sx={{ mb: 4 }} />

        <motion.div variants={container} initial="hidden" animate="show">
          <Grid container spacing={3}>
            {tracks.map((track) => (
              <Grid item xs={12} sm={6} key={track.id}>
                <motion.div variants={item}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                      },
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    onClick={() => handleTrackClick(track.id)}
                  >
                    <CardContent
                      sx={{ flex: 1, display: "flex", flexDirection: "column" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 2,
                        }}
                      >
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
                          sx={{ fontWeight: 500 }}
                        />
                        {track.completed && (
                          <Chip
                            icon={<CheckCircle fontSize="small" />}
                            label="Completed"
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        )}
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            width: 48,
                            height: 48,
                            mr: 2,
                          }}
                        >
                          <Headphones />
                        </Avatar>
                        <Box>
                          <Typography
                            variant="h6"
                            component="h3"
                            sx={{ fontWeight: 600 }}
                          >
                            {track.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Duration: {track.duration}
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          mt: "auto",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          startIcon={<VolumeUp />}
                          size="small"
                          variant="text"
                        >
                          Preview
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          endIcon={<PlayArrow />}
                        >
                          Practice
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default SessionDetailsPage;

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
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  Home,
  PlayArrow,
  CheckCircle,
} from "@mui/icons-material";
import { motion } from "framer-motion";

// Mock data
interface Topic {
  id: number;
  name: string;
  description: string;
  thumbnail: string;
  level: "Beginner" | "Intermediate" | "Advanced";
}

interface Session {
  id: number;
  name: string;
  orderInTopic: number;
  trackCount: number;
  topicId: number;
  completed?: boolean;
  progress?: number;
}

const mockTopics: Topic[] = [
  {
    id: 1,
    name: "Daily Conversations",
    description:
      "Master everyday English conversations with our comprehensive lessons. From greeting people to ordering food, making small talk, and discussing common topics, this course covers all the essential phrases and vocabulary you need for daily interactions. Perfect for beginners who want to gain confidence in speaking English in everyday situations.",
    thumbnail: "https://source.unsplash.com/random/300x200/?conversation",
    level: "Beginner",
  },
  {
    id: 2,
    name: "Business English",
    description:
      "Enhance your professional communication skills with our Business English course. Learn vocabulary and expressions for meetings, negotiations, presentations, and workplace interactions. This course is designed for intermediate learners who want to advance their career by improving their business English proficiency.",
    thumbnail: "https://source.unsplash.com/random/300x200/?business",
    level: "Intermediate",
  },
];

const mockSessions: Session[] = [
  {
    id: 1,
    name: "Greetings and Introductions",
    orderInTopic: 1,
    trackCount: 8,
    topicId: 1,
    completed: true,
    progress: 100,
  },
  {
    id: 2,
    name: "Small Talk",
    orderInTopic: 2,
    trackCount: 6,
    topicId: 1,
    completed: false,
    progress: 67,
  },
  {
    id: 3,
    name: "Asking for Directions",
    orderInTopic: 3,
    trackCount: 7,
    topicId: 1,
    completed: false,
    progress: 43,
  },
  {
    id: 4,
    name: "Ordering Food and Drinks",
    orderInTopic: 4,
    trackCount: 5,
    topicId: 1,
    completed: false,
    progress: 20,
  },
  {
    id: 5,
    name: "Shopping Conversations",
    orderInTopic: 5,
    trackCount: 6,
    topicId: 1,
    completed: false,
    progress: 0,
  },
  {
    id: 6,
    name: "Making Plans",
    orderInTopic: 6,
    trackCount: 7,
    topicId: 1,
    completed: false,
    progress: 0,
  },
  {
    id: 7,
    name: "Talking About Hobbies",
    orderInTopic: 7,
    trackCount: 5,
    topicId: 1,
    completed: false,
    progress: 0,
  },
  {
    id: 8,
    name: "Weather and Seasons",
    orderInTopic: 8,
    trackCount: 6,
    topicId: 1,
    completed: false,
    progress: 0,
  },

  {
    id: 9,
    name: "Meeting Etiquette",
    orderInTopic: 1,
    trackCount: 7,
    topicId: 2,
    completed: false,
    progress: 0,
  },
  {
    id: 10,
    name: "Presentations",
    orderInTopic: 2,
    trackCount: 8,
    topicId: 2,
    completed: false,
    progress: 0,
  },
];

export default function TopicDetailsPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchTopicDetails = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const foundTopic =
        mockTopics.find((t) => t.id === Number(topicId)) || null;
      const topicSessions = mockSessions.filter(
        (s) => s.topicId === Number(topicId)
      );

      setTopic(foundTopic);
      setSessions(topicSessions);
      setLoading(false);
    };

    fetchTopicDetails();
  }, [topicId]);

  const handleSessionClick = (sessionId: number) => {
    navigate(`/session/${sessionId}`);
  };

  const calculateOverallProgress = () => {
    if (sessions.length === 0) return 0;

    const totalProgress = sessions.reduce(
      (sum, session) => sum + (session.progress || 0),
      0
    );
    return Math.round(totalProgress / sessions.length);
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
        <Skeleton variant="rectangular" height={200} sx={{ my: 3 }} />
        <Skeleton variant="text" height={40} />
        <Skeleton variant="text" height={100} />

        <Box sx={{ mt: 4 }}>
          <Skeleton variant="text" height={40} width={150} />
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {Array.from(new Array(4)).map((_, index) => (
              <Grid item xs={12} key={index}>
                <Skeleton variant="rectangular" height={100} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    );
  }

  if (!topic) {
    return (
      <Container maxWidth="lg" sx={{ pb: 6, pt: 10 }}>
        <Typography variant="h4">Topic not found</Typography>
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
          <Typography color="text.primary">{topic.name}</Typography>
        </Breadcrumbs>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("/")}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            {topic.name}
          </Typography>
          <Chip
            label={topic.level}
            size="small"
            color={
              topic.level === "Beginner"
                ? "success"
                : topic.level === "Intermediate"
                ? "primary"
                : "secondary"
            }
            sx={{ ml: 2, fontWeight: 500 }}
          />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" color="text.secondary" paragraph>
            {topic.description}
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
                Overall Progress
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {calculateOverallProgress()}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={calculateOverallProgress()}
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
          Sessions ({sessions.length})
        </Typography>
        <Divider sx={{ mb: 4 }} />

        <motion.div variants={container} initial="hidden" animate="show">
          <Grid container spacing={3}>
            {sessions.map((session) => (
              <Grid item xs={12} key={session.id}>
                <motion.div variants={item}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                      },
                    }}
                    onClick={() => handleSessionClick(session.id)}
                  >
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={8}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                bgcolor: session.completed
                                  ? "success.main"
                                  : "primary.main",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mr: 2,
                                fontWeight: "bold",
                              }}
                            >
                              {session.completed ? (
                                <CheckCircle />
                              ) : (
                                session.orderInTopic
                              )}
                            </Box>
                            <Box>
                              <Typography
                                variant="h6"
                                component="h3"
                                sx={{ fontWeight: 600 }}
                              >
                                {session.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {session.trackCount} tracks
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Box sx={{ width: "70%" }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  mb: 0.5,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Progress
                                </Typography>
                                <Typography variant="body2" fontWeight={500}>
                                  {session.progress}%
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={session.progress || 0}
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor: "rgba(0,0,0,0.05)",
                                  "& .MuiLinearProgress-bar": {
                                    borderRadius: 3,
                                  },
                                }}
                              />
                            </Box>
                            <Button
                              variant={
                                session.progress && session.progress > 0
                                  ? "outlined"
                                  : "contained"
                              }
                              size="small"
                              endIcon={
                                session.progress && session.progress > 0 ? (
                                  <ArrowForward />
                                ) : (
                                  <PlayArrow />
                                )
                              }
                              sx={{ ml: 2 }}
                            >
                              {session.progress && session.progress > 0
                                ? "Continue"
                                : "Start"}
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
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
}

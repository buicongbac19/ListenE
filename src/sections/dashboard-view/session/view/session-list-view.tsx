"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Divider,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
  Paper,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Breadcrumbs,
  Link,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Add,
  Search,
  MoreVert,
  Edit,
  Delete,
  Dashboard,
  Home,
  Refresh,
  Sort,
  FilterList,
  MusicNote,
  Headphones,
  AccessTime,
  School,
} from "@mui/icons-material";
import { motion } from "framer-motion";
// Define interfaces
interface ISession {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  trackCount: number;
  difficulty: "Easy" | "Medium" | "Hard";
  createdAt: string;
  updatedAt: string;
  topicId: number;
  topicName: string;
}

export default function SessionListView() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [sessions, setSessions] = useState<ISession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(
    null
  );

  // Mock data for demonstration
  const mockSessions: ISession[] = [
    {
      id: 1,
      name: "Basic Conversations",
      description: "Learn everyday English conversations for beginners",
      imageUrl: "https://source.unsplash.com/random/300x200/?conversation",
      trackCount: 5,
      difficulty: "Easy",
      createdAt: "2023-05-15T10:30:00Z",
      updatedAt: "2023-06-20T14:45:00Z",
      topicId: 1,
      topicName: "Everyday English",
    },
    {
      id: 2,
      name: "Business English",
      description: "Professional English for workplace communication",
      imageUrl: "https://source.unsplash.com/random/300x200/?business",
      trackCount: 8,
      difficulty: "Medium",
      createdAt: "2023-04-10T09:15:00Z",
      updatedAt: "2023-06-18T11:20:00Z",
      topicId: 2,
      topicName: "Professional English",
    },
    {
      id: 3,
      name: "Travel English",
      description: "Essential phrases for traveling abroad",
      imageUrl: "https://source.unsplash.com/random/300x200/?travel",
      trackCount: 6,
      difficulty: "Easy",
      createdAt: "2023-03-22T08:45:00Z",
      updatedAt: "2023-06-15T16:30:00Z",
      topicId: 3,
      topicName: "Travel & Tourism",
    },
    {
      id: 4,
      name: "Advanced Grammar",
      description: "Complex grammar structures for advanced learners",
      imageUrl: "https://source.unsplash.com/random/300x200/?books",
      trackCount: 10,
      difficulty: "Hard",
      createdAt: "2023-02-18T14:20:00Z",
      updatedAt: "2023-06-10T09:50:00Z",
      topicId: 4,
      topicName: "Grammar Mastery",
    },
    {
      id: 5,
      name: "Pronunciation Practice",
      description: "Improve your English pronunciation and accent",
      imageUrl: "https://source.unsplash.com/random/300x200/?speaking",
      trackCount: 7,
      difficulty: "Medium",
      createdAt: "2023-01-30T11:10:00Z",
      updatedAt: "2023-06-05T13:25:00Z",
      topicId: 5,
      topicName: "Pronunciation & Speaking",
    },
    {
      id: 6,
      name: "Idioms and Expressions",
      description: "Common English idioms and everyday expressions",
      imageUrl: "https://source.unsplash.com/random/300x200/?language",
      trackCount: 9,
      difficulty: "Medium",
      createdAt: "2022-12-15T16:40:00Z",
      updatedAt: "2023-05-28T10:15:00Z",
      topicId: 6,
      topicName: "Idiomatic English",
    },
  ];

  // Fetch sessions data
  const fetchSessions = async () => {
    setLoading(true);
    try {
      // In a real app, you would fetch from your API
      // const response = await axios.get('/api/admin/sessions');
      // setSessions(response.data);

      // Using mock data for demonstration
      setTimeout(() => {
        setSessions(mockSessions);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleCreateTrack = (sessionId: number) => {
    // Navigate to the track creation component
    navigate(`/dashboard/sessions/${sessionId}/create-track`);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    sessionId: number
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedSessionId(sessionId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSessionId(null);
  };

  const handleEditSession = () => {
    if (selectedSessionId) {
      navigate(`/admin/sessions/${selectedSessionId}/edit`);
    }
    handleMenuClose();
  };

  const handleDeleteSession = () => {
    // In a real app, you would call your API to delete the session
    if (selectedSessionId) {
      setSessions(
        sessions.filter((session) => session.id !== selectedSessionId)
      );
    }
    handleMenuClose();
  };

  const handleRefresh = () => {
    fetchSessions();
  };

  const filteredSessions = sessions.filter(
    (session) =>
      session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.topicName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "success";
      case "Medium":
        return "primary";
      case "Hard":
        return "error";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Breadcrumbs sx={{ mb: 1 }}>
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
                sx={{ display: "flex", alignItems: "center" }}
                onClick={() => navigate("/admin")}
                style={{ cursor: "pointer" }}
              >
                <Dashboard sx={{ mr: 0.5 }} fontSize="inherit" />
                Admin
              </Link>
              <Typography
                color="text.primary"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <School sx={{ mr: 0.5 }} fontSize="inherit" />
                Sessions
              </Typography>
            </Breadcrumbs>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              gutterBottom
            >
              List Session
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your learning sessions and create new tracks
            </Typography>
          </Box>

          <Box sx={{ mt: { xs: 2, md: 0 } }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate("/admin/sessions/create")}
              sx={{
                mr: 1,
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-3px)",
                },
              }}
            >
              New Session
            </Button>
            <IconButton onClick={handleRefresh} color="primary">
              <Refresh />
            </IconButton>
          </Box>
        </Box>

        <Paper
          elevation={2}
          sx={{
            p: 2,
            mb: 4,
            borderRadius: 2,
            background: "linear-gradient(to right, #f5f7fa, #e4e7eb)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              alignItems: "center",
            }}
          >
            <TextField
              placeholder="Search sessions..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flexGrow: 1, minWidth: { xs: "100%", sm: "auto" } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />

            <Box
              sx={{ display: "flex", gap: 1, ml: "auto", mt: { xs: 1, sm: 0 } }}
            >
              <Button
                startIcon={<Sort />}
                variant="outlined"
                size="small"
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                Sort
              </Button>
              <IconButton
                size="small"
                sx={{ display: { xs: "flex", md: "none" } }}
              >
                <Sort />
              </IconButton>

              <Button
                startIcon={<FilterList />}
                variant="outlined"
                size="small"
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                Filter
              </Button>
              <IconButton
                size="small"
                sx={{ display: { xs: "flex", md: "none" } }}
              >
                <FilterList />
              </IconButton>
            </Box>
          </Box>
        </Paper>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : filteredSessions.length === 0 ? (
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 2,
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No sessions found
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Try adjusting your search or create a new session.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate("/admin/sessions/create")}
            >
              Create New Session
            </Button>
          </Paper>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={3}>
              {filteredSessions.map((session) => (
                <Grid item xs={12} sm={6} md={4} key={session.id}>
                  <motion.div variants={itemVariants}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 2,
                        transition: "transform 0.3s, box-shadow 0.3s",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: "0 12px 20px -10px rgba(0,0,0,0.2)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          paddingTop: "56.25%", // 16:9 aspect ratio
                          overflow: "hidden",
                          borderTopLeftRadius: 8,
                          borderTopRightRadius: 8,
                        }}
                      >
                        <Box
                          component="img"
                          src={session.imageUrl}
                          alt={session.name}
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.5s",
                            "&:hover": {
                              transform: "scale(1.05)",
                            },
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background:
                              "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)",
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: "100%",
                            p: 2,
                            color: "white",
                          }}
                        >
                          <Typography variant="h6" fontWeight="bold" noWrap>
                            {session.name}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mt: 0.5,
                            }}
                          >
                            <Chip
                              label={session.difficulty}
                              size="small"
                              color={
                                getDifficultyColor(session.difficulty) as any
                              }
                              sx={{ mr: 1, fontWeight: 500 }}
                            />
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                fontSize: "0.75rem",
                              }}
                            >
                              <MusicNote sx={{ fontSize: 16, mr: 0.5 }} />
                              {session.trackCount} tracks
                            </Box>
                          </Box>
                        </Box>
                      </Box>

                      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <School
                            fontSize="small"
                            color="primary"
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {session.topicName}
                          </Typography>
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            height: "40px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {session.description}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "text.secondary",
                            fontSize: "0.75rem",
                          }}
                        >
                          <AccessTime
                            fontSize="small"
                            sx={{ mr: 0.5, fontSize: 16 }}
                          />
                          <Typography variant="caption">
                            Updated: {formatDate(session.updatedAt)}
                          </Typography>
                        </Box>
                      </CardContent>

                      <Divider />

                      <CardActions
                        sx={{ justifyContent: "space-between", p: 2 }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<Headphones />}
                          onClick={() => handleCreateTrack(session.id)}
                          size={isMobile ? "small" : "medium"}
                          sx={{
                            borderRadius: 6,
                            transition: "all 0.2s",
                            "&:hover": {
                              transform: "scale(1.05)",
                            },
                          }}
                        >
                          Create Track
                        </Button>

                        <IconButton
                          onClick={(e) => handleMenuOpen(e, session.id)}
                          size="small"
                          sx={{ ml: 1 }}
                        >
                          <MoreVert />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}
      </motion.div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleEditSession}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Session</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteSession}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText
            primary="Delete Session"
            primaryTypographyProps={{ color: "error" }}
          />
        </MenuItem>
      </Menu>
    </Container>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Breadcrumbs,
  Link,
  useTheme,
  CircularProgress,
  alpha,
  Grid,
  Divider,
  Avatar,
  Chip,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Edit,
  Home,
  Dashboard,
  Person,
  Email,
  CalendarToday,
  AccessTime,
  School,
  VerifiedUser,
  Block,
  ArrowBack,
  Lock,
  Headphones,
  BarChart,
} from "@mui/icons-material";
import { motion } from "framer-motion";

// Define interfaces
interface IUserDetail {
  id: number;
  email: string;
  imageUrl: string;
  firstName: string;
  lastName: string;
  lastLogin: string;
  isActivated: boolean;
  isEmailConfirmed: boolean;
  updatedAt: string;
  createdAt: string;
  roles: string[];
  lessonsCompleted: number;
  totalListeningTime: number; // in minutes
  averageScore: number;
  recentActivity: {
    date: string;
    action: string;
    details: string;
  }[];
}

export default function UserDetailView() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { userId } = useParams<{ userId: string }>();

  const [user, setUser] = useState<IUserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock notification provider (replace with your actual notification provider)
  const showError = (message: string) => console.error(message);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Mock API call
        setTimeout(() => {
          // Mock user data
          setUser({
            id: Number(userId),
            email: "john.doe@example.com",
            imageUrl: "",
            firstName: "John",
            lastName: "Doe",
            lastLogin: "2023-05-13T09:45:00Z",
            isActivated: true,
            isEmailConfirmed: true,
            updatedAt: "2023-04-15T10:20:00Z",
            createdAt: "2023-01-15T10:20:00Z",
            roles: ["student"],
            lessonsCompleted: 42,
            totalListeningTime: 1260, // 21 hours
            averageScore: 85,
            recentActivity: [
              {
                date: "2023-05-13T09:45:00Z",
                action: "Completed Lesson",
                details: "Advanced Listening - Business Meeting",
              },
              {
                date: "2023-05-12T14:30:00Z",
                action: "Started Lesson",
                details: "Intermediate Listening - Daily Conversations",
              },
              {
                date: "2023-05-10T16:15:00Z",
                action: "Completed Quiz",
                details: "Beginner Grammar - Present Tense",
              },
              {
                date: "2023-05-08T11:20:00Z",
                action: "Updated Profile",
                details: "Changed profile information",
              },
            ],
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching user:", error);
        showError("Failed to load user data. Please try again.");
        navigate("/dashboard/users");
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Format time duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Get status chip color
  const getStatusColor = (isActivated: boolean, isEmailConfirmed: boolean) => {
    if (!isActivated) {
      return "error";
    }
    if (!isEmailConfirmed) {
      return "warning";
    }
    return "success";
  };

  // Get status label
  const getStatusLabel = (isActivated: boolean, isEmailConfirmed: boolean) => {
    if (!isActivated) {
      return "Blocked";
    }
    if (!isEmailConfirmed) {
      return "Pending";
    }
    return "Active";
  };

  // Get initials for avatar
  const getInitials = (firstName: string, lastName: string) => {
    return (
      firstName.charAt(0) + (lastName ? lastName.charAt(0) : "")
    ).toUpperCase();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h5" color="error" align="center">
          User not found
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => navigate("/dashboard/users")}
            startIcon={<ArrowBack />}
          >
            Back to Users
          </Button>
        </Box>
      </Container>
    );
  }

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
                onClick={() => navigate("/dashboard")}
                style={{ cursor: "pointer" }}
              >
                <Dashboard sx={{ mr: 0.5 }} fontSize="inherit" />
                Dashboard
              </Link>
              <Link
                underline="hover"
                color="inherit"
                sx={{ display: "flex", alignItems: "center" }}
                onClick={() => navigate("/dashboard/users")}
                style={{ cursor: "pointer" }}
              >
                <Person sx={{ mr: 0.5 }} fontSize="inherit" />
                Users
              </Link>
              <Typography
                color="text.primary"
                sx={{ display: "flex", alignItems: "center" }}
              >
                User Details
              </Typography>
            </Breadcrumbs>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              gutterBottom
              sx={{ textAlign: "left" }}
            >
              User Profile
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View detailed information about this user
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2, mt: { xs: 2, md: 0 } }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate("/dashboard/users")}
              sx={{
                borderRadius: 1.5,
                transition: "all 0.2s",
                "&:hover": {
                  transform: "translateX(-3px)",
                },
              }}
            >
              Back to Users
            </Button>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => navigate(`/dashboard/users/${userId}/edit`)}
              sx={{
                borderRadius: 1.5,
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                transition: "all 0.2s",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 6px 10px 2px rgba(33, 203, 243, .3)",
                },
              }}
            >
              Edit User
            </Button>
          </Box>
        </Box>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3}>
            {/* User Profile Card */}
            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${alpha(
                      theme.palette.background.paper,
                      0.9
                    )}, ${alpha(theme.palette.background.paper, 0.95)})`,
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background: "linear-gradient(90deg, #2196F3, #21CBF3)",
                    },
                  }}
                >
                  <Avatar
                    src={user.imageUrl || undefined}
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: theme.palette.primary.main,
                      fontSize: "3rem",
                      mb: 2,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  >
                    {!user.imageUrl &&
                      getInitials(user.firstName, user.lastName)}
                  </Avatar>

                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {`${user.firstName} ${user.lastName}`}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                    {user.roles.map((role, index) => (
                      <Chip
                        key={index}
                        label={role}
                        color={
                          role === "admin"
                            ? "error"
                            : role === "teacher"
                            ? "info"
                            : "success"
                        }
                        size="small"
                        sx={{
                          fontWeight: "bold",
                          textTransform: "capitalize",
                        }}
                        icon={
                          role === "admin" ? (
                            <VerifiedUser
                              sx={{ fontSize: "0.8rem !important" }}
                            />
                          ) : (
                            <></>
                          )
                        }
                      />
                    ))}
                    <Chip
                      label={getStatusLabel(
                        user.isActivated,
                        user.isEmailConfirmed
                      )}
                      color={
                        getStatusColor(
                          user.isActivated,
                          user.isEmailConfirmed
                        ) as any
                      }
                      size="small"
                      sx={{
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                      icon={
                        !user.isActivated ? (
                          <Block sx={{ fontSize: "0.8rem !important" }} />
                        ) : (
                          <></>
                        )
                      }
                    />
                  </Box>

                  <Divider sx={{ width: "100%", my: 2 }} />

                  <Box sx={{ width: "100%" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Email
                        sx={{ color: theme.palette.text.secondary, mr: 1.5 }}
                      />
                      <Typography variant="body2">{user.email}</Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <CalendarToday
                        sx={{ color: theme.palette.text.secondary, mr: 1.5 }}
                      />
                      <Typography variant="body2">
                        Joined: {formatDate(user.createdAt).split(",")[0]}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <AccessTime
                        sx={{ color: theme.palette.text.secondary, mr: 1.5 }}
                      />
                      <Typography variant="body2">
                        Last Login: {formatDate(user.lastLogin)}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <School
                        sx={{ color: theme.palette.text.secondary, mr: 1.5 }}
                      />
                      <Typography variant="body2">
                        Lessons Completed: {user.lessonsCompleted}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ width: "100%", my: 2 }} />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 1,
                      width: "100%",
                    }}
                  >
                    <Tooltip title="Edit User">
                      <IconButton
                        color="info"
                        onClick={() =>
                          navigate(`/dashboard/users/${userId}/edit`)
                        }
                        sx={{
                          bgcolor: alpha(theme.palette.info.main, 0.1),
                          "&:hover": {
                            bgcolor: alpha(theme.palette.info.main, 0.2),
                          },
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Reset Password">
                      <IconButton
                        color="warning"
                        sx={{
                          bgcolor: alpha(theme.palette.warning.main, 0.1),
                          "&:hover": {
                            bgcolor: alpha(theme.palette.warning.main, 0.2),
                          },
                        }}
                      >
                        <Lock />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>

            {/* User Stats and Activity */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                {/* Stats Cards */}
                <Grid item xs={12}>
                  <motion.div variants={itemVariants}>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "1fr 1fr",
                          md: "1fr 1fr 1fr",
                        },
                        gap: 3,
                      }}
                    >
                      {/* Lessons Completed */}
                      <Card
                        sx={{
                          borderRadius: 2,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                          background: `linear-gradient(135deg, ${alpha(
                            theme.palette.primary.main,
                            0.1
                          )}, ${alpha(theme.palette.primary.main, 0.05)})`,
                          transition: "transform 0.3s",
                          "&:hover": {
                            transform: "translateY(-5px)",
                          },
                        }}
                      >
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              Lessons Completed
                            </Typography>
                            <School
                              sx={{ color: theme.palette.primary.main }}
                            />
                          </Box>
                          <Typography
                            variant="h4"
                            fontWeight="bold"
                            sx={{ mt: 2, mb: 1 }}
                          >
                            {user.lessonsCompleted}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total completed lessons
                          </Typography>
                        </CardContent>
                      </Card>

                      {/* Listening Time */}
                      <Card
                        sx={{
                          borderRadius: 2,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                          background: `linear-gradient(135deg, ${alpha(
                            theme.palette.info.main,
                            0.1
                          )}, ${alpha(theme.palette.info.main, 0.05)})`,
                          transition: "transform 0.3s",
                          "&:hover": {
                            transform: "translateY(-5px)",
                          },
                        }}
                      >
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              Listening Time
                            </Typography>
                            <Headphones
                              sx={{ color: theme.palette.info.main }}
                            />
                          </Box>
                          <Typography
                            variant="h4"
                            fontWeight="bold"
                            sx={{ mt: 2, mb: 1 }}
                          >
                            {formatDuration(user.totalListeningTime)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total time spent listening
                          </Typography>
                        </CardContent>
                      </Card>

                      {/* Average Score */}
                      <Card
                        sx={{
                          borderRadius: 2,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                          background: `linear-gradient(135deg, ${alpha(
                            theme.palette.success.main,
                            0.1
                          )}, ${alpha(theme.palette.success.main, 0.05)})`,
                          transition: "transform 0.3s",
                          "&:hover": {
                            transform: "translateY(-5px)",
                          },
                        }}
                      >
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              Average Score
                            </Typography>
                            <BarChart
                              sx={{ color: theme.palette.success.main }}
                            />
                          </Box>
                          <Typography
                            variant="h4"
                            fontWeight="bold"
                            sx={{ mt: 2, mb: 1 }}
                          >
                            {user.averageScore}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Average quiz score
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  </motion.div>
                </Grid>

                {/* Recent Activity */}
                <Grid item xs={12}>
                  <motion.div variants={itemVariants}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${alpha(
                          theme.palette.background.paper,
                          0.9
                        )}, ${alpha(theme.palette.background.paper, 0.95)})`,
                        backdropFilter: "blur(10px)",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                        position: "relative",
                        overflow: "hidden",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: "4px",
                          background:
                            "linear-gradient(90deg, #2196F3, #21CBF3)",
                        },
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        gutterBottom
                        sx={{ mb: 3 }}
                      >
                        Recent Activity
                      </Typography>

                      {user.recentActivity.length === 0 ? (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          align="center"
                          sx={{ py: 4 }}
                        >
                          No recent activity found
                        </Typography>
                      ) : (
                        <Box sx={{ position: "relative" }}>
                          {user.recentActivity.map((activity, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                mb:
                                  index === user.recentActivity.length - 1
                                    ? 0
                                    : 3,
                                position: "relative",
                                "&::before": {
                                  content: '""',
                                  position: "absolute",
                                  left: 12,
                                  top: 24,
                                  bottom:
                                    index === user.recentActivity.length - 1
                                      ? 0
                                      : -24,
                                  width: 2,
                                  bgcolor:
                                    index === user.recentActivity.length - 1
                                      ? "transparent"
                                      : alpha(theme.palette.primary.main, 0.2),
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: "50%",
                                  bgcolor: alpha(
                                    theme.palette.primary.main,
                                    0.2
                                  ),
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  mr: 2,
                                  flexShrink: 0,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: "50%",
                                    bgcolor: theme.palette.primary.main,
                                  }}
                                />
                              </Box>
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  fontWeight="bold"
                                >
                                  {activity.action}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {activity.details}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ display: "block", mt: 0.5 }}
                                >
                                  {formatDate(activity.date)}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Paper>
                  </motion.div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </motion.div>
      </motion.div>
    </Container>
  );
}

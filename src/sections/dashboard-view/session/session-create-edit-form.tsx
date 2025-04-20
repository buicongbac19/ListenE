"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  Breadcrumbs,
  Link,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  alpha,
} from "@mui/material";
import {
  Save,
  ArrowBack,
  Home,
  Dashboard,
  School,
  Topic as TopicIcon,
} from "@mui/icons-material";
import { SelectChangeEvent } from "@mui/material/Select";
import { motion } from "framer-motion";
import { useNotification } from "../../../provider/NotificationProvider";
import { getAllTopics } from "../../../api/topic";
import { getDetailsSession, updateSession } from "../../../api/session";
import { createSessionInTopic } from "../../../api/topic";

import type { ISessionCreateEditItem } from "../../../types/session";

// Define interfaces
interface ITopic {
  id: number;
  name: string;
}

export default function SessionCreateEditForm() {
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const theme = useTheme();
  const { sessionId } = useParams<{ sessionId: string }>();

  const isEditMode = !!sessionId;

  // Form state
  const [formData, setFormData] = useState<ISessionCreateEditItem>({
    name: "",
    topicId: null,
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [topics, setTopics] = useState<ITopic[]>([]);

  // Form validation
  const [errors, setErrors] = useState({
    name: "",
    topicId: "",
  });

  // Fetch topics on component mount
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await getAllTopics();
        setTopics(response?.data?.data);
      } catch (error) {
        console.error("Error fetching topics:", error);
        showError("Failed to load topics. Please try again.");
      }
    };

    fetchTopics();
  }, []);

  // Fetch session data if in edit mode
  useEffect(() => {
    if (isEditMode && sessionId) {
      const fetchSessionData = async () => {
        setLoading(true);
        try {
          const response = await getDetailsSession(Number.parseInt(sessionId));
          setFormData({
            name: response?.data?.data?.name,
            topicId: response?.data?.data?.topicId,
          });
        } catch (error) {
          console.error("Error fetching session:", error);
          showError("Failed to load session data. Please try again.");
          navigate("/dashboard/sessions");
        } finally {
          setLoading(false);
        }
      };

      fetchSessionData();
    }
  }, [isEditMode, sessionId]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value,
    });

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name as string]: "",
      });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors = {
      name: "",
      topicId: "",
    };

    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Session name is required";
      isValid = false;
    }

    if (!isEditMode && !formData.topicId) {
      newErrors.topicId = "Please select a topic";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      if (isEditMode && sessionId) {
        // Update existing session
        await updateSession(Number(sessionId), formData.name);
        showSuccess("Session updated successfully!");
      } else {
        // Create new session
        if (formData.topicId) {
          await createSessionInTopic(formData.topicId, formData.name);
          showSuccess("Session created successfully!");
        }
      }

      // Navigate back to sessions list
      navigate("/dashboard/manage-sessions");
    } catch (error) {
      console.error("Error saving session:", error);
      showError(
        `Failed to ${
          isEditMode ? "update" : "create"
        } session. Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
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
                onClick={() => navigate("/dashboard/sessions")}
                style={{ cursor: "pointer" }}
              >
                <School sx={{ mr: 0.5 }} fontSize="inherit" />
                Sessions
              </Link>
              <Typography
                color="text.primary"
                sx={{ display: "flex", alignItems: "center" }}
              >
                {isEditMode ? "Edit Session" : "Create Session"}
              </Typography>
            </Breadcrumbs>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              gutterBottom
              sx={{ textAlign: "left" }}
            >
              {isEditMode ? "Edit Session" : "Create New Session"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {isEditMode
                ? "Update the session information below"
                : "Fill in the details to create a new learning session"}
            </Typography>
          </Box>
        </Box>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
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
                background: "linear-gradient(90deg, #2196F3, #21CBF3)",
              },
            }}
          >
            <form onSubmit={handleSubmit}>
              <motion.div variants={itemVariants}>
                <TextField
                  name="name"
                  label="Session Name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={!!errors.name}
                  helperText={errors.name}
                  InputProps={{
                    sx: {
                      borderRadius: 1.5,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 0 0 2px rgba(33, 150, 243, 0.1)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 0 0 3px rgba(33, 150, 243, 0.2)",
                      },
                    },
                  }}
                  required
                />
              </motion.div>

              {!isEditMode && (
                <motion.div variants={itemVariants}>
                  <FormControl
                    fullWidth
                    margin="normal"
                    error={!!errors.topicId}
                    required
                  >
                    <InputLabel id="topic-select-label">Topic</InputLabel>
                    <Select
                      labelId="topic-select-label"
                      id="topic-select"
                      name="topicId"
                      value={formData.topicId ? String(formData.topicId) : ""}
                      onChange={handleSelectChange}
                      label="Topic"
                      sx={{
                        borderRadius: 1.5,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow: "0 0 0 2px rgba(33, 150, 243, 0.1)",
                        },
                        "&.Mui-focused": {
                          boxShadow: "0 0 0 3px rgba(33, 150, 243, 0.2)",
                        },
                      }}
                      startAdornment={
                        formData.topicId ? (
                          <TopicIcon
                            sx={{
                              ml: 1,
                              mr: 1,
                              color: theme.palette.primary.main,
                            }}
                          />
                        ) : null
                      }
                    >
                      {topics.map((topic) => (
                        <MenuItem key={topic.id} value={topic.id}>
                          {topic.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.topicId && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 0.5, ml: 1.5 }}
                      >
                        {errors.topicId}
                      </Typography>
                    )}
                  </FormControl>
                </motion.div>
              )}

              <motion.div variants={itemVariants} style={{ marginTop: "24px" }}>
                <Box
                  sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
                >
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => navigate("/dashboard/manage-sessions")}
                    startIcon={<ArrowBack />}
                    sx={{
                      borderRadius: 1.5,
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: "translateX(-3px)",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<Save />}
                    disabled={submitting}
                    sx={{
                      borderRadius: 1.5,
                      background:
                        "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                      boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 6px 10px 2px rgba(33, 203, 243, .3)",
                      },
                    }}
                  >
                    {submitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : isEditMode ? (
                      "Update Session"
                    ) : (
                      "Create Session"
                    )}
                  </Button>
                </Box>
              </motion.div>
            </form>
          </Paper>
        </motion.div>
      </motion.div>
    </Container>
  );
}

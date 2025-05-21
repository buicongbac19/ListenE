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
  FormHelperText,
  InputAdornment,
  IconButton,
  Avatar,
  Divider,
  Switch,
  FormControlLabel,
  Chip,
} from "@mui/material";
import {
  Save,
  ArrowBack,
  Home,
  Dashboard,
  Person,
  Visibility,
  VisibilityOff,
  Email,
  Badge,
  VpnKey,
  PersonAdd,
} from "@mui/icons-material";
import { motion } from "framer-motion";

// Define interfaces
interface IUserFormData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  roles: string[];
  isActivated: boolean;
  isEmailConfirmed: boolean;
}

export default function UserCreateEditForm() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { userId } = useParams<{ userId: string }>();

  const isEditMode = !!userId;

  // Form state
  const [formData, setFormData] = useState<IUserFormData>({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    roles: ["student"],
    isActivated: true,
    isEmailConfirmed: true,
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);

  // Form validation
  const [errors, setErrors] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    roles: "",
  });

  // Mock notification provider (replace with your actual notification provider)
  const showSuccess = (message: string) => console.log(message);
  const showError = (message: string) => console.error(message);

  // Fetch user data if in edit mode
  useEffect(() => {
    if (isEditMode && userId) {
      const fetchUserData = async () => {
        setLoading(true);
        try {
          // Mock API call
          setTimeout(() => {
            // Mock user data
            setFormData({
              email: "john.doe@example.com",
              firstName: "John",
              lastName: "Doe",
              password: "",
              confirmPassword: "",
              roles: ["student"],
              isActivated: true,
              isEmailConfirmed: true,
            });
            setLoading(false);
          }, 1000);
        } catch (error) {
          console.error("Error fetching user:", error);
          showError("Failed to load user data. Please try again.");
          navigate("/dashboard/users");
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [isEditMode, userId]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Toggle password visibility
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors = {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      roles: "",
    };

    let isValid = true;

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

    // Password validation (only required for new users)
    if (!isEditMode) {
      if (!formData.password) {
        newErrors.password = "Password is required";
        isValid = false;
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
        isValid = false;
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
        isValid = false;
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
        isValid = false;
      }
    } else if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (
      formData.password &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    // Role validation
    if (!formData.roles || formData.roles.length === 0) {
      newErrors.roles = "At least one role is required";
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
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      showSuccess(
        `User ${isEditMode ? "updated" : "created"} successfully!${
          sendWelcomeEmail && !isEditMode ? " Welcome email has been sent." : ""
        }`
      );

      // Navigate back to users list
      navigate("/dashboard/users");
    } catch (error) {
      console.error("Error saving user:", error);
      showError(
        `Failed to ${isEditMode ? "update" : "create"} user. Please try again.`
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

  // Get initials for avatar
  const getInitials = (firstName: string, lastName: string) => {
    return (
      firstName.charAt(0) + (lastName ? lastName.charAt(0) : "")
    ).toUpperCase();
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
                {isEditMode ? "Edit User" : "Create User"}
              </Typography>
            </Breadcrumbs>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              gutterBottom
              sx={{ textAlign: "left" }}
            >
              {isEditMode ? "Edit User" : "Create New User"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {isEditMode
                ? "Update the user information below"
                : "Fill in the details to create a new user account"}
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
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* User Avatar Section */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    mb: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: theme.palette.primary.main,
                      fontSize: "2rem",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  >
                    {formData.firstName || formData.lastName ? (
                      getInitials(formData.firstName, formData.lastName)
                    ) : (
                      <PersonAdd />
                    )}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {isEditMode
                        ? `${formData.firstName} ${formData.lastName}` ||
                          "Edit User"
                        : "New User Account"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {isEditMode
                        ? `User ID: ${userId}`
                        : "Complete the form to create a new user"}
                    </Typography>
                  </Box>
                </Box>

                <Divider />

                {/* Basic Information */}
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  color="primary"
                >
                  Basic Information
                </Typography>

                <motion.div variants={itemVariants}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 2,
                    }}
                  >
                    <TextField
                      name="firstName"
                      label="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      error={!!errors.firstName}
                      helperText={errors.firstName}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Badge color="primary" />
                          </InputAdornment>
                        ),
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
                    <TextField
                      name="lastName"
                      label="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      error={!!errors.lastName}
                      helperText={errors.lastName}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Badge color="primary" />
                          </InputAdornment>
                        ),
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
                  </Box>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <TextField
                    name="email"
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    error={!!errors.email}
                    helperText={errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="primary" />
                        </InputAdornment>
                      ),
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

                <motion.div variants={itemVariants}>
                  <FormControl fullWidth error={!!errors.roles} required>
                    <InputLabel id="role-select-label">User Role</InputLabel>
                    <Select
                      labelId="role-select-label"
                      id="role-select"
                      name="roles"
                      multiple
                      value={formData.roles}
                      onChange={(e) => {
                        const { value } = e.target;
                        setFormData({
                          ...formData,
                          roles: typeof value === "string" ? [value] : value,
                        });
                        if (errors.roles) {
                          setErrors({
                            ...errors,
                            roles: "",
                          });
                        }
                      }}
                      label="User Role"
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
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={value}
                              size="small"
                              sx={{ textTransform: "capitalize" }}
                            />
                          ))}
                        </Box>
                      )}
                    >
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="teacher">Teacher</MenuItem>
                      <MenuItem value="student">Student</MenuItem>
                    </Select>
                    {errors.roles && (
                      <FormHelperText>{errors.roles}</FormHelperText>
                    )}
                  </FormControl>
                </motion.div>

                <Divider />

                {/* Password Section */}
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  color="primary"
                >
                  {isEditMode ? "Change Password" : "Set Password"}
                </Typography>

                <motion.div variants={itemVariants}>
                  <TextField
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    error={!!errors.password}
                    helperText={
                      errors.password ||
                      (isEditMode
                        ? "Leave blank to keep current password"
                        : "Minimum 8 characters")
                    }
                    required={!isEditMode}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <VpnKey color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
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
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <TextField
                    name="confirmPassword"
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    required={!isEditMode || !!formData.password}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <VpnKey color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm password visibility"
                            onClick={handleToggleConfirmPasswordVisibility}
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
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
                  />
                </motion.div>

                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="primary"
                    gutterBottom
                  >
                    Account Status
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.isActivated}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isActivated: e.target.checked,
                            })
                          }
                          color="success"
                        />
                      }
                      label="Account is active"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.isEmailConfirmed}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isEmailConfirmed: e.target.checked,
                            })
                          }
                          color="info"
                        />
                      }
                      label="Email is confirmed"
                    />
                  </Box>
                </Box>

                {!isEditMode && (
                  <motion.div variants={itemVariants}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={sendWelcomeEmail}
                          onChange={(e) =>
                            setSendWelcomeEmail(e.target.checked)
                          }
                          color="primary"
                        />
                      }
                      label="Send welcome email with login instructions"
                    />
                  </motion.div>
                )}

                <Divider sx={{ mt: 2 }} />

                <motion.div
                  variants={itemVariants}
                  style={{ marginTop: "24px" }}
                >
                  <Box
                    sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={() => navigate("/dashboard/users")}
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
                        "Update User"
                      ) : (
                        "Create User"
                      )}
                    </Button>
                  </Box>
                </motion.div>
              </Box>
            </form>
          </Paper>
        </motion.div>
      </motion.div>
    </Container>
  );
}

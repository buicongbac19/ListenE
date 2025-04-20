"use client";

import type React from "react";

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Paper,
  Breadcrumbs,
  Link,
  useTheme,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tooltip,
  TableSortLabel,
  type SelectChangeEvent,
  alpha,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
} from "@mui/material";
import {
  Add,
  Search,
  Edit,
  Delete,
  Dashboard,
  Home,
  Refresh,
  ArrowUpward,
  ArrowDownward,
  FilterList,
  Topic as TopicIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNotification } from "../../../../provider/NotificationProvider";
import { getAllTopics, deleteTopic } from "../../../../api/topic";
import type { ITopicItem } from "../../../../types/topic";

type SortDirection = "asc" | "desc";

export default function TopicListView() {
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const theme = useTheme();

  // State for all topics (unfiltered)
  const [allTopics, setAllTopics] = useState<ITopicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  // Sorting state
  const [sortField, setSortField] = useState<string>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Fetch all topics
  const fetchTopics = async () => {
    setLoading(true);
    try {
      const response = await getAllTopics();
      setAllTopics(response?.data?.data);
    } catch (error) {
      console.error("Error fetching topics:", error);
      showError("Failed to load topics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  // Filter, sort, and paginate topics on the client side
  const filteredAndSortedTopics = useMemo(() => {
    // First, filter by search term
    let result = [...allTopics];

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        (topic) =>
          topic.name.toLowerCase().includes(lowerSearchTerm) ||
          (topic.description &&
            topic.description.toLowerCase().includes(lowerSearchTerm))
      );
    }

    // Then sort
    result.sort((a, b) => {
      let comparison = 0;

      if (sortField === "id") {
        comparison = a.id - b.id;
      } else if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === "sessionCount") {
        comparison = a.sessionCount - b.sessionCount;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [allTopics, searchTerm, sortField, sortDirection]);

  // Calculate pagination
  const totalItems = filteredAndSortedTopics.length;
  const totalPages = Math.ceil(totalItems / size);

  // Get current page items
  const currentTopics = useMemo(() => {
    const startIndex = (page - 1) * size;
    return filteredAndSortedTopics.slice(startIndex, startIndex + size);
  }, [filteredAndSortedTopics, page, size]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleSizeChange = (event: SelectChangeEvent<number>) => {
    setSize(event.target.value as number);
    setPage(1);
  };

  const handleSort = (field: string) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const handleEditTopic = (topicId: number) => {
    navigate(`/dashboard/topics/${topicId}/edit`);
  };

  const handleDeleteClick = (topicId: number) => {
    setSelectedTopicId(topicId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedTopicId(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedTopicId) {
      try {
        await deleteTopic(selectedTopicId);
        // Update local state after successful deletion
        setAllTopics(allTopics.filter((topic) => topic.id !== selectedTopicId));
        showSuccess("Topic deleted successfully!");
      } catch (error) {
        console.error("Error deleting topic:", error);
        showError(`Failed to delete topic: ${error}`);
      }
    }
    setDeleteDialogOpen(false);
    setSelectedTopicId(null);
  };

  const handleRefresh = () => {
    fetchTopics();
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
              <Typography
                color="text.primary"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <TopicIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Topics
              </Typography>
            </Breadcrumbs>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              gutterBottom
              sx={{ textAlign: "left" }}
            >
              Topics
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your learning topics and create new content
            </Typography>
          </Box>

          <Box sx={{ mt: { xs: 2, md: 0 } }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate("/dashboard/topics/create")}
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
              New Topic
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
              placeholder="Search topics..."
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
        ) : currentTopics.length === 0 ? (
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 2,
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No topics found
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Try adjusting your search or create a new topic.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate("/dashboard/topics/create")}
            >
              Create New Topic
            </Button>
          </Paper>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <Table sx={{ minWidth: 650 }} aria-label="topics table">
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      "& th": {
                        fontWeight: "bold",
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    <TableCell>
                      <TableSortLabel
                        active={sortField === "id"}
                        direction={sortField === "id" ? sortDirection : "asc"}
                        onClick={() => handleSort("id")}
                        IconComponent={
                          sortField === "id" && sortDirection === "asc"
                            ? ArrowUpward
                            : ArrowDownward
                        }
                      >
                        ID
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Thumbnail</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === "name"}
                        direction={sortField === "name" ? sortDirection : "asc"}
                        onClick={() => handleSort("name")}
                        IconComponent={
                          sortField === "name" && sortDirection === "asc"
                            ? ArrowUpward
                            : ArrowDownward
                        }
                      >
                        Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="center">
                      <TableSortLabel
                        active={sortField === "sessionCount"}
                        direction={
                          sortField === "sessionCount" ? sortDirection : "asc"
                        }
                        onClick={() => handleSort("sessionCount")}
                        IconComponent={
                          sortField === "sessionCount" &&
                          sortDirection === "asc"
                            ? ArrowUpward
                            : ArrowDownward
                        }
                      >
                        Sessions
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentTopics.map((topic, index) => (
                    <TableRow
                      key={topic.id}
                      sx={{
                        "&:nth-of-type(odd)": {
                          bgcolor: alpha(theme.palette.primary.main, 0.02),
                        },
                        "&:hover": {
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                        },
                        transition: "background-color 0.2s",
                        animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`,
                        "@keyframes fadeIn": {
                          from: { opacity: 0, transform: "translateY(20px)" },
                          to: { opacity: 1, transform: "translateY(0)" },
                        },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {topic.id}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            backgroundImage: topic.thumbnailUrl
                              ? `url(${topic.thumbnailUrl})`
                              : 'url("/placeholder.svg?height=40&width=40")',
                            backgroundPosition: "center center",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "contain",
                            width: "60px",
                            height: "60px",
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          color: theme.palette.text.primary,
                          maxWidth: { xs: "120px", sm: "200px", md: "300px" },
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {topic.name}
                      </TableCell>
                      <TableCell
                        sx={{
                          maxWidth: { xs: "120px", sm: "200px", md: "300px" },
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {topic.description || "-"}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={topic.sessionCount}
                          color={topic.sessionCount > 0 ? "primary" : "default"}
                          size="small"
                          sx={{
                            minWidth: "60px",
                            fontWeight: "bold",
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                          }}
                        >
                          <Tooltip title="Edit Topic">
                            <IconButton
                              size="small"
                              color="info"
                              onClick={() => handleEditTopic(topic.id)}
                              sx={{
                                bgcolor: alpha(theme.palette.info.main, 0.1),
                                "&:hover": {
                                  bgcolor: alpha(theme.palette.info.main, 0.2),
                                },
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Topic">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(topic.id)}
                              sx={{
                                bgcolor: alpha(theme.palette.error.main, 0.1),
                                "&:hover": {
                                  bgcolor: alpha(theme.palette.error.main, 0.2),
                                },
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination controls */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 4,
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Showing {currentTopics.length} of {totalItems} topics
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <FormControl size="small" sx={{ minWidth: 80 }}>
                  <InputLabel id="page-size-label">Per Page</InputLabel>
                  <Select
                    labelId="page-size-label"
                    id="page-size"
                    value={size}
                    label="Per Page"
                    onChange={handleSizeChange}
                  >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                  </Select>
                </FormControl>

                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  showFirstButton
                  showLastButton
                  sx={{
                    "& .MuiPaginationItem-root": {
                      borderRadius: 1,
                    },
                  }}
                />
              </Box>
            </Box>
          </motion.div>
        )}
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this topic? This action cannot be
            undone and will also delete all associated sessions.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

import type React from "react";

import { useState, useEffect, useRef } from "react";
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
  alpha,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Collapse,
  Alert,
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
  LocalOffer,
  FilterList,
  Close,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { motion } from "framer-motion";
import { getAllTags, bulkDeleteTag } from "../../../../api/tag";
import { useNotification } from "../../../../provider/NotificationProvider";
import type { ITagItem } from "../../../../types/tag";

// Define sort direction type
type SortDirection = "asc" | "desc";

export default function TagListView() {
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const theme = useTheme();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // State
  const [tags, setTags] = useState<ITagItem[]>([]);
  const [filteredTags, setFilteredTags] = useState<ITagItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Sorting state
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Fetch all tags
  const fetchTags = async () => {
    setLoading(true);
    try {
      const response = await getAllTags();
      if (response?.items) {
        const fetchedTags = response.items;
        setTags(fetchedTags);

        // Apply sorting to the fetched tags
        const sorted = sortTags(fetchedTags, sortField, sortDirection);
        setFilteredTags(sorted);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
      showError("Failed to load tags. Please try again.");
      setErrorMessage("Failed to load tags. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Sort tags based on field and direction
  const sortTags = (
    tagsToSort: ITagItem[],
    field: string,
    direction: SortDirection
  ) => {
    return [...tagsToSort].sort((a, b) => {
      if (field === "id") {
        return direction === "asc" ? a.id - b.id : b.id - a.id;
      } else if (field === "type") {
        const typeA = (a.type || "").toLowerCase();
        const typeB = (b.type || "").toLowerCase();
        return direction === "asc"
          ? typeA.localeCompare(typeB)
          : typeB.localeCompare(typeA);
      } else {
        // Default sort by name
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return direction === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
    });
  };

  useEffect(() => {
    fetchTags();
  }, []);

  // Apply sorting and filtering when dependencies change
  useEffect(() => {
    if (tags.length > 0) {
      let result = [...tags];

      // Apply search filter
      if (searchTerm) {
        result = result.filter((tag) =>
          tag.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply sorting
      result = sortTags(result, sortField, sortDirection);

      setFilteredTags(result);
    }
  }, [searchTerm, sortField, sortDirection, tags]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Handle sort
  const handleSort = (field: string) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  // Handle tag selection
  const handleTagSelect = (tagId: number) => {
    setSelectedTagIds((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((id) => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };

  // Handle select all tags
  const handleSelectAll = () => {
    if (selectedTagIds.length === filteredTags.length) {
      setSelectedTagIds([]);
    } else {
      setSelectedTagIds(filteredTags.map((tag) => tag.id));
    }
  };

  // Handle edit tag
  const handleEditTag = (tagId: number) => {
    navigate(`/dashboard/tags/${tagId}/edit`);
  };

  // Handle delete click
  const handleDeleteClick = (tagId?: number) => {
    if (tagId) {
      setSelectedTagIds([tagId]);
    }

    if (selectedTagIds.length === 0 && !tagId) {
      setErrorMessage("Please select at least one tag to delete");
      return;
    }

    setDeleteDialogOpen(true);
  };

  // Handle delete cancel
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (selectedTagIds.length === 0) return;

    setDeleteLoading(true);

    try {
      await bulkDeleteTag(selectedTagIds);
      showSuccess(`${selectedTagIds.length} tag(s) deleted successfully!`);
      setSuccessMessage(
        `${selectedTagIds.length} tag(s) deleted successfully!`
      );
      setSelectedTagIds([]);
      fetchTags();
    } catch (error) {
      console.error("Error deleting tags:", error);
      showError("Failed to delete tags. Please try again.");
      setErrorMessage("Failed to delete tags. Please try again.");
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchTags();
  };

  // Clear messages after a delay
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

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

  // Function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
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
                <LocalOffer sx={{ mr: 0.5 }} fontSize="inherit" />
                Tags
              </Typography>
            </Breadcrumbs>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              gutterBottom
              sx={{ textAlign: "left" }}
            >
              Manage Tags
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create, edit, and manage tags for your questions
            </Typography>
          </Box>

          <Box sx={{ mt: { xs: 2, md: 0 } }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate("/dashboard/tags/create")}
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
              New Tag
            </Button>
            <IconButton onClick={handleRefresh} color="primary">
              <Refresh />
            </IconButton>
          </Box>
        </Box>

        {/* Error and Success Messages */}
        <Collapse in={!!errorMessage}>
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setErrorMessage("")}
              >
                <Close fontSize="inherit" />
              </IconButton>
            }
          >
            {errorMessage}
          </Alert>
        </Collapse>

        <Collapse in={!!successMessage}>
          <Alert
            severity="success"
            sx={{ mb: 2 }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setSuccessMessage("")}
              >
                <Close fontSize="inherit" />
              </IconButton>
            }
          >
            {successMessage}
          </Alert>
        </Collapse>

        {/* Search and Filters */}
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
              justifyContent: "space-between",
            }}
          >
            <TextField
              placeholder="Search tags..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              inputRef={searchInputRef}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={handleClearSearch}
                      edge="end"
                    >
                      <Close fontSize="inherit" />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 1.5 },
              }}
              sx={{ width: { xs: "100%", sm: "auto", md: 300 } }}
            />

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                startIcon={<FilterList />}
                onClick={handleSelectAll}
                sx={{
                  borderRadius: 1.5,
                  transition: "all 0.2s",
                }}
              >
                {selectedTagIds.length === filteredTags.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>

              {selectedTagIds.length > 0 && (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<Delete />}
                  onClick={() => handleDeleteClick()}
                  sx={{
                    borderRadius: 1.5,
                  }}
                >
                  Delete ({selectedTagIds.length})
                </Button>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Tags Table */}
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
        ) : filteredTags.length === 0 ? (
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 2,
              bgcolor: "background.paper",
            }}
          >
            <LocalOffer
              sx={{
                fontSize: 60,
                color: alpha(theme.palette.text.secondary, 0.2),
                mb: 2,
              }}
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {searchTerm
                ? "No tags found matching your search"
                : "No tags found"}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {searchTerm
                ? "Try a different search term or clear the search"
                : "Start by adding some tags to organize your content"}
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate("/dashboard/tags/create")}
              sx={{
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              }}
            >
              Create New Tag
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
              <Table sx={{ minWidth: 650 }} aria-label="tags table">
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
                    <TableCell padding="checkbox">
                      <Tooltip title="Select All">
                        <Chip
                          label={`${selectedTagIds.length}/${filteredTags.length}`}
                          size="small"
                          color={
                            selectedTagIds.length > 0 ? "primary" : "default"
                          }
                          variant={
                            selectedTagIds.length > 0 ? "filled" : "outlined"
                          }
                          onClick={handleSelectAll}
                          sx={{ cursor: "pointer" }}
                        />
                      </Tooltip>
                    </TableCell>
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
                        Tag Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === "type"}
                        direction={sortField === "type" ? sortDirection : "asc"}
                        onClick={() => handleSort("type")}
                        IconComponent={
                          sortField === "type" && sortDirection === "asc"
                            ? ArrowUpward
                            : ArrowDownward
                        }
                      >
                        Type
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTags.map((tag, index) => (
                    <TableRow
                      key={tag.id}
                      sx={{
                        "&:nth-of-type(odd)": {
                          bgcolor: alpha(theme.palette.primary.main, 0.02),
                        },
                        "&:hover": {
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                        },
                        bgcolor: selectedTagIds.includes(tag.id)
                          ? alpha(theme.palette.primary.main, 0.1)
                          : "inherit",
                        transition: "background-color 0.2s",
                        // Animation with CSS
                        animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`,
                        "@keyframes fadeIn": {
                          from: { opacity: 0, transform: "translateY(20px)" },
                          to: { opacity: 1, transform: "translateY(0)" },
                        },
                      }}
                      onClick={() => handleTagSelect(tag.id)}
                    >
                      <TableCell padding="checkbox">
                        <Chip
                          icon={<LocalOffer fontSize="small" />}
                          label={
                            selectedTagIds.includes(tag.id)
                              ? "Selected"
                              : "Select"
                          }
                          size="small"
                          color={
                            selectedTagIds.includes(tag.id)
                              ? "primary"
                              : "default"
                          }
                          variant={
                            selectedTagIds.includes(tag.id)
                              ? "filled"
                              : "outlined"
                          }
                          sx={{ cursor: "pointer" }}
                        />
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {tag.id}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: selectedTagIds.includes(tag.id)
                            ? 600
                            : 500,
                          color: selectedTagIds.includes(tag.id)
                            ? theme.palette.primary.main
                            : theme.palette.text.primary,
                          maxWidth: { xs: "120px", sm: "200px", md: "300px" },
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Tooltip title={tag.name}>
                          <span>{truncateText(tag.name, 50)}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: selectedTagIds.includes(tag.id)
                            ? 600
                            : 500,
                          color: selectedTagIds.includes(tag.id)
                            ? theme.palette.primary.main
                            : theme.palette.text.primary,
                        }}
                      >
                        <Chip
                          label={tag.type || "Default"}
                          size="small"
                          variant="outlined"
                          color="secondary"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Tooltip title="Edit Tag">
                            <IconButton
                              size="small"
                              color="info"
                              onClick={() => handleEditTag(tag.id)}
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
                          <Tooltip title="Delete Tag">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(tag.id)}
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

            {/* Summary */}
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
                Showing {filteredTags.length} of {tags.length} tags
              </Typography>
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
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete{" "}
            {selectedTagIds.length === 1
              ? "this tag"
              : `these ${selectedTagIds.length} tags`}
            ? This action cannot be undone.
          </DialogContentText>
          {selectedTagIds.length > 0 && (
            <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {selectedTagIds.map((id) => {
                const tag = tags.find((t) => t.id === id);
                return tag ? (
                  <Chip
                    key={tag.id}
                    label={tag.name}
                    size="small"
                    icon={<LocalOffer fontSize="small" />}
                    color="primary"
                    variant="outlined"
                  />
                ) : null;
              })}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleDeleteCancel}
            color="primary"
            sx={{ borderRadius: 1.5 }}
          >
            Cancel
          </Button>
          <LoadingButton
            loading={deleteLoading}
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            autoFocus
            sx={{
              borderRadius: 1.5,
              boxShadow: "0 3px 5px 2px rgba(239, 83, 80, .2)",
            }}
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  IconButton,
  CircularProgress,
  Paper,
  Breadcrumbs,
  Link,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  alpha,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Dashboard,
  Home,
  Refresh,
  School,
  LibraryMusic,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { motion } from "framer-motion";
import type { ITrackReponseItem } from "../../../types/track";
import { useNotification } from "../../../provider/NotificationProvider";
import { getListSessionTracks } from "../../../api/session";
import { deleteTrack } from "../../../api/track";

export default function SessionTrackListView() {
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const theme = useTheme();
  const { sessionId } = useParams<{ sessionId: string }>();

  const [tracks, setTracks] = useState<ITrackReponseItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [selectedTrackId, setSelectedTrackId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  const getAllSessionTracks = async (sessionId: number) => {
    if (!sessionId) return;

    setLoading(true);
    try {
      const response = await getListSessionTracks(sessionId);
      setTracks(response?.data?.data);
    } catch (error) {
      console.error("Error fetching tracks:", error);
      showError("Failed to load tracks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) getAllSessionTracks(Number(sessionId));
  }, [sessionId]);

  const handleCreateTrack = () => {
    if (sessionId) {
      navigate(`/dashboard/sessions/${sessionId}/create-track`);
    }
  };

  const handleEditTrack = (trackId: number) => {
    if (sessionId) {
      navigate(`/dashboard/sessions/${sessionId}/tracks/${trackId}/edit`);
    }
  };

  const handleDeleteClick = (trackId: number) => {
    setSelectedTrackId(trackId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedTrackId(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedTrackId) {
      setDeleteLoading(true);
      try {
        await deleteTrack(selectedTrackId);
        setTracks(tracks.filter((track) => track.id !== selectedTrackId));
        showSuccess("Track deleted successfully!");
      } catch (error) {
        console.error("Error deleting track:", error);
        showError(`Failed to delete track: ${error}`);
      } finally {
        setDeleteLoading(false);
      }
    }
    setDeleteDialogOpen(false);
    setSelectedTrackId(null);
  };

  const handleRefresh = () => {
    getAllSessionTracks(Number(sessionId));
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
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
                <LibraryMusic sx={{ mr: 0.5 }} fontSize="inherit" />
                Tracks
              </Typography>
            </Breadcrumbs>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              gutterBottom
              sx={{ textAlign: "left" }}
            >
              List Tracks of Session {sessionId}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your learning tracks and create new segments
            </Typography>
          </Box>

          <Box sx={{ mt: { xs: 2, md: 0 } }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreateTrack}
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
              New Track
            </Button>
            <IconButton onClick={handleRefresh} color="primary">
              <Refresh />
            </IconButton>
          </Box>
        </Box>

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
        ) : tracks.length === 0 ? (
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 2,
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No tracks found
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Try adjusting your search or create a new track.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreateTrack}
            >
              Create New Track
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
              <Table sx={{ minWidth: 650 }} aria-label="tracks table">
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
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tracks?.map((track, index) => (
                    <motion.tr
                      key={track.id}
                      variants={itemVariants}
                      custom={index}
                      style={{
                        backgroundColor:
                          index % 2 === 0
                            ? alpha(theme.palette.primary.main, 0.02)
                            : "transparent",
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {track.id}
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
                        {track.name}
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                          }}
                        >
                          <Tooltip title="Edit Track">
                            <IconButton
                              size="small"
                              color="info"
                              onClick={() => handleEditTrack(track.id)}
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
                          <Tooltip title="Delete Track">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(track.id)}
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
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
            Are you sure you want to delete this track? This action cannot be
            undone and will also delete all associated segments.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <LoadingButton
            loading={deleteLoading}
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

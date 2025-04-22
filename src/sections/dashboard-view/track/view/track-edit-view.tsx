"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
  Alert,
  Backdrop,
  CircularProgress,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Divider,
  Chip,
  Tooltip,
  Card,
  CardContent,
  InputAdornment,
  alpha,
  Tab,
  Tabs,
  Breadcrumbs,
  Link,
  Container,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  ContentCut,
  PlayArrow,
  Stop,
  PlayCircleOutline,
  PauseCircleOutline,
  Clear,
  MusicNote,
  Save,
  Title,
  Description,
  AudioFile,
  TextFields,
  Add,
  Delete,
  Dashboard,
  Home,
  School,
  LibraryMusic,
} from "@mui/icons-material";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import type { IPostSegmentItem } from "../../../../types/segment";
import { useNotification } from "../../../../provider/NotificationProvider";
import { getDetailsTrack, updateTrack } from "../../../../api/track";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`track-tabpanel-${index}`}
      aria-labelledby={`track-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `track-tab-${index}`,
    "aria-controls": `track-tabpanel-${index}`,
  };
}

interface RegionOptions {
  start: number;
  end: number;
  color?: string;
  drag?: boolean;
  resize?: boolean;
}

export default function TrackEditView() {
  const { showSuccess, showError } = useNotification();
  const { sessionId, trackId } = useParams<{
    sessionId: string;
    trackId: string;
  }>();
  const navigate = useNavigate();

  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackData, setTrackData] = useState<any>(null);

  // Track information
  const [trackName, setTrackName] = useState("");
  const [trackNameError, setTrackNameError] = useState("");
  const [fullTranscript, setFullTranscript] = useState("");
  const [segments, setSegments] = useState<IPostSegmentItem[]>([]);
  const [originalSegments, setOriginalSegments] = useState<IPostSegmentItem[]>(
    []
  );
  const [newSegmentText, setNewSegmentText] = useState("");

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const [selectedSegmentId, setSelectedSegmentId] = useState<number | null>(
    null
  );
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [regionsPlugin, setRegionsPlugin] = useState<any>(null);
  const [playingSegmentId, setPlayingSegmentId] = useState<number | null>(null);

  // Dialog state
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [segmentToClean, setSegmentToClean] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [segmentToDelete, setSegmentToDelete] = useState<number | null>(null);

  const waveformRef = useRef<HTMLDivElement>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Fetch track data
  useEffect(() => {
    const fetchTrackData = async () => {
      if (!trackId) return;

      setLoading(true);
      try {
        const response = await getDetailsTrack(Number.parseInt(trackId));
        const data = response?.data?.data || response; // Adjust based on your API response structure

        setTrackData(data);
        setTrackName(data.name);
        setFullTranscript(data.fullAudioTranscript || data.fullTranscript);
        setSegments(data.segments);
        setOriginalSegments(JSON.parse(JSON.stringify(data.segments)));
        setAudioUrl(data.fullAudioUrl);
      } catch (err) {
        console.error("Error fetching track:", err);
        showError("Không thể tải thông tin track. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrackData();
  }, [trackId]);

  // Initialize WaveSurfer
  useEffect(() => {
    if (waveformRef.current && !wavesurfer && audioUrl) {
      try {
        const regions = RegionsPlugin.create();

        if (regions) {
          // @ts-ignore - These properties exist at runtime
          regions.regionsMinLength = 0.1;
          // @ts-ignore - These properties exist at runtime
          regions.dragSelection = true;
        }

        const ws = WaveSurfer.create({
          container: waveformRef.current,
          waveColor: "#4a83ff",
          progressColor: "#1e50ff",
          cursorColor: "#333",
          barWidth: 2,
          barGap: 1,
          height: 200,
          normalize: true,
          plugins: [regions],
        });

        ws.load(audioUrl);

        ws.on("ready", () => {
          // Add regions for each segment
          if (segments.length > 0 && regions) {
            regions.clearRegions();

            segments.forEach((segment) => {
              if (
                segment.startSec !== undefined &&
                segment.endSec !== undefined &&
                segment.startSec !== null &&
                segment.endSec !== null
              ) {
                regions.addRegion({
                  start: segment.startSec,
                  end: segment.endSec,
                  color: "rgba(74, 131, 255, 0.2)",
                  drag: true,
                  resize: true,
                  id: `segment-${segment.id}`,
                });
              }
            });
          }
        });

        ws.on("finish", () => setIsPlaying(false));

        regions.on("region-updated", (region: any) => {
          setSelectedRegion({ start: region.start, end: region.end });

          // If the region has an ID that matches a segment, update that segment
          if (region.id && region.id.startsWith("segment-")) {
            const segmentId = Number.parseInt(
              region.id.replace("segment-", "")
            );
            updateSegmentTiming(segmentId, region.start, region.end);
          }
        });

        regions.on("region-clicked", (region: any) => {
          if (region.id && region.id.startsWith("segment-")) {
            const segmentId = Number.parseInt(
              region.id.replace("segment-", "")
            );
            setSelectedSegmentId(segmentId);
            setSelectedRegion({ start: region.start, end: region.end });
          }
        });

        setWavesurfer(ws);
        setRegionsPlugin(regions);

        return () => ws.destroy();
      } catch (err) {
        console.error("Error initializing WaveSurfer:", err);
        setError("Không thể khởi tạo trình phát âm thanh. Vui lòng thử lại.");
      }
    }
  }, [waveformRef, audioUrl, segments]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTrackNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTrackName(value);

    if (!value) {
      setTrackNameError("Tên track không được để trống");
    } else if (value.length > 255) {
      setTrackNameError("Tên track không được vượt quá 255 ký tự");
    } else {
      setTrackNameError("");
    }
  };

  const handleFullTranscriptChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFullTranscript(e.target.value);
  };

  const togglePlayback = () => {
    if (!wavesurfer) return;

    if (isPlaying) {
      wavesurfer.pause();
      setIsPlaying(false);
    } else if (selectedRegion) {
      const playbackDuration = selectedRegion.end - selectedRegion.start;

      wavesurfer.play(selectedRegion.start, selectedRegion.end);
      setIsPlaying(true);

      setTimeout(() => {
        setIsPlaying(false);
      }, playbackDuration * 1000 + 50);
    } else {
      wavesurfer.play();
      setIsPlaying(true);
    }
  };

  const playSegmentAudio = (segmentId: number) => {
    if (!audioUrl) return;

    const segment = segments.find((s) => s.id === segmentId);
    if (
      !segment ||
      segment.startSec === undefined ||
      segment.endSec === undefined ||
      segment.startSec === null ||
      segment.endSec === null
    ) {
      setError("Segment này chưa được gán thời gian.");
      return;
    }

    if (playingSegmentId === segmentId) {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
      setPlayingSegmentId(null);
      return;
    }

    if (!audioElementRef.current) {
      audioElementRef.current = new Audio(audioUrl);
    } else {
      audioElementRef.current.src = audioUrl;
    }

    audioElementRef.current.onended = () => {
      setPlayingSegmentId(null);
    };

    audioElementRef.current.currentTime = segment.startSec;

    audioElementRef.current.play();

    setPlayingSegmentId(segmentId);

    const duration = segment.endSec - segment.startSec;
    setTimeout(() => {
      if (audioElementRef.current && playingSegmentId === segmentId) {
        audioElementRef.current.pause();
        setPlayingSegmentId(null);
      }
    }, duration * 1000 + 50);
  };

  const assignRegionToSegment = () => {
    if (!selectedRegion || !selectedSegmentId) {
      setError("Vui lòng chọn vùng và segment trước khi gán.");
      return;
    }

    updateSegmentTiming(
      selectedSegmentId,
      selectedRegion.start,
      selectedRegion.end
    );

    // Update the region in the waveform
    if (regionsPlugin) {
      const regionId = `segment-${selectedSegmentId}`;
      const existingRegion = regionsPlugin
        .getRegions()
        .find((r: any) => r.id === regionId);

      if (existingRegion) {
        existingRegion.update({
          start: selectedRegion.start,
          end: selectedRegion.end,
        });
      } else {
        regionsPlugin.addRegion({
          start: selectedRegion.start,
          end: selectedRegion.end,
          color: "rgba(74, 131, 255, 0.2)",
          drag: true,
          resize: true,
          id: regionId,
        });
      }
    }
  };

  const updateSegmentTiming = (
    segmentId: number,
    start: number,
    end: number
  ) => {
    setSegments((prev) =>
      prev.map((s) => {
        if (s.id === segmentId) {
          return {
            ...s,
            startSec: start,
            endSec: end,
          };
        }
        return s;
      })
    );
  };

  const handleClearClick = (segmentId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSegmentToClean(segmentId);
    setClearDialogOpen(true);
  };

  const handleClearConfirm = () => {
    if (segmentToClean !== null) {
      setSegments((prev) =>
        prev.map((s) => {
          if (s.id === segmentToClean) {
            return {
              ...s,
              startSec: null,
              endSec: null,
            };
          }
          return s;
        })
      );

      // Remove the region from the waveform
      if (regionsPlugin) {
        const regionId = `segment-${segmentToClean}`;
        const existingRegion = regionsPlugin
          .getRegions()
          .find((r: any) => r.id === regionId);
        if (existingRegion) {
          existingRegion.remove();
        }
      }

      if (playingSegmentId === segmentToClean) {
        if (audioElementRef.current) {
          audioElementRef.current.pause();
        }
        setPlayingSegmentId(null);
      }
    }

    setClearDialogOpen(false);
    setSegmentToClean(null);
  };

  const handleClearCancel = () => {
    setClearDialogOpen(false);
    setSegmentToClean(null);
  };

  const handleDeleteClick = (segmentId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSegmentToDelete(segmentId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (segmentToDelete !== null) {
      setSegments((prev) => prev.filter((s) => s.id !== segmentToDelete));

      // Remove the region from the waveform
      if (regionsPlugin) {
        const regionId = `segment-${segmentToDelete}`;
        const existingRegion = regionsPlugin
          .getRegions()
          .find((r: any) => r.id === regionId);
        if (existingRegion) {
          existingRegion.remove();
        }
      }

      if (playingSegmentId === segmentToDelete) {
        if (audioElementRef.current) {
          audioElementRef.current.pause();
        }
        setPlayingSegmentId(null);
      }
    }

    setDeleteDialogOpen(false);
    setSegmentToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSegmentToDelete(null);
  };

  const handleSegmentTextChange = (segmentId: number, newText: string) => {
    setSegments((prev) =>
      prev.map((s) => {
        if (s.id === segmentId) {
          return {
            ...s,
            transcript: newText,
          };
        }
        return s;
      })
    );
  };

  const handleAddSegment = () => {
    if (!newSegmentText.trim()) {
      setError("Vui lòng nhập nội dung cho segment mới");
      return;
    }

    // Find the highest ID and order to create a new segment
    const maxId = Math.max(...segments.map((s) => s.id), 0);
    const maxOrder = Math.max(...segments.map((s) => s.order), 0);

    const newSegment: IPostSegmentItem = {
      id: maxId + 1,
      order: maxOrder + 1,
      transcript: newSegmentText.trim(),
      startSec: null,
      endSec: null,
    };

    setSegments([...segments, newSegment]);
    setNewSegmentText("");
  };

  const formatTime = (time: number | null | undefined): string => {
    if (time === null || time === undefined) return "-";

    const m = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    const ms = Math.floor((time % 1) * 1000)
      .toString()
      .padStart(3, "0");
    return `${m}:${s}.${ms}`;
  };

  const handleSaveChanges = async () => {
    if (!trackName) {
      setTrackNameError("Vui lòng nhập tên cho track");
      return;
    }

    setApiLoading(true);
    setError(null);

    try {
      // Prepare data for API
      const updateData = {
        name: trackName,
        fullTranscript: fullTranscript,
        segments: segments.map((segment) => ({
          id: segment.id,
          orderInTrack: segment.order,
          startSec: segment.startSec,
          endSec: segment.endSec,
          transcript: segment.transcript,
        })),
      };

      if (trackId) {
        await updateTrack(Number.parseInt(trackId), updateData);
        showSuccess("Cập nhật track thành công!");
        setOriginalSegments(JSON.parse(JSON.stringify(segments)));

        // Navigate back to the track list
        if (sessionId) {
          navigate(`/dashboard/sessions/${sessionId}/tracks`);
        }
      }
    } catch (err) {
      console.error("API error:", err);
      setError("Không thể cập nhật track. Vui lòng thử lại sau.");
    } finally {
      setApiLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
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
          <Link
            underline="hover"
            color="inherit"
            sx={{ display: "flex", alignItems: "center" }}
            onClick={() =>
              sessionId && navigate(`/dashboard/sessions/${sessionId}/tracks`)
            }
            style={{ cursor: "pointer" }}
          >
            <LibraryMusic sx={{ mr: 0.5 }} fontSize="inherit" />
            Tracks
          </Link>
          <Typography
            color="text.primary"
            sx={{ display: "flex", alignItems: "center" }}
          >
            Edit Track
          </Typography>
        </Breadcrumbs>
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          gutterBottom
          sx={{ textAlign: "left" }}
        >
          Chỉnh sửa Track
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Cập nhật thông tin và nội dung của track
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Track Information Card */}
      <Card
        elevation={3}
        sx={{
          mb: 4,
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <Box
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            py: 1.5,
            px: 3,
            display: "flex",
            alignItems: "center",
          }}
        >
          <MusicNote sx={{ mr: 1 }} />
          <Typography variant="h6">Thông tin Track</Typography>
        </Box>
        <CardContent sx={{ p: 3 }}>
          <TextField
            label="Tên Track"
            value={trackName}
            onChange={handleTrackNameChange}
            error={!!trackNameError}
            helperText={trackNameError}
            fullWidth
            required
            margin="normal"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Title />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "primary.light",
                },
              },
            }}
          />

          <TextField
            label="Nội dung đầy đủ"
            value={fullTranscript}
            onChange={handleFullTranscriptChange}
            fullWidth
            multiline
            rows={4}
            margin="normal"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Description />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "primary.light",
                },
              },
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AudioFile sx={{ mr: 1, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              Audio: {trackData?.fullAudioDuration || "Không có thông tin"}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Paper sx={{ mb: 4 }}>
        <Box sx={{ padding: "20px" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="track edit tabs"
            variant="fullWidth"
          >
            <Tab
              sx={{
                "&:focus": {
                  outline: "none",
                },
              }}
              icon={<TextFields />}
              label="Chỉnh sửa nội dung"
              {...a11yProps(0)}
            />
            <Tab
              sx={{
                "&:focus": {
                  outline: "none",
                },
              }}
              icon={<AudioFile />}
              label="Xử lý audio"
              {...a11yProps(1)}
            />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Danh sách Segments
              </Typography>

              <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
                <TextField
                  label="Nội dung segment mới"
                  value={newSegmentText}
                  onChange={(e) => setNewSegmentText(e.target.value)}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddSegment}
                  disabled={!newSegmentText.trim()}
                >
                  Thêm
                </Button>
              </Box>

              <TableContainer
                component={Paper}
                elevation={3}
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Table>
                  <TableHead sx={{ bgcolor: alpha("#1976d2", 0.1) }}>
                    <TableRow>
                      <TableCell width="10%">STT</TableCell>
                      <TableCell>Nội dung câu</TableCell>
                      <TableCell width="15%" align="center">
                        Thao tác
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {segments.map((segment) => (
                      <TableRow
                        key={segment.id}
                        sx={{
                          "&:nth-of-type(odd)": {
                            backgroundColor: "action.hover",
                          },
                        }}
                      >
                        <TableCell>{segment.order}</TableCell>
                        <TableCell>
                          <TextField
                            value={segment.transcript}
                            onChange={(e) =>
                              handleSegmentTextChange(
                                segment.id,
                                e.target.value
                              )
                            }
                            fullWidth
                            multiline
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="error"
                            onClick={(e) => handleDeleteClick(segment.id, e)}
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Paper
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 2,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ mb: 2, display: "flex", alignItems: "center" }}
              >
                <AudioFile sx={{ mr: 1 }} /> Xử lý audio cho từng segment
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Stack direction="row" spacing={2} mb={2}>
                <Button
                  variant="contained"
                  startIcon={isPlaying ? <Stop /> : <PlayArrow />}
                  onClick={togglePlayback}
                  disabled={!audioUrl}
                  sx={{
                    "&:focus": {
                      outline: "none",
                    },
                    borderRadius: 2,
                  }}
                >
                  {isPlaying ? "Dừng" : "Phát"}
                </Button>

                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<ContentCut />}
                  onClick={assignRegionToSegment}
                  disabled={!audioUrl || !selectedRegion || !selectedSegmentId}
                  sx={{
                    "&:focus": {
                      outline: "none",
                    },
                    borderRadius: 2,
                  }}
                >
                  Gán thời gian
                </Button>
              </Stack>

              <Box sx={{ backgroundColor: "#f5f5f5", borderRadius: 2, p: 2 }}>
                <div ref={waveformRef} />
                {selectedRegion && (
                  <Box display="flex" justifyContent="space-between" mt={1}>
                    <Typography>
                      Bắt đầu: {formatTime(selectedRegion.start)}
                    </Typography>
                    <Typography>
                      Kết thúc: {formatTime(selectedRegion.end)}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>

            <TableContainer
              component={Paper}
              elevation={3}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                mb: 4,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <Table>
                <TableHead sx={{ bgcolor: alpha("#1976d2", 0.1) }}>
                  <TableRow>
                    <TableCell>STT</TableCell>
                    <TableCell>Nội dung câu</TableCell>
                    <TableCell>Thời gian bắt đầu</TableCell>
                    <TableCell>Thời gian kết thúc</TableCell>
                    <TableCell align="center">Phát</TableCell>
                    <TableCell align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {segments.map((segment) => (
                    <TableRow
                      key={segment.id}
                      hover
                      selected={selectedSegmentId === segment.id}
                      onClick={() => setSelectedSegmentId(segment.id)}
                      sx={{
                        cursor: "pointer",
                        "&:nth-of-type(odd)": {
                          bgcolor: alpha("#f5f5f5", 0.5),
                        },
                      }}
                    >
                      <TableCell>{segment.order}</TableCell>
                      <TableCell>{segment.transcript}</TableCell>
                      <TableCell>
                        {segment.startSec !== undefined &&
                        segment.startSec !== null ? (
                          <Chip
                            label={formatTime(segment.startSec)}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {segment.endSec !== undefined &&
                        segment.endSec !== null ? (
                          <Chip
                            label={formatTime(segment.endSec)}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {segment.startSec !== undefined &&
                        segment.startSec !== null &&
                        segment.endSec !== undefined &&
                        segment.endSec !== null ? (
                          <IconButton
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              playSegmentAudio(segment.id);
                            }}
                          >
                            {playingSegmentId === segment.id ? (
                              <PauseCircleOutline />
                            ) : (
                              <PlayCircleOutline />
                            )}
                          </IconButton>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {segment.startSec !== undefined &&
                        segment.startSec !== null &&
                        segment.endSec !== undefined &&
                        segment.endSec !== null ? (
                          <Tooltip title="Xóa thông tin thời gian">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={(e) => handleClearClick(segment.id, e)}
                              sx={{
                                "&:hover": {
                                  backgroundColor: "rgba(211, 47, 47, 0.04)",
                                },
                              }}
                            >
                              <Clear />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </Box>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <LoadingButton
          loading={apiLoading}
          variant="contained"
          color="success"
          startIcon={<Save />}
          onClick={handleSaveChanges}
          disabled={!trackName || !!trackNameError}
          sx={{
            minWidth: 150,
            borderRadius: 2,
            py: 1.2,
            "&:focus": {
              outline: "none",
            },
          }}
        >
          {apiLoading ? "Đang xử lý..." : "Lưu thay đổi"}
        </LoadingButton>
      </Box>

      {/* Clear Confirmation Dialog */}
      <Dialog
        open={clearDialogOpen}
        onClose={handleClearCancel}
        aria-labelledby="clear-dialog-title"
        aria-describedby="clear-dialog-description"
      >
        <DialogTitle id="clear-dialog-title">
          Xác nhận xóa thông tin
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="clear-dialog-description">
            Bạn có chắc chắn muốn xóa thông tin thời gian đã gán cho segment này
            không? Sau khi xóa, bạn có thể gán thông tin mới cho segment này.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClearCancel} color="primary">
            Hủy
          </Button>
          <Button
            onClick={handleClearConfirm}
            color="error"
            variant="contained"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Xác nhận xóa segment</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Bạn có chắc chắn muốn xóa segment này không? Hành động này không thể
            hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Hủy
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading || apiLoading}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CircularProgress color="inherit" />
          <Typography>
            {loading ? "Đang tải dữ liệu..." : "Đang cập nhật track..."}
          </Typography>
        </Box>
      </Backdrop>
    </Container>
  );
}

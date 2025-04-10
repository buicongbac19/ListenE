"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  IconButton,
  Breadcrumbs,
  Link,
  Skeleton,
  Divider,
  Paper,
  Slider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from "@mui/material";
import {
  ArrowBack,
  Home,
  PlayArrow,
  Pause,
  Replay,
  VolumeUp,
  VolumeMute,
  Mic,
  Send,
  EmojiEvents,
  NavigateNext,
  NavigateBefore,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { ITrackItem } from "../types/track";
import { ISegmentItem } from "../types/segment";

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
];

const mockSegments: ISegmentItem[] = [
  {
    id: 1,
    trackId: 1,
    name: "Segment 1: Basic Introduction",
    duration: "0:15",
    audioUrl:
      "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3",
    transcript: "Hi, my name is Sarah.",
    completed: true,
  },
  {
    id: 2,
    trackId: 1,
    name: "Segment 2: Where You're From",
    duration: "0:12",
    audioUrl:
      "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3",
    transcript: "I'm from Canada.",
    completed: false,
  },
  {
    id: 3,
    trackId: 1,
    name: "Segment 3: Greeting",
    duration: "0:18",
    audioUrl:
      "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3",
    transcript: "It's nice to meet you. What's your name?",
    completed: false,
  },
  {
    id: 4,
    trackId: 2,
    name: "Segment 1: Initial Greeting",
    duration: "0:20",
    audioUrl:
      "https://assets.mixkit.co/music/preview/mixkit-hip-hop-02-614.mp3",
    transcript: "Hello there! I don't think we've met before.",
    completed: false,
  },
  {
    id: 5,
    trackId: 2,
    name: "Segment 2: Self Introduction",
    duration: "0:15",
    audioUrl:
      "https://assets.mixkit.co/music/preview/mixkit-hip-hop-02-614.mp3",
    transcript: "I'm John.",
    completed: false,
  },
  {
    id: 6,
    trackId: 2,
    name: "Segment 3: Asking Name",
    duration: "0:10",
    audioUrl:
      "https://assets.mixkit.co/music/preview/mixkit-hip-hop-02-614.mp3",
    transcript: "What's your name?",
    completed: false,
  },
];

const SegmentPracticePage = () => {
  const { trackId, segmentId } = useParams();
  const navigate = useNavigate();
  const [track, setTrack] = useState<ITrackItem | null>(null);
  const [segment, setSegment] = useState<ISegmentItem | null>(null);
  const [segments, setSegments] = useState<ISegmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [showTranscript, setShowTranscript] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const foundTrack =
        mockTracks.find((t) => t.id === Number(trackId)) || null;
      const trackSegments = mockSegments.filter(
        (s) => s.trackId === Number(trackId)
      );
      const foundSegment =
        trackSegments.find((s) => s.id === Number(segmentId)) || null;

      setTrack(foundTrack);
      setSegments(trackSegments);
      setSegment(foundSegment);
      setLoading(false);
    };

    fetchData();
  }, [trackId, segmentId]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;

      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Audio playback failed:", error);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, volume]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (_event: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
    if (isMuted && (newValue as number) > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? volume / 100 : 0;
    }
  };

  const handleReplay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        console.error("Audio replay failed:", error);
      });
      setIsPlaying(true);
    }
  };

  const handleSubmit = () => {
    if (!userInput.trim()) return;

    // Simple scoring algorithm (in a real app, this would be more sophisticated)
    if (segment) {
      const transcript = segment.transcript.toLowerCase();
      const input = userInput.toLowerCase();

      // Calculate similarity (very basic)
      const words1 = transcript.split(/\s+/);
      const words2 = input.split(/\s+/);

      let matchCount = 0;
      for (const word of words2) {
        if (words1.includes(word)) {
          matchCount++;
        }
      }

      const calculatedScore = Math.round((matchCount / words1.length) * 100);
      setScore(calculatedScore);
      setSubmitted(true);

      if (calculatedScore >= 80) {
        setShowSuccessDialog(true);
      }
    }
  };

  const handleTryAgain = () => {
    setUserInput("");
    setSubmitted(false);
    setScore(null);
    setShowTranscript(false);

    // Focus on input
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleNextSegment = () => {
    if (segments.length > 0 && segment) {
      const currentIndex = segments.findIndex((s) => s.id === segment.id);
      if (currentIndex < segments.length - 1) {
        navigate(`/track/${trackId}/segment/${segments[currentIndex + 1].id}`);
      }
    }
  };

  const handlePrevSegment = () => {
    if (segments.length > 0 && segment) {
      const currentIndex = segments.findIndex((s) => s.id === segment.id);
      if (currentIndex > 0) {
        navigate(`/track/${trackId}/segment/${segments[currentIndex - 1].id}`);
      }
    }
  };

  const canGoNext = () => {
    if (segments.length > 0 && segment) {
      const currentIndex = segments.findIndex((s) => s.id === segment.id);
      return currentIndex < segments.length - 1;
    }
    return false;
  };

  const canGoPrev = () => {
    if (segments.length > 0 && segment) {
      const currentIndex = segments.findIndex((s) => s.id === segment.id);
      return currentIndex > 0;
    }
    return false;
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ pb: 6, pt: 10 }}>
        <Skeleton variant="text" height={30} width={200} />
        <Skeleton variant="text" height={40} sx={{ mt: 2 }} />

        <Box sx={{ mt: 4 }}>
          <Skeleton
            variant="rectangular"
            height={200}
            sx={{ borderRadius: 2 }}
          />
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Skeleton
              variant="circular"
              width={48}
              height={48}
              sx={{ mx: 1 }}
            />
            <Skeleton
              variant="circular"
              width={48}
              height={48}
              sx={{ mx: 1 }}
            />
            <Skeleton
              variant="circular"
              width={48}
              height={48}
              sx={{ mx: 1 }}
            />
          </Box>

          <Skeleton
            variant="rectangular"
            height={100}
            sx={{ mt: 4, borderRadius: 2 }}
          />
          <Skeleton
            variant="rectangular"
            height={56}
            sx={{ mt: 2, borderRadius: 2 }}
          />
        </Box>
      </Container>
    );
  }

  if (!track || !segment) {
    return (
      <Container maxWidth="md" sx={{ pb: 6, pt: 10 }}>
        <Typography variant="h4">Segment not found</Typography>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(`/track/${trackId}/segments`)}
          sx={{ mt: 2 }}
        >
          Back to Segments
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ pb: 6, pt: 10 }}>
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
            onClick={() => navigate(`/session/${track.sessionId}`)}
            style={{ cursor: "pointer" }}
          >
            Back to Session
          </Link>
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate(`/track/${trackId}/segments`)}
            style={{ cursor: "pointer" }}
          >
            {track.name} Segments
          </Link>
          <Typography color="text.primary">{segment.name}</Typography>
        </Breadcrumbs>

        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(`/track/${trackId}/segments`)}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              {segment.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
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
                sx={{ fontWeight: 500, mr: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                Duration: {segment.duration}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Card sx={{ mb: 4, borderRadius: 3 }}>
          <CardContent>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Listen to the audio
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Play the audio and listen carefully to the pronunciation
              </Typography>
            </Box>

            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: "primary.main",
                color: "white",
                mb: 3,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <IconButton
                  onClick={handleReplay}
                  sx={{
                    width: "56px",
                    color: "white",
                    bgcolor: "rgba(255,255,255,0.2)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                    mx: 1,
                  }}
                >
                  <Replay />
                </IconButton>
                <IconButton
                  onClick={togglePlayPause}
                  sx={{
                    color: "white",
                    bgcolor: "rgba(255,255,255,0.2)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                    mx: 1,
                    width: 56,
                    height: 56,
                  }}
                >
                  {isPlaying ? (
                    <Pause fontSize="large" />
                  ) : (
                    <PlayArrow fontSize="large" />
                  )}
                </IconButton>
                <IconButton
                  onClick={toggleMute}
                  sx={{
                    width: "56px",
                    color: "white",
                    bgcolor: "rgba(255,255,255,0.2)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                    mx: 1,
                  }}
                >
                  {isMuted ? <VolumeMute /> : <VolumeUp />}
                </IconButton>
              </Box>

              <Box sx={{ px: 2 }}>
                <Slider
                  value={volume}
                  onChange={handleVolumeChange}
                  aria-labelledby="volume-slider"
                  sx={{
                    color: "white",
                    "& .MuiSlider-thumb": {
                      width: 16,
                      height: 16,
                      "&:hover, &.Mui-focusVisible": {
                        boxShadow: "0px 0px 0px 8px rgba(255, 255, 255, 0.16)",
                      },
                    },
                    "& .MuiSlider-rail": {
                      opacity: 0.3,
                    },
                  }}
                />
              </Box>

              {/* Hidden audio element */}
              <audio
                ref={audioRef}
                src={segment.audioUrl}
                onEnded={() => setIsPlaying(false)}
              />
            </Paper>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Type what you hear
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Type the sentence you heard..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                disabled={submitted}
                inputRef={inputRef}
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  variant="outlined"
                  onClick={() => setShowTranscript(!showTranscript)}
                  disabled={submitted}
                >
                  {showTranscript ? "Hide Transcript" : "Show Transcript"}
                </Button>

                {!submitted ? (
                  <Button
                    variant="contained"
                    endIcon={<Send />}
                    onClick={handleSubmit}
                    disabled={!userInput.trim()}
                  >
                    Submit
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleTryAgain}
                  >
                    Try Again
                  </Button>
                )}
              </Box>
            </Box>

            <AnimatePresence>
              {showTranscript && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Paper
                    sx={{ p: 2, bgcolor: "rgba(0,0,0,0.03)", borderRadius: 2 }}
                  >
                    <Typography variant="body2" fontWeight={500}>
                      Transcript:
                    </Typography>
                    <Typography variant="body1">
                      {segment.transcript}
                    </Typography>
                  </Paper>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {submitted && score !== null && (
                <motion.div
                  variants={fadeIn}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                >
                  <Divider sx={{ my: 3 }} />
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h6" gutterBottom>
                      Your Score
                    </Typography>

                    <Box
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        border: "8px solid",
                        borderColor:
                          score >= 80
                            ? "success.main"
                            : score >= 50
                            ? "warning.main"
                            : "error.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h4" fontWeight="bold">
                        {score}%
                      </Typography>
                    </Box>

                    <Typography
                      variant="body1"
                      color={
                        score >= 80
                          ? "success.main"
                          : score >= 50
                          ? "warning.main"
                          : "error.main"
                      }
                      fontWeight={500}
                      gutterBottom
                    >
                      {score >= 80
                        ? "Excellent!"
                        : score >= 50
                        ? "Good effort!"
                        : "Keep practicing!"}
                    </Typography>

                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        justifyContent: "center",
                        gap: 2,
                      }}
                    >
                      <Button variant="outlined" onClick={handleTryAgain}>
                        Try Again
                      </Button>
                      {canGoNext() ? (
                        <Button
                          variant="contained"
                          onClick={handleNextSegment}
                          endIcon={<NavigateNext />}
                        >
                          Next Segment
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          onClick={() => navigate(`/track/${trackId}/segments`)}
                        >
                          Back to Segments
                        </Button>
                      )}
                    </Box>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Tooltip
            title={
              canGoPrev()
                ? "Go to previous segment"
                : "This is the first segment"
            }
          >
            <span>
              <Button
                variant="outlined"
                startIcon={<NavigateBefore />}
                onClick={handlePrevSegment}
                disabled={!canGoPrev()}
              >
                Previous
              </Button>
            </span>
          </Tooltip>

          <Button variant="outlined" startIcon={<Mic />}>
            Practice Speaking
          </Button>

          <Tooltip
            title={
              canGoNext() ? "Go to next segment" : "This is the last segment"
            }
          >
            <span>
              <Button
                variant="outlined"
                endIcon={<NavigateNext />}
                onClick={handleNextSegment}
                disabled={!canGoNext()}
              >
                Next
              </Button>
            </span>
          </Tooltip>
        </Box>
      </motion.div>

      {/* Success Dialog */}
      <Dialog
        open={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
          <EmojiEvents sx={{ fontSize: 60, color: "gold", mb: 1 }} />
          <Typography variant="h5" fontWeight="bold">
            Congratulations!
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", py: 2 }}>
          <Typography variant="body1" paragraph>
            You've successfully completed this segment with a great score!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Keep up the good work and continue practicing to improve your
            English speaking skills.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          {canGoNext() ? (
            <Button
              variant="contained"
              onClick={() => {
                setShowSuccessDialog(false);
                handleNextSegment();
              }}
              endIcon={<NavigateNext />}
            >
              Next Segment
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => {
                setShowSuccessDialog(false);
                navigate(`/track/${trackId}/segments`);
              }}
            >
              Complete
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SegmentPracticePage;

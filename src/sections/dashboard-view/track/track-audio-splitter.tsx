"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
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
} from "@mui/material";
import {
  CloudUpload,
  ContentCut,
  PlayArrow,
  Stop,
  PlayCircleOutline,
  PauseCircleOutline,
} from "@mui/icons-material";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";

type SentenceItem = {
  id: number;
  content: string;
  startTime?: number;
  endTime?: number;
};

interface RegionOptions {
  start: number;
  end: number;
  color?: string;
  drag?: boolean;
  resize?: boolean;
}

export default function TrackAudioSplitter({
  sentences = [],
  setSentences,
}: {
  sentences: SentenceItem[];
  setSentences: React.Dispatch<React.SetStateAction<SentenceItem[]>>;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const [selectedSentenceId, setSelectedSentenceId] = useState<number | null>(
    null
  );
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [regionsPlugin, setRegionsPlugin] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastAssignedSentenceId, setLastAssignedSentenceId] = useState<
    number | null
  >(null);
  const [playingSentenceId, setPlayingSentenceId] = useState<number | null>(
    null
  );
  const [apiLoading, setApiLoading] = useState(false);

  const waveformRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  useEffect(() => {
    if (waveformRef.current && !wavesurfer) {
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

        ws.on("ready", () => {
          setupInitialRegion(ws, regions);
        });

        ws.on("finish", () => setIsPlaying(false));

        regions.on("region-updated", (region: any) => {
          setSelectedRegion({ start: region.start, end: region.end });
        });

        setWavesurfer(ws);
        setRegionsPlugin(regions);

        return () => ws.destroy();
      } catch (err) {
        console.error("Error initializing WaveSurfer:", err);
        setError("Không thể khởi tạo trình phát âm thanh. Vui lòng thử lại.");
      }
    }
  }, [waveformRef]);

  const setupInitialRegion = (ws: WaveSurfer, regions: any) => {
    try {
      const duration = ws.getDuration();
      if (duration > 0) {
        regions.clearRegions();

        const regionLength = Math.min(3, duration * 0.1);
        const regionOptions: RegionOptions = {
          start: 0,
          end: regionLength,
          color: "rgba(74, 131, 255, 0.2)",
          drag: true,
          resize: true,
        };
        const region = regions.addRegion(regionOptions);

        if (region) setSelectedRegion({ start: region.start, end: region.end });
      }
    } catch (err) {
      console.error("Error setting up initial region:", err);
      setError("Không thể thiết lập vùng phát âm thanh. Vui lòng thử lại.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const url = URL.createObjectURL(file);
      setAudioFile(file);
      setAudioUrl(url);

      if (wavesurfer) {
        wavesurfer.load(url);
      } else {
        throw new Error("WaveSurfer is not initialized");
      }

      setLoading(false);
    } catch (err) {
      console.error("Error loading file:", err);
      setError("Không thể tải file âm thanh. Vui lòng thử lại.");
      setLoading(false);
    }
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

  const assignRegionToSentence = () => {
    if (!selectedRegion || !selectedSentenceId) {
      setError("Vui lòng chọn vùng và câu trước khi gán.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { start, end } = selectedRegion;

      setSentences((prev) =>
        prev.map((s) => {
          if (s.id === selectedSentenceId) {
            return {
              ...s,
              startTime: start,
              endTime: end,
            };
          }
          return s;
        })
      );

      if (regionsPlugin) {
        regionsPlugin.clearRegions();
        const region = regionsPlugin.addRegion({
          start: end,
          end: Math.min(end + (end - start), wavesurfer?.getDuration() || 0),
          color: "rgba(74, 131, 255, 0.2)",
          drag: true,
          resize: true,
        });

        if (region) setSelectedRegion({ start: region.start, end: region.end });
      }

      setLastAssignedSentenceId(selectedSentenceId);
      setLoading(false);
    } catch (err) {
      console.error("Assignment error:", err);
      setError("Không thể gán thời gian cho câu. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  const playSentenceAudio = (sentenceId: number) => {
    if (!audioUrl) return;

    const sentence = sentences.find((s) => s.id === sentenceId);
    if (
      !sentence ||
      sentence.startTime === undefined ||
      sentence.endTime === undefined
    ) {
      setError("Câu này chưa được gán thời gian.");
      return;
    }

    // If we're already playing this sentence, pause it
    if (playingSentenceId === sentenceId) {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
      setPlayingSentenceId(null);
      return;
    }

    // Create or get audio element
    if (!audioElementRef.current) {
      audioElementRef.current = new Audio(audioUrl);
    } else {
      audioElementRef.current.src = audioUrl;
    }

    // Set up event listeners
    audioElementRef.current.onended = () => {
      setPlayingSentenceId(null);
    };

    // Set the current time to the start time of the sentence
    audioElementRef.current.currentTime = sentence.startTime;

    // Play the audio
    audioElementRef.current.play();

    // Set the playing sentence ID
    setPlayingSentenceId(sentenceId);

    // Set a timeout to pause the audio when it reaches the end time
    const duration = sentence.endTime - sentence.startTime;
    setTimeout(() => {
      if (audioElementRef.current && playingSentenceId === sentenceId) {
        audioElementRef.current.pause();
        setPlayingSentenceId(null);
      }
    }, duration * 1000 + 50);
  };

  const formatTime = (time: number): string => {
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

  const handleCreateNew = async () => {
    // Check if all sentences have been assigned times
    const unassignedSentences = sentences.filter(
      (s) => s.startTime === undefined || s.endTime === undefined
    );

    if (unassignedSentences.length > 0) {
      setError(
        `Còn ${unassignedSentences.length} câu chưa được gán thời gian.`
      );
      return;
    }

    setApiLoading(true);
    setError(null);

    try {
      // Here you would call your API with the sentences data
      // Example:
      // const response = await axios.post('/api/your-endpoint', { sentences });

      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Handle success
      console.log("API call would be made with data:", sentences);

      // You can add success message or redirect here
    } catch (err) {
      console.error("API error:", err);
      setError("Không thể tạo mới. Vui lòng thử lại sau.");
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Xử lý audio cho từng câu
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" spacing={2} mb={2}>
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={() => fileInputRef.current?.click()}
            sx={{
              "&:focus": {
                outline: "none",
              },
            }}
          >
            Tải lên audio
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            accept="audio/*"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />

          <Button
            variant="contained"
            startIcon={isPlaying ? <Stop /> : <PlayArrow />}
            onClick={togglePlayback}
            disabled={!audioFile}
            sx={{
              "&:focus": {
                outline: "none",
              },
            }}
          >
            {isPlaying ? "Dừng" : "Phát"}
          </Button>

          <Button
            variant="contained"
            color="secondary"
            startIcon={<ContentCut />}
            onClick={assignRegionToSentence}
            disabled={
              !audioFile ||
              !selectedRegion ||
              !selectedSentenceId ||
              selectedSentenceId === lastAssignedSentenceId
            }
            sx={{
              "&:focus": {
                outline: "none",
              },
            }}
          >
            Gán thời gian
          </Button>
        </Stack>

        <Box sx={{ backgroundColor: "#f5f5f5", borderRadius: 1, p: 2 }}>
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

      {sentences.length > 0 && (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Nội dung câu</TableCell>
                <TableCell>Thời gian bắt đầu</TableCell>
                <TableCell>Thời gian kết thúc</TableCell>
                <TableCell>Phát</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sentences.map((sentence) => (
                <TableRow
                  key={sentence.id}
                  hover
                  selected={selectedSentenceId === sentence.id}
                  onClick={() => setSelectedSentenceId(sentence.id)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{sentence.id}</TableCell>
                  <TableCell>{sentence.content}</TableCell>
                  <TableCell>
                    {sentence.startTime !== undefined
                      ? formatTime(sentence.startTime)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {sentence.endTime !== undefined
                      ? formatTime(sentence.endTime)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {sentence.startTime !== undefined &&
                    sentence.endTime !== undefined ? (
                      <IconButton
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          playSentenceAudio(sentence.id);
                        }}
                      >
                        {playingSentenceId === sentence.id ? (
                          <PauseCircleOutline />
                        ) : (
                          <PlayCircleOutline />
                        )}
                      </IconButton>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {sentences.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleCreateNew}
            disabled={apiLoading}
            sx={{
              minWidth: 120,
              "&:focus": {
                outline: "none",
              },
            }}
          >
            {apiLoading ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                Đang xử lý...
              </Box>
            ) : (
              "Tạo mới"
            )}
          </Button>
        </Box>
      )}

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
            {loading ? "Đang xử lý audio..." : "Đang tạo mới..."}
          </Typography>
        </Box>
      </Backdrop>
    </Box>
  );
}

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
} from "@mui/material";
import { CloudUpload, ContentCut, PlayArrow, Stop } from "@mui/icons-material";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";

type SentenceItem = {
  id: number;
  content: string;
  startTime?: number;
  endTime?: number;
  audioUrl?: string;
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
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
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

  const waveformRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      sentences.forEach((sentence) => {
        if (sentence.audioUrl) URL.revokeObjectURL(sentence.audioUrl);
      });
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [sentences, audioUrl]);

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

      if (audioContextRef.current) {
        await audioContextRef.current.close();
      }

      // Create new AudioContext
      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) {
        throw new Error("AudioContext is not supported in this browser");
      }

      audioContextRef.current = new AudioContext();

      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(
        arrayBuffer
      );
      setAudioBuffer(audioBuffer);

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

  const cutSelectedRegion = async () => {
    if (!audioBuffer || !selectedRegion || !selectedSentenceId) {
      setError("Vui lòng chọn vùng và câu trước khi cắt.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { start, end } = selectedRegion;

      const extractedBuffer = extractAudioRegion(audioBuffer, start, end);
      const extractedBlob = await audioBufferToBlob(extractedBuffer);
      const extractedUrl = URL.createObjectURL(extractedBlob);

      setSentences((prev) =>
        prev.map((s) => {
          if (s.id === selectedSentenceId) {
            if (s.audioUrl) URL.revokeObjectURL(s.audioUrl);
            return {
              ...s,
              startTime: start,
              endTime: end,
              audioUrl: extractedUrl,
            };
          }
          return s;
        })
      );

      if (regionsPlugin) {
        regionsPlugin.clearRegions();
        const region = regionsPlugin.addRegion({
          start: end,
          end: Math.min(end + (end - start), audioBuffer.duration),
          color: "rgba(74, 131, 255, 0.2)",
          drag: true,
          resize: true,
        });

        if (region) setSelectedRegion({ start: region.start, end: region.end });
      }

      setLastAssignedSentenceId(selectedSentenceId);

      setLoading(false);
    } catch (err) {
      console.error("Cut error:", err);
      setError("Không thể cắt âm thanh. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  const extractAudioRegion = (
    buffer: AudioBuffer,
    start: number,
    end: number
  ): AudioBuffer => {
    const ctx = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const duration = end - start;
    const sampleRate = buffer.sampleRate;
    const numberOfChannels = buffer.numberOfChannels;
    const extractedBuffer = ctx.createBuffer(
      numberOfChannels,
      Math.ceil(duration * sampleRate),
      sampleRate
    );

    for (let channel = 0; channel < numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      const extractedData = extractedBuffer.getChannelData(channel);

      const startOffset = Math.floor(start * sampleRate);

      for (let i = 0; i < extractedData.length; i++) {
        extractedData[i] = channelData[startOffset + i];
      }
    }

    return extractedBuffer;
  };

  const audioBufferToBlob = async (buffer: AudioBuffer): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const ctx = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const offlineCtx = new OfflineAudioContext(
        buffer.numberOfChannels,
        buffer.length,
        buffer.sampleRate
      );

      const source = offlineCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(offlineCtx.destination);
      source.start();

      offlineCtx
        .startRendering()
        .then((renderedBuffer) => {
          const dest = ctx.createMediaStreamDestination();
          const mediaRecorder = new MediaRecorder(dest.stream);
          const chunks: BlobPart[] = [];

          mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
          };

          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: "audio/webm" });
            resolve(blob);
          };

          const source = ctx.createBufferSource();
          source.buffer = renderedBuffer;
          source.connect(dest);

          mediaRecorder.start();
          source.start();

          setTimeout(() => {
            mediaRecorder.stop();
            source.stop();
          }, renderedBuffer.duration * 1000 + 100);
        })
        .catch(reject);
    });
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
            onClick={cutSelectedRegion}
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
            Cắt
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
                <TableCell>Audio Preview</TableCell>
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
                    {sentence.audioUrl ? (
                      <audio
                        src={sentence.audioUrl}
                        controls
                        style={{ width: "100%" }}
                      />
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

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
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
          <Typography>Đang xử lý audio...</Typography>
        </Box>
      </Backdrop>
    </Box>
  );
}

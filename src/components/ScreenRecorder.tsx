"use client";
import {
  Box,
  Button,
  TextField,
  Grid2 as Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Peer, { MediaConnection } from "peerjs";
import React, { useEffect, useState, useRef } from "react";

// Utility functions
const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const mimeType = "video/webm; codecs=vp8,opus";
const options = { mimeType };

const App: React.FC = () => {
  const [peerId, setPeerId] = useState<string | null>(null);

  const [maxTime, setMaxTime] = useState<number>(0); // Initial max time is "No Limit"
  const recordingSizeRef = useRef<number>(0);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [call, setCall] = useState<MediaConnection | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("screen-recording"); // Default file name
  const partNumberRef = useRef<number>(1); // Track part number

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const myVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const peerInstance = useRef<Peer | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);
  const audioCtx = useRef<AudioContext | null>(null);

  useEffect(() => {
    const peer = new Peer();
    audioCtx.current = new (window.AudioContext ||
      (window as any).webkitAudioContext)();

    peer.on("open", (id: string) => {
      setPeerId(id);
    });

    peer.on("call", (incomingCall: MediaConnection) => {
      navigator.mediaDevices
        .getDisplayMedia({ video: true, audio: true })
        .then((stream: MediaStream) => {
          incomingCall.answer(stream);
          incomingCall.on("stream", (remoteStream: MediaStream) => {
            if (remoteVideo.current) {
              remoteVideo.current.srcObject = remoteStream;
            }
          });
        });
    });

    peerInstance.current = peer;

    return () => {
      peer.destroy();
    };
  }, []);

  const startTimer = () => {
    setTimer(0); // Reset the timer
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev >= maxTime && maxTime !== 0) {
          // Stop and start new part when maxTime is reached
          stopRecordingAndStartNewPart();
          return 0; // Reset timer for new part
        }
        return prev + 1;
      });
    }, 1000); // Increment every second
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const startCall = async () => {
    try {
      // Reset the part number when starting a new session
      partNumberRef.current = 1;
      recordingSizeRef.current = 0;

      // Get display media with system audio
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      // Get user media for microphone audio
      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      if (!audioCtx.current) {
        audioCtx.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }
      const audioContext = audioCtx.current;
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      const dest = audioContext.createMediaStreamDestination();

      // Create MediaStreamSources from mic and screen audio tracks
      const micSource = audioContext.createMediaStreamSource(micStream);
      const screenSource = audioContext.createMediaStreamSource(screenStream);

      // Connect the sources to the destination
      micSource.connect(dest);
      screenSource.connect(dest);

      // Create a new stream with video tracks from screen and audio track from destination
      const combinedStream = new MediaStream();

      // Add the screen video tracks
      screenStream.getVideoTracks().forEach((track) => {
        combinedStream.addTrack(track);
      });

      // Add the combined audio track
      dest.stream.getAudioTracks().forEach((track) => {
        combinedStream.addTrack(track);
      });

      if (myVideo.current) {
        myVideo.current.srcObject = combinedStream;
      }

      startRecording(combinedStream); // Start recording with the combined stream
      startTimer(); // Start the timer
      setIsSharing(true);

      // Stop sharing automatically when the user stops sharing the screen
      // Stop sharing automatically when the user stops sharing the screen
      screenStream.getVideoTracks()[0].onended = () => {
        if (
          mediaRecorderRef.current &&
          mediaRecorderRef.current.state !== "inactive"
        ) {
          mediaRecorderRef.current.stop();
        }
        endCall();
      };
    } catch (err) {
      console.error("Error starting call", err);
    }
  };

  const startRecording = (stream: MediaStream) => {
    recordedChunks.current = [];

    if (MediaRecorder.isTypeSupported(options.mimeType)) {
      console.log("Codec supported");
    } else {
      console.log("Codec not supported");
    }

    const mediaRecorder = new MediaRecorder(stream, options);

    const dataRequestInterval = setInterval(() => {
      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.requestData(); // Request data every 5 seconds
      } else {
        clearInterval(dataRequestInterval); // Clear interval if not recording
      }
    }, 5 * 1000); // 5 seconds update

    mediaRecorder.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        recordedChunks.current.push(event.data);
        recordingSizeRef.current += event.data.size;
      }
    };

    mediaRecorder.onstop = async () => {
      if (recordedChunks.current.length > 0) {
        await saveRecording(); // Save the recording when it stops
        // Increment the part number **after** saving
        if (maxTime > 0) {
          partNumberRef.current += 1;
        }
        clearInterval(dataRequestInterval);
      }
    };

    mediaRecorder.start(250);
    mediaRecorderRef.current = mediaRecorder;
  };

  const stopRecordingAndStartNewPart = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop(); // Stop current recording

      // Once stopped, start a new recording
      if (myVideo.current && myVideo.current.srcObject) {
        const stream = myVideo.current.srcObject as MediaStream;
        startRecording(stream); // Start new recording
      }
    }
  };

  const saveRecording = async () => {
    const blob = new Blob(recordedChunks.current, { type: options.mimeType });

    // Prepare form data
    const formData = new FormData();
    formData.append("videoBlob", blob, `${fileName}.webm`);

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to convert video");
      }

      const arrayBuffer = await response.arrayBuffer();
      const mp4Blob = new Blob([arrayBuffer], { type: "video/mp4" });
      const mp4Url = URL.createObjectURL(mp4Blob);

      // Trigger download
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = mp4Url;
      link.download = `${fileName}.mp4`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(mp4Url);
    } catch (error) {
      console.error("Error converting video:", error);
    }

    // Clear the current recording chunks
    recordedChunks.current = [];
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop(); // Stop final part recording
    }
  };

  const endCall = () => {
    if (call) {
      call.close();
    }
    stopRecording(); // Save the last part
    stopTimer();
    setIsSharing(false);
  };
  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      <h1>Your Peer ID: {peerId}</h1>
      <Grid container alignItems="center" spacing={2}>
        <Grid>
          <TextField
            fullWidth
            label="File Name"
            variant="outlined"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            size="small"
          />
        </Grid>
        <Grid width={150}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Recording Time Limit
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={maxTime}
              label="Recording Time Limit"
              size="small"
              onChange={(e) => setMaxTime(Number(e.target.value))}
            >
              <MenuItem value={1800}>30 Minutes</MenuItem>
              <MenuItem value={1200}>20 Minutes</MenuItem>
              <MenuItem value={600}>10 Minutes</MenuItem>
              <MenuItem value={0}>No Limit</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid>
          <Button variant="contained" onClick={startCall} disabled={isSharing}>
            Start Recording
          </Button>
        </Grid>
      </Grid>

      <video ref={myVideo} autoPlay muted style={{ width: "700px" }}></video>
      <video ref={remoteVideo} autoPlay style={{ width: "700px" }}></video>
      <Box mt={2}>
        <Typography variant="h6">
          Recording Timer:{" "}
          {maxTime > 0 ? `${Math.floor(maxTime / 60)} Minutes` : "No Limit"}
        </Typography>
        <Typography variant="body1">
          Current Time: {Math.floor(timer / 60)}:{`0${timer % 60}`.slice(-2)}
        </Typography>
        <Typography variant="body1">
          Recording Size: {formatBytes(recordingSizeRef.current)}
        </Typography>
      </Box>
    </Box>
  );
};

export default App;

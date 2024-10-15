/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const path = require("path");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

ffmpeg.setFfmpegPath(ffmpegPath);

// Serve static files
app.use(express.static(path.join(__dirname, "../out")));

app.post("/api/convert", upload.single("videoBlob"), (req, res) => {
  const inputPath = req.file.path;
  const newInputPath = `${inputPath}.webm`;
  const outputPath = `${inputPath}.mp4`;

  // Rename the uploaded file to include the .webm extension
  fs.renameSync(inputPath, newInputPath);

  // Check if the file exists and log its size
  fs.stat(newInputPath, (err, stats) => {
    if (err) {
      console.error("File stat error:", err);
      res.status(500).send("File not found");
      return;
    }

    console.log("Uploaded file size:", stats.size);

    ffmpeg(newInputPath)
      .videoCodec("libx264")
      .audioCodec("aac")
      .on("start", (commandLine) => {
        console.log("Spawned FFmpeg with command:", commandLine);
      })
      .on("progress", (progress) => {
        console.log("Processing:", progress);
      })
      .on("end", () => {
        res.download(outputPath, `${req.file.originalname}.mp4`, (err) => {
          // Clean up files after sending
          fs.unlinkSync(newInputPath);
          fs.unlinkSync(outputPath);
          console.log("Processing done");
          if (err) {
            console.error("Error sending file:", err);
          }
        });
      })
      .on("error", (err, stdout, stderr) => {
        console.error("Conversion error:", err.message);
        console.error("FFmpeg stderr:", stderr);
        res.status(500).send("Conversion failed");
        // Clean up files
        fs.unlinkSync(newInputPath);
      })
      .save(outputPath);
  });
});

// Start the server
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

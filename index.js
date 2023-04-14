import { getTranscriptText } from "./APIs/reavai.js";

const run = async () => {
  console.log('run');
  const transcriptText = await getTranscriptText(
    "./resources/myvideo.mp4"
  );
  if (transcriptText) {
    console.log("transcriptText:", transcriptText);
  } else {
    console.log("no text to summerize");
  }
};

run();

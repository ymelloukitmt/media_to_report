// create a client
import { RevAiApiClient } from "revai-node-sdk";

var accessToken = "<TOKEN HERE>";

// initialize the client with your access token
var client = new RevAiApiClient(accessToken);

// submit a local file
const submitJob = async (filePath) => {
  const job = await client.submitJobLocalFile(filePath);
  return job;
};

const getTranscriptObject = async (id) => {
  return new Promise((resolve, reject) => {
    const getData = async () => {
      let transcriptObject;
      await client
        .getTranscriptText(id)
        .then((data) => {
          transcriptObject = data;
        })
        .catch((err) => {
          transcriptObject = err;
        });
      return transcriptObject;
    };
    const getDataInterval = setInterval(async () => {
      const data = await getData();
      console.log("data from interval");
      if (!data.currentValue) {
        console.log("Completed");
        clearInterval(getDataInterval);
        resolve(data);
      } else {
        console.log("status => in progress");
      }
    }, 30000);
  });
};

const getTranscriptText = async (path) => {
  return new Promise((resolve, reject) => {
    submitJob(path)
      .then(async (data) => {
        if (data.id && data.status === "in_progress") {
          const transcriptObject = await getTranscriptObject(data.id);
          resolve(transcriptObject);
        }
      })
      .catch((err) => {
        console.log("err", err);
        reject(false);
      });
  });
};

export { getTranscriptText };

/*
import axios from "axios";

const mediaSubmit = async (url) => {
  const { data } = await axios.post(
    "https://api.rev.ai/speechtotext/v1/jobs",
    {
      source_config: {
        url,
        metadata: "This is a test",
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 02Ikd6gER9yljchUswSSRxAMuh_1vri9l2nBr8BhsqJzifyHiPIU6auSOlpxsXE07zWtsGUMOgqr5Q1rcolqgz2XsMK7I`,
      },
    }
  );
  return data;
};

const statusListener = async (id) => {
  const { data } = await axios.post(
    `https://api.rev.ai/speechtotext/v1/jobs/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 02Ikd6gER9yljchUswSSRxAMuh_1vri9l2nBr8BhsqJzifyHiPIU6auSOlpxsXE07zWtsGUMOgqr5Q1rcolqgz2XsMK7I`,
      },
    }
  );
  return data;
};
export { mediaSubmit, statusListener };
*/

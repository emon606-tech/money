import express from 'express';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Your GitHub info
const OWNER = "emonxxx11";
const REPO = "MONYE";
const FILE_PATH = "CODE.txt";

// ⚠️ For testing, hardcoded token. Replace with env var in production.
const GITHUB_TOKEN = "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";

app.use(express.static(path.join(__dirname, 'public')));

app.get('/random', async (req, res) => {
  const randomNumber = Math.floor(Math.random() * 90000) + 10000;
  const content = `private static string number = "${randomNumber}";`;

  const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;

  try {
    // 1. Get current file SHA
    const { data } = await axios.get(apiUrl, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json"
      }
    });

    const sha = data.sha;

    // 2. Update the file content with new number
    await axios.put(apiUrl, {
      message: `Auto-update number to ${randomNumber}`,
      content: Buffer.from(content).toString('base64'),
      sha: sha
    }, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json"
      }
    });

    res.json({ success: true, number: randomNumber });

  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    console.error("GitHub Error:", msg);
    res.status(500).json({ success: false, error: msg });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

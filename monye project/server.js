import express from 'express';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// GitHub config
const OWNER = "emonxxx11";     // ✅ Your GitHub username
const REPO = "MONYE";          // ✅ Your repository name
const FILE_PATH = "CODE.txt";  // ✅ File must already exist in the repo

// ⚠️ HARD-CODED GitHub token (for testing only)
const GITHUB_TOKEN = "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";  // ⛔ Replace this with your real token

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

    // 2. Update the file content
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
  console.log(`✅ Server is running on port ${PORT}`);
});

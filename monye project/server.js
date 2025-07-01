import express from 'express';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 8080;

const OWNER = "emonxxx11"; // Your GitHub username
const REPO = "MONYE"; // Your GitHub repo name
const FILE_PATH = "CODE.txt"; // File to update
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.error("ERROR: GITHUB_TOKEN is not set in environment variables");
  process.exit(1);
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/random', async (req, res) => {
  try {
    const randomNumber = Math.floor(Math.random() * 90000) + 10000;
    const contentString = `private static string number = "${randomNumber}";`;
    const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;

    // 1. Get current file SHA
    const response = await axios.get(apiUrl, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });
    const sha = response.data.sha;

    // 2. Update file with new content (base64 encoded)
    await axios.put(apiUrl, {
      message: `Update number to ${randomNumber}`,
      content: Buffer.from(contentString).toString('base64'),
      sha
    }, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });

    // Send success response
    res.json({ number: randomNumber });
  } catch (error) {
    console.error("GitHub API error:", error.response?.data || error.message);
    const errorMsg = error.response?.data?.message || error.message;
    res.status(500).json({ error: `Failed to update GitHub file: ${errorMsg}` });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

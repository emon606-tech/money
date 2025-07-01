import express from 'express';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Get GitHub token from environment variable
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.error("❌ ERROR: GITHUB_TOKEN environment variable is not set!");
  process.exit(1); // Stop app immediately
}

const OWNER = "emonxxx11";
const REPO = "MONYE";
const FILE_PATH = "CODE.txt";

app.use(express.static(path.join(__dirname, 'public')));

app.get('/random', async (req, res) => {
  try {
    // 1. Generate the random number
    const randomNumber = Math.floor(Math.random() * 90000) + 10000;
    const content = `private static string number = "${randomNumber}";`;

    // 2. GitHub API URL to get file info
    const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;

    // 3. Get current file SHA from GitHub (needed for update)
    const { data } = await axios.get(apiUrl, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json"
      }
    });

    const sha = data.sha;

    // 4. Update file content on GitHub with new random number
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

    // 5. Respond success
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

import express from 'express';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express setup
const app = express();
const PORT = process.env.PORT || 8080;

// GitHub Config
const OWNER = "emonxxx11";      // ✅ Your GitHub username
const REPO = "MONYE";           // ✅ Repo name
const FILE_PATH = "CODE.txt";   // ✅ File must already exist
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.error("❌ ERROR: GITHUB_TOKEN not set");
  process.exit(1);
}

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));

// Random number route
app.get('/random', async (req, res) => {
  const randomNumber = Math.floor(Math.random() * 90000) + 10000;
  const newContent = `private static string number = "${randomNumber}";`;

  const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;

  try {
    // Step 1: Get SHA of current file
    const { data } = await axios.get(apiUrl, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    const sha = data.sha;

    // Step 2: PUT updated content
    await axios.put(apiUrl, {
      message: `Auto-update number to ${randomNumber}`,
      content: Buffer.from(newContent).toString('base64'),
      sha: sha
    }, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    res.json({ success: true, number: randomNumber });
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    console.error("❌ GitHub Error:", msg);
    res.status(500).json({ success: false, error: msg });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

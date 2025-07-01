import express from 'express';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Get token from environment
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.error("❌ ERROR: GITHUB_TOKEN environment variable is not set!");
  process.exit(1);
}

const OWNER = "emonxxx11";
const REPO = "MONYE";
const FILE_PATH = "CODE.txt";

app.use(express.static(path.join(__dirname, 'public')));

app.get('/random', async (req, res) => {
  try {
    const randomNumber = Math.floor(Math.random() * 90000) + 10000;
    const content = `private static string number = "${randomNumber}";`;

    const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;

    const { data } = await axios.get(apiUrl, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json"
      }
    });

    const sha = data.sha;

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

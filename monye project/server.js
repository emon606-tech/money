import express from 'express';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// GitHub repo info
const OWNER = "emonxxx11";
const REPO = "MONYE";
const FILE_PATH = "CODE.txt";

// GitHub token (for testing, hardcoded here; replace with env var in production)
const GITHUB_TOKEN = "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";

app.use(express.static(path.join(__dirname, 'public')));

app.get('/random', async (req, res) => {
  try {
    // 1. Generate a new random number first
    const randomNumber = Math.floor(Math.random() * 90000) + 10000;
    // 2. Prepare the file content string
    const content = `private static string number = "${randomNumber}";`;

    // 3. GitHub API URL to get the current file info (including SHA)
    const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;

    // 4. Get current file SHA (needed to update the file)
    const { data } = await axios.get(apiUrl, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json"
      }
    });
    const sha = data.sha;

    // 5. Update file content on GitHub with new number
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

    // 6. Respond with success and the generated number
    res.json({ success: true, number: randomNumber });

  } catch (error) {
    // If error, log and respond with failure
    const msg = error.response?.data?.message || error.message;
    console.error("GitHub Error:", msg);
    res.status(500).json({ success: false, error: msg });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Set this in Railway env variables
const REPO = 'MONYE';                         // Your GitHub repo name
const OWNER = 'your-github-username';        // Your GitHub username
const FILE_PATH = 'CODE.txt';                  // File to update in repo

app.use(express.static('public'));

app.get('/random', async (req, res) => {
    const number = Math.floor(1000 + Math.random() * 90000).toString();
    const content = `private static string number = "${number}";`;
    const base64Content = Buffer.from(content).toString('base64');

    try {
        // Get existing file to get SHA
        const { data } = await axios.get(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });

        // Update CODE.txt file in repo
        await axios.put(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`, {
            message: `Update random number: ${number}`,
            content: base64Content,
            sha: data.sha
        }, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });

        res.json({ number });

    } catch (err) {
        console.error('GitHub update error:', err.message);
        res.status(500).json({ error: 'Failed to update GitHub file' });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

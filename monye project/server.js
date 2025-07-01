const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 8080;

const OWNER = "emonxxx11"; // ✅ your GitHub username
const REPO = "MONYE"; // ✅ your repo name
const FILE_PATH = "CODE.txt"; // ✅ the file that must already exist
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // ✅ must be set in Railway

app.use(express.static('public'));

app.get('/random', async (req, res) => {
    const randomNumber = Math.floor(Math.random() * 90000) + 10000;
    const codeContent = `private static string number = "${randomNumber}";`;

    const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;

    try {
        // 1. Get current file SHA
        const { data } = await axios.get(apiUrl, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`
            }
        });

        const sha = data.sha;

        // 2. Update file with new content
        await axios.put(apiUrl, {
            message: "Update random number",
            content: Buffer.from(codeContent).toString('base64'),
            sha: sha
        }, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`
            }
        });

        res.send(`Random Number: ${randomNumber}`);
    } catch (err) {
        console.error("ERROR:", err.response?.data || err.message);
        res.send("Something went wrong!");
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server listening on port ${PORT}`);
});

const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
app.use(express.static('public'));

const PORT = process.env.PORT || 8080;

// === SET YOUR INFO HERE ===
const OWNER = "your-github-username"; // change this
const REPO = "WEBSERVER-MONEY";       // your repo name
const FILE_PATH = "CODE.txt";         // file to update
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

app.get('/random', async (req, res) => {
    const randomNumber = Math.floor(Math.random() * 90000) + 10000;

    const content = `private static string number = "${randomNumber}";`;

    const githubApiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;

    try {
        const getResponse = await axios.get(githubApiUrl, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            }
        });

        const sha = getResponse.data.sha;

        await axios.put(githubApiUrl, {
            message: "Update random number",
            content: Buffer.from(content).toString('base64'),
            sha: sha
        }, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            }
        });

        res.send(`Random Number: ${randomNumber}`);
    } catch (err) {
        console.error(err.message);
        res.send("Something went wrong!");
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

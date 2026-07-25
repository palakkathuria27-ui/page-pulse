const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Page Pulse API is Running");
});

app.post("/analyze", async (req, res) => {

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({
            error: "Website URL is required"
        });
    }

    try {

        const startTime = Date.now();

        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        const endTime = Date.now();
        const responseTime = endTime - startTime;

        const html = response.data;

        const $ = cheerio.load(html);

        const title = $("title").text().trim();

        const metaDescription =
            $('meta[name="description"]').attr("content") || "Not Found";

        const h1Count = $("h1").length;

        const imagesWithoutAlt = $("img").filter(function () {
            return !$(this).attr("alt");
        }).length;

        const wordCount = $("body")
            .text()
            .replace(/\s+/g, " ")
            .trim()
            .split(" ").length;
            res.json({
            httpStatus: response.status,
            responseTime: responseTime + " ms",
            pageTitle: title,
            metaDescription,
            h1Count,
            imagesWithoutAlt,
            wordCount
        });

    } catch (error) {
        res.status(500).json({
            error: "Failed to analyze website."
        });
    }

});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
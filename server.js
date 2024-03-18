const express = require("express");
const app = express();
const port = 80;
const path = require("path");

app.use(express.static("public"));
app.use(express.json());

app.post('/api/insert', async (req, res) => {
  const data = req.body;  
  try {
    data.forEach(element => {
      console.log(element);
    });
    res.json({ success: true, message: 'Data inserted successfully' });
} catch (error) {
    console.error('Database insertion error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
}
});

app.get("/", async (req, res) => {
  try {

    // Send HTML response with a button and auto-reload script
    res.sendFile(path.join(__dirname, "./index.html"));
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

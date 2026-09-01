const app = require("./app");

const PORT = process.env.PORT || 8081;

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Arctic Circle API listening on http://localhost:${PORT}`);
});
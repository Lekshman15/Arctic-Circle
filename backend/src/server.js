const app = require("./app");

const PORT = process.env.PORT || 8081;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Arctic Circle API listening on port ${PORT}`);
});
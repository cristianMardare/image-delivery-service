import express from "express"
const PORT = 62226

const app = express();

app.listen(PORT, () => {
  // tslint:disable-next-line:no-console
  console.log(`Server listening at http://localhost:${PORT}`);
});
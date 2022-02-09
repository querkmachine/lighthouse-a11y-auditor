import express from 'express';
import path from 'path';

const router = express.Router();
const app = express();
const port = 9022;

app.use("/reports", express.static('reports'));

router.get("/", (req, res) => {
	res.sendFile(path.resolve("index.html"));
});

app.use("/", router);

app.listen(port, () => {
	console.log(`View summary report on http://localhost:${port}/`);
});
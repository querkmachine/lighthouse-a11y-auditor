import fs from "fs";
import lighthouse from "lighthouse";
import chromeLauncher from "chrome-launcher";
import yargs from "yargs";
import filenamify from "filenamify";
import del from "del";

const args = yargs.argv;
const dir = "reports";
const urlsToTest = fs.readFileSync("urls-to-test.txt", "UTF-8");
const urls = urlsToTest.split(/\r?\n/);

const runTests = new Promise((resolve, reject) => {
  const testSummary = [];
  let testsRan = 0;

  del.sync(dir);

  (async () => {
    for (const url of urls) {
      const chrome = await chromeLauncher.launch({
        chromeFlags: ["--headless", "--disable-gpu"],
      });
      const options = {
        port: chrome.port,
        logLevel: "info",
        output: ["json"],
        onlyCategories: ["accessibility"],
        skipAudits: ["full-page-screenshot"],
      };
      const runnerResult = await lighthouse(url, options);
      const reportJson = String(runnerResult.report);

      fs.mkdir(dir, { recursive: true }, (err) => {
        if (err) throw err;
        const filename = `${filenamify(url, { replacement: "_" })}.report.json`;
        fs.writeFile(`${dir}/${filename}`, reportJson, (err) => {
          testSummary.push({
            url: url,
            name: filenamify(url, { replacement: "_" }),
            file: filename,
            score: err ? 0 : runnerResult.lhr.categories.accessibility.score,
            error: err
              ? err.message
              : runnerResult.lhr.runtimeError
              ? runnerResult.lhr.runtimeError.message
              : null,
          });
        });
      });

      await chrome.kill();
      testsRan++;

      if (testsRan === urls.length) {
        resolve({
          date: new Date(Date.now()).toISOString(),
          summary: testSummary,
        });
      }
    }
  })();
});

runTests
  .then((summary) => {
    fs.writeFile(`${dir}/summary.json`, JSON.stringify(summary), (err) => {
      if (err) throw err;
    });
  })
  .catch((err) => {
    throw err;
  });

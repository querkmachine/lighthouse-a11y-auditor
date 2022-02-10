# Lighthouse a11y auditor

A quick, hacky, for-personal-use tool for running a bunch of pages through Lighthouse's accessibility audit.

![Screenshot of an example report.](http://kimgur.com/koeGV)

## Install

1. Pull down the repo.
2. Run `npm install`.

## Usage

⚠️ Any previously created reports will be deleted when a new one is ran. Make a copy of the current one if you wish to keep it.

1. Stick the URLs you want to test into `urls-to-test.txt`, one per line.
2. From a terminal, run `npm run audit` to run the tests.
3. Wait while the tests run. This can take quite a while (5–10 seconds per URL); Lighthouse doesn't support asyncronous runs, so each URL has to be tested one at a time. (If you're testing quite a lot you might want do them overnight.)
4. When finished, run `npm run report` to start a local web server at localhost:9022, with the summary results of the audit.

### Caveats

Automated tests cannot cover all aspects of accessibility compliance—a computer cannot tell whether the alt text provided for an image is descriptive enough, or whether a piece of text is meant to be a form input hint or not. This tool is intended as a way to get a high-level view of several pages/templates on a site, rather than a way to ensure that each page is actually accessible.

The Lighthouse accessibility specification does not exactly align with the WCAG specification. Use the audit as a guide, rather than confirmation that the page is accessible.

Running a lot of requests against a website can result in throttling or being barred from making future requests, as it may be interpreted as a DOS attack. Pages that return HTTP errors or fail to load in time will be listed as having errored in the report, and receive an automatic score of 0. (Note that this means that trying to test error pages, like 404 pages, will always fail.)

Pages must be publicly accessible from the machine running the audit. Pages behind paywalls, login requirements, country blocks, etc. cannot be tested.

### Known issues

#### In case of crashes

This program launches instances of Google Chrome in headless mode. That means Chrome is running, but is doing so as a background task, with no open windows or visible UI. If the program crashes before completion or is killed from the command line, these headless instances won't be garbage collected and will continue running. This may have side effects on machine performance or how Chrome appears to function (or doesn't).

If you encounter weirdness after using this program, open up Activity Monitor (macOS) or Task Manager (Windows) and manually end all running instances of Google Chrome.

## Distribution

The report results cannot be read directly from the local file system due to browser security restrictions. You must view it through a web server (remote or local).

If deploying the results to a server somewhere, you only need to upload the `index.html` file and `reports/` directory.

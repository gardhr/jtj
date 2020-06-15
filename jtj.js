#!/usr/bin/env node

const { statSync } = require("fs");
const { baseName } = require("path");
const jalosi = require("jalosi");
const commandLineArgs = require("command-line-args");
const commandLineUsage = require("command-line-usage");
const print = console.log;

const optionList = [
  {
    name: "help",
    description: "Show usage options",
    alias: "h",
    type: Boolean,
  },
  {
    name: "input",
    alias: "i",
    description: "Input files to process",
    type: String,
    multiple: true,
    defaultOption: true,
    typeLabel: "{underline file} ...",
  },
  { name: "write", alias: "w", description: "Overwite output file (otherwise written to standard output)", type: Boolean }
];

const usage = commandLineUsage([
  {
    header: "Javascript to JSON",
    content:
      "Convert Javascript objects to the JSON format using {bold Jalosi} style format. ({underline https://github.com/gardhr/jalosi})",
  },
  {
    header: "Options",
    optionList: optionList,
  },
  {
    content: "Project home: {underline https://github.com/gardhr/jtj}",
  },
]);

var options = commandLineArgs(optionList);
let input = options.input;
if (!input) return print(usage);

function fileExists(fileName) {
  try {
    return statSync(fileName).isFile();
  } catch (notFound) {
    return false;
  }
}

for (let idx = 0, imx = input.length; idx < imx; ++idx) {
  let fileName = input[idx];
  if (!fileExists(fileName)) fileName += ".js";
  statSync(fileName);
  let js = jalosi(fileName);
  let json = JSON.stringify(js, null, " ");
  if (!options.write) print(json);
  else writeFileSync(baseName(fileName) + ".json", json);
}

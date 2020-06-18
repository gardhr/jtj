#!/usr/bin/env node

const { statSync, writeFileSync } = require("fs");
const { extname } = require("path");
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
    description: "Input files to process (default: package.js)",
    type: String,
    multiple: true,
    defaultOption: true,
    typeLabel: "{underline file} ...",
  },
  {
    name: "write",
    alias: "w",
    description: "Overwite file (default: print to standard output)",
    type: Boolean,
  },
];

const usage = commandLineUsage([
  {
    header: "Javascript to JSON",
    content:
      "Convert Javascript objects to JSON using {bold Jalosi} style format. ({underline https://github.com/gardhr/jalosi})",
  },
  {
    header: "Options",
    optionList: optionList,
  },
  {
    content: "Project home: {underline https://github.com/gardhr/jtj}",
  },
]);

try {
  var options = commandLineArgs(optionList);
  let input = options.input;
  if (!input) input = ["package"];
  for (let idx = 0, imx = input.length; idx < imx; ++idx) {
    let fileName = input[idx];
    let js = jalosi(fileName);
    let json = JSON.stringify(js, null, " ");
    if (!options.write) print(json);
    else {
      let extension = extname(fileName);
      let length = extension.length;
      let rootName = length ? fileName.slice(0, -length) : fileName;
      let outputFile = rootName + ".json";
      let modeMessage = "Updated";
      try {
        statSync(outputFile);
      } catch (notFound) {
        modeMessage = "Created";
      }
      let messageText = modeMessage + " file " + outputFile;
      try {
        writeFileSync(outputFile, json);
        print(messageText);
      } catch (error) {
        print(error);
      }
    }
  }
} catch (error) {
  console.error(error);
  print(usage);
}

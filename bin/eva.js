#! /usr/bin/env node

const fs = require("fs");

const evaparser = require("../parser/evaParser");
const Eva = require("../Eva");

function evalGlobal(src, eva) {
    const exp = evaparser.parse(`(begin ${src})`);
    return eva.evalGlobal(exp);
}

function main(argv) {
    const [_node, _path, mode, exp] = argv;

    const eva = new Eva();

    //Direct expression
    if(mode === '-e') {
        return evalGlobal(exp, eva);
    }

    if(mode === "-f") {
        const src = fs.readFileSync(exp, "utf-8");
        return evalGlobal(src, eva);
    }
}

main(process.argv);
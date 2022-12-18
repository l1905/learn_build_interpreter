const Eva = require("../Eva");
const Environment = require("../Environment");

const tests = [
    require("./self-eval-test"),
    require("./math-test"),
    require("./variable-test"),
    require("./block-test"),
    require("./if-test"),
    require("./while-test"),
    require("./built-in-function-test"),
    require("./user-defined-function"),
    require("./lamda-function-test"),
    require("./switch-test"),
    require("./for-test"),
    require("./incr-test"),
    require("./decr-test"),
    require("./class-test"),
    require("./module-test"),
    require("./import-test"),
];

const eva = new Eva();

tests.forEach(test => test(eva));

eva.eval(['print', '"hello"', '"world"']);
console.log("All assertions passed!");
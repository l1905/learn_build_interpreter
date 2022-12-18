const assert = require("assert");
const evalParser = require("../parser/evaParser");

function test(eva, code, expected) {
    const exp = evalParser.parse(`(begin ${code})`);
    assert.strictEqual(eva.evalGlobal(exp), expected)
}

module.exports = {
  test,
};
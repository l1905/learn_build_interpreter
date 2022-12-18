const assert = require("assert")

module.exports = eva => {
    // self evaluation
    assert.strictEqual(eva.eval(1), 1);
    assert.strictEqual(eva.eval('"1"'), "1")
}
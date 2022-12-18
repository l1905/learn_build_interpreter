const assert = require("assert")

module.exports = eva => {
    // math
    assert.strictEqual(eva.eval(["+", 5, 5]), 10)
    assert.strictEqual(eva.eval(["+", ["+", 3, 2], 5]), 10)
    assert.strictEqual(eva.eval(["+", 5, ["+", 3, 2]]), 10)
    assert.strictEqual(eva.eval(["-", ["-", 3, 2], 5]), -4)
    assert.strictEqual(eva.eval(["-", 5, ["-", 3, 2]]), 4)
    assert.strictEqual(eva.eval(["*", ["*", 3, 2], 5]), 30)
    assert.strictEqual(eva.eval(["/", ["/", 3, 2], 5]), 0.3)
}
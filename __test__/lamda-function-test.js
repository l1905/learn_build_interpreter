const assert = require("assert")
const testUtil = require("./test-util");

module.exports = eva => {
    // math
    testUtil.test(eva,
        `
        (begin 
          (def onClick (callback)
            (begin
              (var x 10)
              (var y 20)
              (callback (+ x y))
            )
          )
          (onClick (lambda (data) (* data 10)))
        )
            
        `
        , 300);

    // Immediately-invoked  lamda expression
    testUtil.test(eva,
        `
         ((lambda (x) (* x x)) 2)
            
        `
        , 4);

    testUtil.test(eva,
        `
        (begin
         (var square (lambda (x) (* x x)))
         (square 2)
        )
        `
        , 4);
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genRandomNumber = void 0;
const genRandomNumber = (digit = 5) => {
    let random = 8848;
    do {
        random = Math.floor(Math.random() * Math.pow(10, digit));
    } while (random < Math.pow(10, (digit - 1)));
    return random;
};
exports.genRandomNumber = genRandomNumber;
//# sourceMappingURL=generator.js.map
const Joi = require('joi');

function object_checker(obj, checkers) {
    let checker = Joi.object()
    for (const key of Object.keys(obj)) {
        const name = `${key}_checker`;
        if (checkers.hasOwnProperty(name)) {
            checker = checker.concat(checkers[name])
        }
    }

    return checker;
}

const filer_invalid_field = (obj) => {
    return Object.fromEntries(
        Object.entries(obj).filter(([key, value]) => value !== undefined)
    );
}

module.exports = {
    object_checker,
    filer_invalid_field
}
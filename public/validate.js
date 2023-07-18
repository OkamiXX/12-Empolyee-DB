//////////////////////////////////////////////////
////////////// Install Dependencies //////////////

const validator = require('validator');

// Main function
const validate = {
    // Checks if the user entered a string.
    validateStr(str) {
        return str !== '' || "Please enter a valid answer..."
    },
    // Checks if the user entered a number.
    validatePay(salary) {
        if (validator.isDecimal(salary)) return true;

        return "Please enter a valid salary...";
    },
    // Checks if the strings are the same.
    isEqual(str, str2) {
        if (str === str2) return true;
    }
};

// Exports the functions.
module.exports = validate;
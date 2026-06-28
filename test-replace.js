console.log("$\\int$"); // one backslash
console.log("$\\\\int$"); // two backslashes
console.log("$\\\\int$".replace(/\\\\/g, '\\'));

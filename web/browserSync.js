var bs = require("browser-sync").create();


// .init starts the server
bs.init({
    cors:true,
    server: "./",
});

// Now call methods on bs instead of the
// main browserSync module export
bs.reload("./index.html");
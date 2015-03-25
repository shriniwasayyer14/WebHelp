var config = module.exports;

config["WebHelp Tests"] = {
    rootPath : "../",
    environment:"browser",
    sources: [
        "js/*.js"
    ],
    tests: [
        "test/*-test.js"
    ]
};

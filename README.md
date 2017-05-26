# Allianz

## Installation
```gherkin
npm install -g live-server;
npm install;
gulp;
cd ./build;
live-server;
```

## Gulp tasks

Watch - Monitor all files and update the browser automatic
```gherkin
gulp watch
```

Default - Run all necessary tasks
```gherkin
gulp
```

Images - Copy images folders to build
```gherkin
gulp images
```

JS - Browserify JS and convert to ES5 from ES6.
```gherkin
gulp js
```

CSS - Compile SASS files to the build folder
```gherkin
gulp sass
```

Views - Compile handlebars files and rename it to HTML.
```gherkin
gulp handlebars
```

## Tests
```gherkin
npm t
```



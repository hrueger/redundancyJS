# RedundancyJS

[![npm](https://img.shields.io/npm/v/redundancyjs)](https://npmjs.com/package/redundancyjs)
[![License](https://img.shields.io/badge/License-MIT-blue)](./LICENSE.md)
[![GitHub last commit](https://img.shields.io/github/last-commit/hrueger/redundancyjs?color=brightgreen)](https://github.com/hrueger/redundancyjs/commits)
[![Maintenance](https://img.shields.io/maintenance/yes/2021)](https://github.com/hrueger/redundancyjs/commits)

This is a simple and easy to use CLI to copy code files programatically.

## Usage
Create a file called `redundancy.json` in the root fodler of your project. It has to look like this:
```json
{
    "version": 1,
    "files": [
        {
            "src": "AGtiv/src/app/data/ways.ts",
            "dest": "api/src/data/"
        }
    ]
}
```
Then, run `npx redundancyjs`.

You can watch for changes and automatically copy the files with `npx redundancyjs --watch` or `npx redundancyjs -w`.

You can also copy multiple files:
```json
{
    "version": 1,
    "files": [{
        "src": "api/src/entity/*.ts",
        "dest": "frontend/src/app/_models/"
    }]
}
```

Remove TypeScript decorators:
```json
{
    "version": 1,
    "files": [{
        "src": "api/src/entity/*.ts",
        "dest": "frontend/src/app/_models/",
        "removeDecorators": true
    }]
}
```

Remove methods:
```json
{
    "version": 1,
    "files": [{
        "src": "api/src/entity/*.ts",
        "dest": "frontend/src/app/_models/",
        "removeMethods": ["myMethodName", "anotherMethod", "doThis"]
    }]
}
```

Remove imports:
```json
{
    "version": 1,
    "files": [{
        "src": "api/src/entity/*.ts",
        "dest": "frontend/src/app/_models/",
        "removeImports": ["coolPackage", "lodash"]
    }]
}
```

Change imported types from libraries to `any`:
```json
{
    "version": 1,
    "files": [{
        "src": "api/src/entity/*.ts",
        "dest": "frontend/src/app/_models/",
        "changeInports": ["uncoolPackage"]
    }]
}
```

## License
MIT

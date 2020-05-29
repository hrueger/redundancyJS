# Redundancyjs

[![npm](https://img.shields.io/npm/v/redundancyjs)](https://npmjs.com/package/redundancyjs)
[![License](https://img.shields.io/badge/License-MIT-blue)](./LICENSE.md)
[![GitHub last commit](https://img.shields.io/github/last-commit/hrueger/redundancyjs?color=brightgreen)](https://github.com/hrueger/redundancyjs/commits)
[![Maintenance](https://img.shields.io/maintenance/yes/2020)](https://github.com/hrueger/redundancyjs/commits)

This is a simple and easy to use CLI to copy code files programatically.

## Usage
Create a file called `redundancy.json` in the root fodler of your project. It has to look like this:
```json
{
    "version": 1,
    "files": [
        {
            "src": "AGtiv/src/app/data/ways.ts",
            "dest": "api/src/data/ways.ts"
        }
    ]
}
```
Then, run `npx redundancyjs`.

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

## License
MIT

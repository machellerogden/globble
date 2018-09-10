'use strict';

module.exports = Globble;

const path = require('path');
const callsites = require('callsites');
const globby = require('globby');
const untildify = require('untildify');
const fs = require('fs');
const YAML = require('js-yaml');
const Module = require('module');

const yml = (filePath) => YAML.safeLoad(fs.readFileSync(filePath, 'utf8'));
const json = (filePath) => Module._load(filePath);
const js = (filePath) => {
    const value = Module._load(filePath);
    try {
        JSON.parse(value);
    } catch (e) {
        throw new Error(`${filePath} does exported invalid JSON.`);
    }
    return value;
};

const reader = {
    yml,
    yaml: yml,
    json,
    js
};

function Globble(givenPatterns, searchFromRoot = false) {

    const patterns = Array.isArray(givenPatterns)
        ? givenPatterns.map(p => untildify(p))
        : untildify(givenPatterns);

    const dir = searchFromRoot
        ? '/'
        : path.dirname(callsites()[1].getFileName());

    const paths = globby.sync(patterns, { cwd: dir });

    return paths.reduce((acc, currentFile) => {

        const file = {
            ...path.parse(currentFile),
            path: path.resolve(currentFile)
        };

        const key = file.ext.startsWith('.')
            ? file.ext.slice(1)
            : file.ext;

        if (Object.keys(reader).includes(key)) acc.push({
            name: file.name,
            file: file.path,
            data: reader[key](file.path)
        });

        return acc;
    }, []);
}

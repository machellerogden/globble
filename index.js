'use strict';

module.exports = globble;

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
        JSON.parse(value); // discard value. parsing for validation side-effect
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

function globble(givenPatterns, options = {}) {
    const {
        relative,
        clobber,
        globbyOptions,
        patterns,
        dir
    } = init(givenPatterns, options);
    return globby(patterns, { cwd: dir, ...globbyOptions }).then(paths => reduce(paths, clobber ? {} : []));
}

globble.sync = (givenPatterns, options = {}) => {
    const {
        relative,
        clobber,
        globbyOptions,
        patterns,
        dir
    } = init(givenPatterns, options);
    return reduce(globby.sync(patterns, { cwd: dir, ...globbyOptions }), clobber ? {} : []);
}

function init(givenPatterns, options) {
    const {
        relative = true,
        clobber = false,
        globbyOptions = {}
    } = options;

    const patterns = Array.isArray(givenPatterns)
        ? givenPatterns.map(p => untildify(p))
        : untildify(givenPatterns);

    const dir = relative
        ? path.dirname(callsites()[1].getFileName())
        : '/';

    return { patterns, dir, clobber, globbyOptions };
}

function reduce(paths, initial) {
    return paths.reduce((acc, currentFile) => {

        const file = {
            ...path.parse(currentFile),
            path: path.resolve(currentFile)
        };

        const key = file.ext.startsWith('.')
            ? file.ext.slice(1)
            : file.ext;

        if (Object.keys(reader).includes(key)) {

            const data = reader[key](file.path);

            if (Array.isArray(acc)) {
                acc.push({
                    name: file.name,
                    file: file.path,
                    data
                });
            } else {
                acc[file.name] = data;
            }
        }

        return acc;

    }, initial);
}

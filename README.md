# globble

> Globble loads data from JSON and YAML files as well as from JS files which export valid JSON data structures.

Built atop [`globby`](https://github.com/sindresorhus/globby) by the brilliant and prolific [Sindre Sorhus](https://github.com/sindresorhus), which in turn is built atop [`fast-glob`](https://github.com/mrmlnc/fast-glob) by [Denis Malinochkin](https://github.com/mrmlnc).

## Install

```
$ npm install globble
```

## Usage

#### File System

```
├── stargate
│   ├── sam.yml
│   └── tealc.json
├── startrek
│   ├── worf.yml
│   └── la-forge.js
└── starwars.json
```

#### Code

```js
const globble = require('globble');

(async () => {
    const data = await globble('./scifi/**');
    console.log(data);
})();
```

#### Output

```js
[ { name: 'sam',
    file: '/Users/mac/scifi/stargate/sam.yml',
    data: { strength: 6,
            dexterity: 9,
            endurance: 10,
            intelligence: 10 } },
  { name: 'tealc',
    file: '/Users/mac/scifi/stargate/tealc.json',
    data: { strength: 10,
            dexterity: 6,
            endurance: 10,
            intelligence: 8 } },
  { name: 'worf',
    file: '/Users/mac/scifi/startrek/worf.yaml',
    data: { strength: 10,
            dexterity: 4,
            endurance: 10,
            intelligence: 7 } },
  { name: 'la-forge',
    file: '/Users/mac/scifi/startrek/la-forge.js',
    data: { strength: 4,
            dexterity: 9,
            endurance: 7,
            intelligence: 9 } },
  { name: 'starwars',
    file: '/Users/mac/scifi/starwars.json',
    data: { rating: 3 } }]
```

## API

### globble(patterns, [options])

Returns a `Promise<Array|Object>` of data from matched files.

#### patterns

Type: `string` `Array`

See supported `minimatch` [patterns](https://github.com/isaacs/minimatch#usage).

#### options

Type: `Object`

See [`globby` options](https://github.com/sindresorhus/globby#options) in addition to the ones below.

##### clobber

Type: `boolean`
Default: `false`

If set to `true`, `globble` will resolve with an object of the loaded data instead of a collection. The keys of this object will be the filename without the extension or the path. This means there is a chance of collisions—hence the name of the option.

#### File System

```
└── config
    ├── docker.json
    └── k8s.yml
```

#### Code

```js
(async () => {
    const data = await globble('./config/**', { clobber: true });
    console.log(data);
})();
```

#### Output

```js
{ docker: { baseImage: "alpine" },
  k8s: { deployment: { name: "sandbox" } } }
```

### globble.sync(patterns, [options])

Returns an `Array|Object` of data from matched files.


## Closing Thoughts...

Given globs `globble` gobbles gobs of goods.

## License

MIT © [Mac Heller-Ogden](https://github.com/machellerogden)

# seo-picket
NodeJS module for checking SEO defects of HTML pages


#### Installation

```bash
npm install -g seo-picket
```
Or install it and save it in your package.json file:

```bash
npm install --save-dev seo-picket
```

#### Command Line Usage

```bash
$> ./index.js -h
Usage: index.js --file [file path] OR index.js --string [HTML snippet]

Options:
  --file, -f        Path to a HTML file
  --string, -s      A HTML snippet                                      [string]
  --console, -c     Show the result on console
  --outputFile, -o  Write the result to a specific file                 [string]
  --rules, -r       Select some pre-defined rules
                             [array] [default: ["h1","head","img","a","strong"]]
  --strongCount     The low bound count of <strong> tag   [number] [default: 15]
  -h, --help        Show help                                          [boolean]
  -v, --version     Show version number                                [boolean]

Examples:
  index.js --file foo.html --console  Parse foo.html and show SEO defect items
```

#### Development

Please see `index.js` and `test/SEOPicket.js` to know more options.
You may want to run test or lint as follow:

```bash
npm test
```

```bash
npm run lint
```


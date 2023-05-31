const createFilter = require('rollup-pluginutils').createFilter
const fs = require('fs');
const path = require('path');

function concat(options = {}) {
    const filter = createFilter(options.include, options.exclude);
    const groupedFiles = options.groupedFiles || [];

    return {
        name: 'concat',

        buildStart() {
            for (const group of groupedFiles) {
                const files = group.files || [];
                if (typeof group.outputFile === 'undefined') {
                    throw new Error("You must specify an outputFile property for each set of files to be concatenated.")
                }

                let code = '';

                for (const file of files) {
                    if (filter(file)) {
                        const content = fs.readFileSync(file, 'utf8');
                        code += `${content}\n`;
                    }
                }

                const outputFile = path.resolve(process.cwd(), group.outputFile);
                fs.writeFileSync(outputFile, code, 'utf8');
            }
        },
    };
}

module.exports = concat;
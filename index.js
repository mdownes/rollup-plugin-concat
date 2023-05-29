import { createFilter } from 'rollup-pluginutils';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

export default function concat(options = {}) {
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
                        const content = readFileSync(file, 'utf8');
                        code += `${content}\n`;
                    }
                }

                const outputFile = resolve(process.cwd(), group.outputFile);
                writeFileSync(outputFile, code, 'utf8');
            }
        },
    };
}

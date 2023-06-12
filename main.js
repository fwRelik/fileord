#!/usr/bin/env node

import path from 'path';
import fs from 'fs/promises';
import { program } from 'commander';
import { Affix } from './affix.js';

const _version = 'v0.2.0';

const bootstrap = async () => {
	program.name('fileord').usage('[options]').version(_version, '-v, --version', 'Version');

	program
		.option('-pre, --prefix <value>', 'Prefix before filename', '')
		.option('-post, --postfix <value>', 'Postfix after filename', '')
		.option('-a, --alias <value>', 'Replacing the current filename', '')
		.option('-p, --path <value>', 'Directory path', null)
		.option('-ex, --extenstion <value>', 'File extension', null)
		.option('--uniq <boolean>', 'Filename is unified, while the current name and alias are ignored', false);

	program.parse();
	const { prefix, postfix, alias, path: pathName, extenstion, uniq } = program.opts();
	let counter = 1;

	console.log(prefix, postfix, alias, pathName, uniq);
	if (!pathName) throw new Error('Directory path not specified');

	const files = await fs
		.readdir(pathName, { encoding: 'utf-8' })
		.then(res => res)
		.catch(err => console.log(err));

	Promise.all(
		files.map(async filename => {
			const affix = new Affix({
				filename,
				toExtname: extenstion,
				alias,
				prefix,
				postfix,
			});
			const currentPath = path.join(pathName, filename);
			const newPath = path.join(pathName, `${affix.getAffix(uniq, counter++)}`);

			return await fs
				.rename(currentPath, newPath)
				.then(res => {
					console.log(`Renamed: ${filename} >> ${path.basename(newPath)}`);
					return res;
				})
				.catch(err => console.log(err));
		})
	);
};

bootstrap();

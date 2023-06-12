import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export class Affix {
	constructor({ filename, alias = '', toExtname = '', prefix = '', postfix = '' }) {
		this.filename = filename;
		this.alias = alias;
		this.toExtname = toExtname;
		this.prefix = prefix;
		this.postfix = postfix;
	}

	get extname() {
		return path.extname(this.filename);
	}

	getAffix(uniq, counter) {
		let name = '';

		if (uniq) {
			name = uuidv4();
			counter = '';
		} else name = this.alias ? this.alias : this.filename.replace(/\.[^/.]+$/, '');

		if (this.toExtname) return `${this.prefix}${name}${this.postfix}${counter}${this.toExtname}`;
		return `${this.prefix}${name}${this.postfix}${counter}${this.extname}`;
	}
}

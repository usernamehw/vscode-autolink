import { Dictionary } from 'lodash';

export interface ExtensionConfig {
	queries: {
		filePattern: string;
		linkPattern: string;
		linkText: string;
	}[];
}

export type StateQueries = Dictionary<{
	filePattern: string;
	linkPattern: string;
	linkText: string;
	linkRegexp: RegExp;
}[]>;

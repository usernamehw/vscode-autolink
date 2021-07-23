import { Dictionary } from 'lodash';
import groupBy from 'lodash/groupBy';
import { ExtensionContext, workspace } from 'vscode';
import { updateDocumentLinkProvider } from './documentLinksProvider';
import { ExtensionConfig, StateQueries } from './types';

export const enum Constants {
	extensionId = 'usernamehw.autolink',
	extensionName = 'autolink',
	variableText = '${0}',
}

export let extensionConfig: ExtensionConfig;

export abstract class extensionState {
	static queries: StateQueries = {};
}

export function activate(extensionContext: ExtensionContext) {
	updateConfig();
	updateEverything();

	function updateConfig() {
		extensionConfig = workspace.getConfiguration().get(Constants.extensionName) as ExtensionConfig;
	}

	function updateEverything() {
		updateQueries();
		updateDocumentLinkProvider();
	}

	extensionContext.subscriptions.push(workspace.onDidChangeConfiguration(e => {
		if (!e.affectsConfiguration(Constants.extensionName)) {
			return;
		}
		updateConfig();
		updateEverything();
	}));
}
/**
 * Group by filePattern to register fewer `documentLinkProvider`s.
 * Create regexp from linkPattern (global, case-insensitive)
 */
function updateQueries() {
	const groupedQueries = groupBy(extensionConfig.queries, 'filePattern' as keyof ExtensionConfig['queries'][number]) as Dictionary<{
		filePattern: string;
		linkPattern: string;
		linkText: string;
		linkRegexp: RegExp;
	}[]>;
	for (const filePattern in groupedQueries) {
		const queries = groupedQueries[filePattern];
		for (const query of queries) {
			query.linkRegexp = new RegExp(query.linkPattern, 'g');
		}
	}
	extensionState.queries = groupedQueries;
}

export function deactivate() { }

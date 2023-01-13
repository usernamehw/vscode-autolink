import { Disposable, DocumentLink, env, languages, Range, Uri, window } from 'vscode';
import { Constants, extensionState } from './extension';
import { openLink } from './openLink';

const documentLinkDisposables: Disposable[] = [];

/**
 * Use unused `uri.fragment` property to pass data into `window.registerUriHandler`
 */
interface FragmentData {
	filePattern: string;
	queryIndex: number;
}

export function updateDocumentLinkProvider() {
	disposeDocumentLinkDisposables();

	if (!Object.keys(extensionState.queries).length) {
		return;
	}

	const uriDisposable = window.registerUriHandler({
		handleUri(uri) {
			const fragmentData: FragmentData = JSON.parse(uri.fragment);
			const query = extensionState.queries[fragmentData.filePattern][fragmentData.queryIndex];
			openLink(uri.query.replace(query.linkRegexp, replaceExtensionVariableWithRegexpGroup(query.linkText)));
		},
	});
	documentLinkDisposables.push(uriDisposable);


	for (const filePattern in extensionState.queries) {
		const queries = extensionState.queries[filePattern];
		documentLinkDisposables.push(languages.registerDocumentLinkProvider(
			{
				scheme: 'file',
				pattern: filePattern === 'undefined' ? undefined : filePattern,
			},
			{
				provideDocumentLinks(document) {
					const matches: DocumentLink[] = [];
					for (let i = 0; i < document.lineCount; i++) {
						const text = document.lineAt(i).text;
						for (let j = 0; j < queries.length; j++) {
							const query = queries[j];
							const regexp = query.linkRegexp;
							for (let match = regexp.exec(text); match !== null; match = regexp.exec(text)) {
								const fragment: FragmentData = {
									filePattern,
									queryIndex: j,
								};
								matches.push({
									range: new Range(i, match.index, i, match[0].length + match.index),
									target: Uri.from({
										scheme: env.uriScheme,
										authority: Constants.ExtensionId,
										query: match[0],
										fragment: JSON.stringify(fragment),
									}),
									tooltip: 'Autolink.',
								});
							}
						}
					}
					return matches;
				},
			},
		));
	}
}

/**
 * Transform extension replace format into JS regexp group:
 * `https://${0}/${1}/${2}` => `https://$1/$2/$3`
 */
function replaceExtensionVariableWithRegexpGroup(text: string): string {
	return text.replace(/\${(\d)}/g, (_, g1) => `$${Number(g1) + 1}`);
}

function disposeDocumentLinkDisposables() {
	for (const disposable of documentLinkDisposables) {
		disposable.dispose();
	}
	documentLinkDisposables.length = 0;
}

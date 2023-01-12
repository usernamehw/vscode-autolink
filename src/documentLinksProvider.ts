import { Disposable, DocumentLink, env, languages, Range, Uri, window } from 'vscode';
import { Constants, extensionState } from './extension';
import { openLink } from './openLink';

const documentLinkDisposables: Disposable[] = [];

export function updateDocumentLinkProvider() {
	disposeDocumentLinkDisposables();

	if (!Object.keys(extensionState.queries).length) {
		return;
	}

	const uriDisposable = window.registerUriHandler({
		handleUri(uri) {
			openLink(uri.query, uri.fragment);
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
						for (const query of queries) {
							const regexp = query.linkRegexp;
							for (let match = regexp.exec(text); match !== null; match = regexp.exec(text)) {
								matches.push({
									range: new Range(i, match.index, i, match[0].length + match.index),
									target: Uri.from({
										scheme: env.uriScheme,
										authority: Constants.ExtensionId,
										query: query.linkText,
										fragment: match[1],
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

function disposeDocumentLinkDisposables() {
	for (const disposable of documentLinkDisposables) {
		disposable.dispose();
	}
	documentLinkDisposables.length = 0;
}

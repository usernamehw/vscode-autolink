import { env, Uri } from 'vscode';
import { substituteVariables } from './substituteVariables';

export async function openLink(linkText: string) {
	const link = substituteVariables(linkText);
	await env.openExternal(Uri.parse(link));
}

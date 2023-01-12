import { env, Uri } from 'vscode';
import { Constants } from './extension';
import { substituteVariables } from './substituteVariables';

export async function openLink(linkText: string, variableValue: string) {
	const link = substituteVariables(linkText.replace(Constants.VariableText, variableValue));
	await env.openExternal(Uri.parse(link));
}

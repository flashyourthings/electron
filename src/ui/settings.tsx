import * as electron from 'electron';
import * as React from 'react';
import { Form } from 'rendition';

import { CloseableWindow, render } from './theme';

interface SettingsState {
	schema: any;
	data: any;
}

class SettingsWindow extends React.Component<{}, SettingsState> {
	constructor(props: {}) {
		super(props);
		this.state = {
			schema: {},
			data: {},
		};
		this.init();
	}

	private async init() {
		const schema = await electron.ipcRenderer.invoke('get-settings-schema');
		const data = await electron.ipcRenderer.invoke('get-settings-data');
		this.setState({ schema, data });
		electron.ipcRenderer.on('settings-changed', async () => {
			const newData = await electron.ipcRenderer.invoke('get-settings-data');
			this.setState({ data: newData });
		});
	}

	public render() {
		return (
			<CloseableWindow title="Settings">{this.renderForm()}</CloseableWindow>
		);
	}

	private renderForm() {
		return (
			<Form
				hideSubmitButton
				schema={this.state.schema}
				value={this.state.data}
				onFormChange={(newState) => {
					for (const key of Object.keys(newState.formData)) {
						const oldValue = this.state.data[key];
						const newValue = newState.formData[key];
						if (newValue !== oldValue) {
							electron.ipcRenderer.invoke('set-setting', key, newValue);
						}
					}
				}}
			/>
		);
	}
}

render(<SettingsWindow />);

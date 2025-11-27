import { ipcRenderer } from 'electron';
import { parse } from 'querystring';
import * as React from 'react';
import { createRoot } from 'react-dom/client';

import { OverlayIcon } from './overlay-icon';

const { icon, opens } = parse(window.location.search.substring(1));

const root = createRoot(document.body);
root.render(
	<OverlayIcon
		icon={icon as string}
		onClick={() => {
			ipcRenderer.send('show-window', opens);
		}}
	/>,
);

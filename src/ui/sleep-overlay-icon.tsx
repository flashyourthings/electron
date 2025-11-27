import Moon from '@fortawesome/fontawesome-free/svgs/regular/moon.svg';

import * as React from 'react';
import { createRoot } from 'react-dom/client';

import { screenOff } from '../screensaver';
import { OverlayIcon } from './overlay-icon';

const root = createRoot(document.body);
root.render(
	<OverlayIcon
		icon={<Moon height="1em" fill="#d3d6db" />}
		text="Sleep"
		onClick={() => {
			screenOff();
		}}
	/>,
);

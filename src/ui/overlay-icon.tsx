import * as React from 'react';
import './fonts.css';

export interface OverlayIconProps {
	icon: string | JSX.Element;
	text?: string;
	onClick: () => void;
}

export class OverlayIcon extends React.PureComponent<OverlayIconProps> {
	public render() {
		return (
			<div
				style={{
					width: '100%',
					height: '100vh',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: 'transparent',
				}}
			>
				<div
					style={{
						borderRadius: '12px',
						backgroundColor: '#3c3e42',
						padding: '4px 8px',
						fontSize: '14px',
						userSelect: 'none',
						cursor: 'pointer',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						color: '#d3d6db',
						fontWeight: 600,
					}}
					onClick={this.props.onClick.bind(this)}
				>
					{this.props.icon}
					{this.renderText()}
				</div>
			</div>
		);
	}

	private renderText() {
		if (this.props.text) {
			return (
				<>
					&nbsp;
					<span
						style={{
							color: '#75777a',
						}}
					>
						{this.props.text}
					</span>
				</>
			);
		}
	}
}

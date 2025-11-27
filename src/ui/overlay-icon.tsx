import * as React from 'react';
import styled from 'styled-components';
import './fonts.css';

export interface OverlayIconProps {
	icon: string | JSX.Element;
	text?: string;
	onClick: () => void;
}

const Container = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	pointer-events: none;
`;

const Button = styled.button`
	background-color: #3c3e42;
	border: none;
	border-radius: 12px;
	padding: 4px 10px;
	font-size: 14px;
	font-weight: 600;
	font-family: 'SourceSansPro', sans-serif;
	color: #d3d6db;
	cursor: pointer;
	user-select: none;
	display: flex;
	align-items: center;
	gap: 4px;
	pointer-events: auto;
	
	&:hover {
		background-color: #4a4c50;
	}
	
	&:active {
		background-color: #2e3034;
	}
`;

const SecondaryText = styled.span`
	color: #75777a;
`;

export const OverlayIcon: React.FC<OverlayIconProps> = ({ icon, text, onClick }) => {
	return (
		<Container>
			<Button onClick={onClick}>
				{icon}
				{text && <SecondaryText>{text}</SecondaryText>}
			</Button>
		</Container>
	);
};

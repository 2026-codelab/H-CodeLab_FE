import styled from "styled-components";

export const Body = styled.div`
	padding: 78px 100px 40px 100px;
	max-width: 1200px;
	margin: 0 auto;
`;

export const PageHeader = styled.div`
	margin-bottom: 24px;

	h1 {
		font-size: 28px;
		font-weight: 700;
		color: #1a1a1a;
		margin: 0 0 8px 0;
	}

	p {
		font-size: 14px;
		color: #666;
		margin: 0;
	}
`;

export const LanguageGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
	gap: 16px;
`;

export const LanguageCard = styled.button<{ $color: string }>`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 12px;
	padding: 24px;
	background: white;
	border: 1px solid #e5e7eb;
	border-radius: 12px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	cursor: pointer;
	text-align: left;
	font-family: inherit;
	transition: all 0.2s;

	.language-icon {
		font-size: 40px;
		color: ${(props) => props.$color};
	}

	&:hover,
	&:focus-visible {
		border-color: ${(props) => props.$color};
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
		transform: translateY(-2px);
		outline: none;
	}
`;

export const LanguageName = styled.span`
	font-size: 20px;
	font-weight: 700;
	color: #1a1a1a;
`;

export const LanguageDescription = styled.span`
	font-size: 13px;
	color: #666;
`;

import styled from "styled-components";

export const PageWrapper = styled.div<{ $theme: "light" | "dark" }>`
	height: 100vh;
	display: flex;
	flex-direction: column;
	background-color: #161b22;
	color: #eff5f2;

	${(p) =>
		p.$theme === "light" &&
		`
		background-color: #ffffff;
		color: #000000;
	`}

	& * {
		scrollbar-width: thin;
		scrollbar-color: #555 #1e1e1e;
	}
	&.light * {
		scrollbar-width: thin;
		scrollbar-color: #d1d5db #f8f9fa;
	}
	& *::-webkit-scrollbar {
		width: 8px;
		height: 8px;
	}
	& *::-webkit-scrollbar-track {
		background: #1e1e1e;
	}
	& *::-webkit-scrollbar-thumb {
		background-color: #444;
		border-radius: 10px;
	}
	&.light *::-webkit-scrollbar-track {
		background: #f8f9fa;
	}
	&.light *::-webkit-scrollbar-thumb {
		background-color: #d1d5db;
		border-radius: 10px;
	}
	&.light *::-webkit-scrollbar-thumb:hover {
		background-color: #9ca3af;
	}

	& .gutter {
		/* 패널 사이 간격은 1px 선만 남기고, 잡는 영역은 ::before로 양옆 3px씩 넓힌다 */
		position: relative;
		z-index: 10;
		padding: 0;
		background-color: #30363d !important;
		transition: background-color 0.15s ease;
		user-select: none;
		-webkit-user-select: none;
	}
	&.light .gutter {
		background-color: #d0d7de !important;
	}
	& .gutter::before {
		content: "";
		position: absolute;
	}
	& .gutter.gutter-horizontal {
		width: 1px;
		flex-shrink: 0;
		cursor: col-resize !important;
	}
	& .gutter.gutter-horizontal::before {
		top: 0;
		bottom: 0;
		left: -3px;
		right: -3px;
	}
	& .gutter.gutter-vertical {
		height: 1px;
		flex-shrink: 0;
		cursor: row-resize !important;
	}
	& .gutter.gutter-vertical::before {
		left: 0;
		right: 0;
		top: -3px;
		bottom: -3px;
	}
	& .gutter:hover,
	& .gutter:active {
		background-color: #58a6ff !important;
	}
	&.light .gutter:hover,
	&.light .gutter:active {
		background-color: #0969da !important;
	}
`;

export const LoadingContainer = styled.div<{ $theme: "light" | "dark" }>`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	background-color: ${(p) => (p.$theme === "light" ? "#ffffff" : "#161b22")};
`;

export const Header = styled.div<{ $theme: "light" | "dark" }>`
	flex-shrink: 0;
	min-height: 48px;
	max-height: 48px;
	padding: 0 24px;
	border-bottom: 1px solid ${(p) => (p.$theme === "light" ? "#e1e4e8" : "#30363d")};
	background-color: ${(p) => (p.$theme === "light" ? "#ffffff" : "#161b22")};
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

export const Breadcrumb = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`;

export const BreadcrumbLink = styled.button`
	color: #58a6ff;
	cursor: pointer;
	text-decoration: none;
	background: none;
	border: none;
	font: inherit;
	padding: 0;

	.problem-solve-page.light & {
		color: #0969da;
	}
	&:hover {
		text-decoration: underline;
	}
`;

export const BreadcrumbCurrent = styled.strong<{ $theme: "light" | "dark" }>`
	color: ${(p) => (p.$theme === "light" ? "#000000" : "#eff5f2")};
`;

export const Controls = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

export const TimerWrap = styled.div`
	display: flex;
	align-items: center;
`;

export const ThemeButton = styled.button<{
	$active?: boolean;
	$theme: "light" | "dark";
}>`
	padding: 4px 10px;
	margin-right: 4px;
	background-color: ${(p) => (p.$theme === "light" ? "#f6f8fa" : "#21262d")};
	color: ${(p) => (p.$theme === "light" ? "#24292e" : "#c9d1d9")};
	border: 1px solid ${(p) => (p.$theme === "light" ? "#e1e4e8" : "#30363d")};
	border-radius: 4px;
	cursor: pointer;

	${(p) =>
		p.$active &&
		`
		background-color: #2f81f7;
		color: #ffffff;
		border-color: #2f81f7;
	`}
`;

export const MainSplit = styled.div`
	flex: 1;
	display: flex;
	overflow: hidden;
	min-height: 0;
`;

export const ProblemSelectorWrap = styled.div`
	display: flex;
	align-items: center;
	gap: 6px;
`;

export const ProblemSelectorBtn = styled.button<{ $active?: boolean }>`
	padding: 6px 12px;
	border-radius: 6px;
	border: 1px solid #30363d;
	background-color: #21262d;
	color: #c9d1d9;
	font-size: 12px;
	font-weight: 600;
	cursor: pointer;
	white-space: nowrap;
	max-width: 200px;
	overflow: hidden;
	text-overflow: ellipsis;

	.problem-solve-page.light & {
		border-color: #e1e4e8;
		background-color: #ffffff;
		color: #24292e;
	}

	${(p) =>
		p.$active &&
		`
		border-color: #58a6ff;
		background-color: rgba(88, 166, 255, 0.15);
		color: #58a6ff;
		.problem-solve-page.light & {
			border-color: #0969da;
			background-color: rgba(9, 105, 218, 0.1);
			color: #0969da;
		}
	`}
`;

export const ProblemNavigateButton = styled.button<{ $theme: "light" | "dark" }>`
	padding: 6px 12px;
	border-radius: 6px;
	border: 1px solid ${(p) => (p.$theme === "light" ? "#e1e4e8" : "#30363d")};
	background-color: ${(p) => (p.$theme === "light" ? "#ffffff" : "#21262d")};
	color: ${(p) => (p.$theme === "light" ? "#24292e" : "#c9d1d9")};
	font-size: 12px;
	font-weight: 600;
	cursor: pointer;
	white-space: nowrap;
	transition: all 0.2s;

	&:hover {
		border-color: ${(p) => (p.$theme === "light" ? "#0969da" : "#58a6ff")};
		background-color: ${(p) =>
			p.$theme === "light" ? "rgba(9, 105, 218, 0.1)" : "rgba(88, 166, 255, 0.15)"};
		color: ${(p) => (p.$theme === "light" ? "#0969da" : "#58a6ff")};
	}
`;

export const SaveModal = styled.div`
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 10000;
	animation: fadeIn 0.2s ease-in-out;

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translate(-50%, -50%) scale(0.9);
		}
		to {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1);
		}
	}
`;

export const SaveModalContent = styled.div`
	background-color: #4a5568;
	color: white;
	padding: 20px 40px;
	border-radius: 12px;
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
	display: flex;
	align-items: center;
	gap: 12px;
	font-weight: 600;
	font-size: 16px;

	.problem-solve-page.light & {
		background-color: #718096;
	}
`;

export const SaveModalText = styled.span`
	font-size: 16px;
`;

export const OverlayModal = styled.div`
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.75);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
`;

export const OverlayModalBox = styled.div`
	background: #1e2533;
	border: 1px solid #3a4258;
	border-radius: 12px;
	padding: 36px 40px;
	max-width: 440px;
	width: 90%;
	text-align: center;
`;

export const OverlayModalTitle = styled.h2`
	font-size: 18px;
	font-weight: 700;
	color: #f0f4ff;
	margin: 0 0 16px;
`;

export const OverlayModalDesc = styled.p`
	font-size: 14px;
	color: #9aa3b8;
	line-height: 1.7;
	margin: 0 0 28px;
`;

export const OverlayModalButtons = styled.div`
	display: flex;
	gap: 12px;
	justify-content: center;
`;

export const OverlayModalConfirm = styled.button`
	padding: 10px 24px;
	border-radius: 8px;
	border: none;
	background: #4f6ef7;
	color: white;
	font-size: 14px;
	font-weight: 600;
	cursor: pointer;
	&:hover {
		background: #3b5ce0;
	}
`;

export const OverlayModalCancel = styled.button`
	padding: 10px 24px;
	border-radius: 8px;
	border: 1px solid #3a4258;
	background: transparent;
	color: #9aa3b8;
	font-size: 14px;
	font-weight: 600;
	cursor: pointer;
	&:hover {
		background: #2a3145;
		color: #f0f4ff;
	}
`;

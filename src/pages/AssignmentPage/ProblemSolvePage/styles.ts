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

	/* Scrollbar */
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

	/* Gutter (react-split) */
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
	padding: 8px 12px;
	border-bottom: 1px solid ${(p) => (p.$theme === "light" ? "#e1e4e8" : "#30363d")};
	background-color: ${(p) => (p.$theme === "light" ? "#ffffff" : "#161b22")};
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	gap: 8px;
	flex-wrap: nowrap;
	min-width: 0;
	box-sizing: border-box;
`;

/** 한 줄 헤더에서 경로 영역 — 길면 가로 스크롤 */
export const HeaderBreadcrumbWrap = styled.div`
	flex: 1 1 0;
	min-width: 0;
	overflow-x: auto;
	overflow-y: hidden;
	scrollbar-width: thin;
`;

export const ProblemToolbarRow = styled.div`
	display: flex;
	align-items: center;
	gap: 6px;
	flex-wrap: nowrap;
	flex: 0 1 auto;
	min-width: 0;
`;

export const ProblemIndexHint = styled.span<{ $theme: "light" | "dark" }>`
	font-size: 12px;
	font-weight: 600;
	color: ${(p) => (p.$theme === "light" ? "#57606a" : "#9aa4af")};
	padding: 0 4px;
`;

export const PrevNextButton = styled.button<{
	$theme: "light" | "dark";
	$disabled?: boolean;
}>`
	padding: 6px 12px;
	border-radius: 6px;
	border: 1px solid ${(p) => (p.$theme === "light" ? "#e1e4e8" : "#30363d")};
	background-color: ${(p) => (p.$theme === "light" ? "#f6f8fa" : "#21262d")};
	color: ${(p) => (p.$theme === "light" ? "#24292e" : "#c9d1d9")};
	font-size: 12px;
	font-weight: 600;
	cursor: ${(p) => (p.$disabled ? "not-allowed" : "pointer")};
	opacity: ${(p) => (p.$disabled ? 0.45 : 1)};
	white-space: nowrap;
	transition: border-color 0.2s, background-color 0.2s;

	&:hover:not(:disabled) {
		border-color: ${(p) => (p.$theme === "light" ? "#0969da" : "#58a6ff")};
		background-color: ${(p) =>
			p.$theme === "light" ? "rgba(9, 105, 218, 0.08)" : "rgba(88, 166, 255, 0.12)"};
	}
`;

export const Breadcrumb = styled.div`
	display: flex;
	align-items: center;
	gap: 6px;
	font-size: 13px;
	white-space: nowrap;
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
	gap: 8px;
	flex-shrink: 0;
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

export const SaveModalIcon = styled.span`
	font-size: 24px;
`;

export const SaveModalText = styled.span`
	font-size: 16px;
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

export const UnsavedModalOverlay = styled.div`
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.45);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 10001;
`;

export const UnsavedModalCard = styled.div<{ $theme: "light" | "dark" }>`
	width: min(92vw, 430px);
	padding: 20px;
	border-radius: 10px;
	border: 1px solid ${(p) => (p.$theme === "light" ? "#d0d7de" : "#30363d")};
	background: ${(p) => (p.$theme === "light" ? "#ffffff" : "#161b22")};
	box-shadow: 0 14px 40px rgba(0, 0, 0, 0.35);
`;

export const UnsavedModalTitle = styled.h3<{ $theme: "light" | "dark" }>`
	margin: 0 0 10px;
	font-size: 17px;
	color: ${(p) => (p.$theme === "light" ? "#24292e" : "#e6edf3")};
`;

export const UnsavedModalDesc = styled.p<{ $theme: "light" | "dark" }>`
	margin: 0;
	font-size: 14px;
	line-height: 1.5;
	color: ${(p) => (p.$theme === "light" ? "#57606a" : "#9aa4af")};
`;

export const UnsavedModalActions = styled.div`
	margin-top: 18px;
	display: flex;
	justify-content: flex-end;
	gap: 8px;
	flex-wrap: wrap;
`;

export const UnsavedModalButton = styled.button<{ $theme: "light" | "dark" }>`
	padding: 7px 12px;
	border-radius: 6px;
	border: 1px solid ${(p) => (p.$theme === "light" ? "#d0d7de" : "#30363d")};
	background: ${(p) => (p.$theme === "light" ? "#f6f8fa" : "#21262d")};
	color: ${(p) => (p.$theme === "light" ? "#24292f" : "#c9d1d9")};
	cursor: pointer;
	font-size: 13px;
`;

export const UnsavedModalPrimaryButton = styled.button<{
	$theme: "light" | "dark";
}>`
	padding: 7px 12px;
	border-radius: 6px;
	border: 1px solid #2f81f7;
	background: #2f81f7;
	color: #ffffff;
	cursor: pointer;
	font-size: 13px;
`;


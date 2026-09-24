import styled from "styled-components";

export const PageWrapper = styled.div`
	height: 100vh;
	display: flex;
	flex-direction: column;
	background-color: #161b22;
	color: #eff5f2;

	& * {
		scrollbar-width: thin;
		scrollbar-color: #555 #1e1e1e;
	}
`;

export const TopBar = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px 20px;
	background-color: #0d1117;
	border-bottom: 1px solid #30363d;
`;

export const TopBarTitle = styled.h1`
	font-size: 16px;
	font-weight: 700;
	margin: 0;
	color: #eff5f2;
`;

export const TopBarDescription = styled.span`
	font-size: 12px;
	color: #8b949e;
	margin-left: 12px;
`;

export const BackLink = styled.button`
	background: none;
	border: none;
	color: #58a6ff;
	font-size: 13px;
	cursor: pointer;
	padding: 0;
	margin-right: 16px;

	&:hover {
		text-decoration: underline;
	}
`;

export const MainSplit = styled.div`
	flex: 1;
	display: flex;
	overflow: hidden;
	min-height: 0;
`;

export const StdinTextarea = styled.textarea`
  width: 100%;
  height: 100%;
  min-height: 80px;
  padding: 10px 12px;
  border: 1px solid #30363d;
  border-radius: 4px;
  background-color: #161b22;
  color: #e1e4e8;
  outline: none;
  resize: none;
  box-sizing: border-box;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 12px;
  line-height: 1.5;

  &::placeholder {
    color: #6e7681;
  }
`;

export const OutputWrapper = styled.div`
  padding: 12px 16px;
  overflow-y: auto;
  height: 100%;
  box-sizing: border-box;
`;

export const OutputPlaceholder = styled.div`
  color: #6e7681;
  font-size: 13px;
`;

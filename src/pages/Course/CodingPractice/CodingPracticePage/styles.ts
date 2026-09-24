import styled from "styled-components";

export const StdinTextarea = styled.textarea`
  width: 100%;
  height: 100%;
  min-height: 80px;
  padding: 10px 12px;
  border: 1px solid #30363d;
  border-radius: 4px;
  background-color: #0d1117;
  color: #e1e4e8;
  outline: none;
  resize: none;
  box-sizing: border-box;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 13px;
  line-height: 1.5;

  .problem-solve-page.light & {
    background-color: #ffffff;
    color: #24292e;
    border: 1px solid #e1e4e8;
  }

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

export const LanguageSelect = styled.select`
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #30363d;
  background: #0d1117;
  color: #eff5f2;
  font-size: 13px;

  .problem-solve-page.light & {
    background: #ffffff;
    color: #24292e;
    border: 1px solid #d0d7de;
  }
`;

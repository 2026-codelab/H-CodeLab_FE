import styled from "styled-components";

/** 풀이 화면의 패널 영역 — 내용이 패널(Split) 높이를 넘지 않도록 감싼다 */
export const SolvePanel = styled.div`
  height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

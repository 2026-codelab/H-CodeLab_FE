import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const dropIn = keyframes`
  from {
    transform: translateY(-4px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const IconButton = styled.button<{ $active?: boolean }>`
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: ${(props) => (props.$active ? "#eef0fb" : "transparent")};
  color: ${(props) => (props.$active ? "#667eea" : "#6b7280")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #667eea;
  }

  &:focus-visible {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }
`;

export const Badge = styled.span`
  position: absolute;
  top: 2px;
  right: 0;
  transform: translate(25%, -25%);
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: #ef4444;
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  line-height: 18px;
  text-align: center;
  border: 2px solid white;
  box-sizing: content-box;
  pointer-events: none;
`;

export const Panel = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 380px;
  max-width: calc(100vw - 2rem);
  max-height: 480px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${dropIn} 0.15s ease;
`;

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
`;

export const PanelTitle = styled.h2`
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

export const MarkAllButton = styled.button`
  background: none;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #667eea;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #eef0fb;
  }

  &:disabled {
    color: #cbd5e1;
    cursor: default;
  }
`;

export const PanelBody = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0.75rem;
  min-height: 0;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #667eea;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #5568d3;
  }
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow: visible;
  flex: 1;
  min-height: 0;
  width: 100%;
  box-sizing: border-box;
`;

export const Item = styled.div<{ $unread?: boolean }>`
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: ${(props) => (props.$unread ? "#eff6ff" : "#f9fafb")};
  border: 1px solid ${(props) => (props.$unread ? "#3b82f6" : "#e5e7eb")};
  border-left: ${(props) => (props.$unread ? "4px solid #3b82f6" : "none")};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  max-width: 100%;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${(props) => (props.$unread ? "#3b82f6" : "#667eea")};
    transform: ${(props) => (props.$unread ? "scaleY(1)" : "scaleY(0)")};
    transition: transform 0.2s ease;
  }

  &:hover {
    background: #f0f4ff;
    border-color: #667eea;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
  }

  &:hover::before {
    transform: scaleY(1);
  }
`;

export const ItemIcon = styled.div`
  font-size: 0.9rem;
  color: #667eea;
  flex-shrink: 0;
  width: 1.75rem;
  height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
`;

export const ItemContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ItemTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
`;

export const ItemMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
`;

export const ItemSection = styled.span`
  font-weight: 500;
  color: #667eea;
`;

export const ItemTime = styled.span`
  flex-shrink: 0;
`;

export const Loading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  gap: 1rem;
`;

export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

export const Empty = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #9ca3af;
  font-size: 0.9rem;
`;

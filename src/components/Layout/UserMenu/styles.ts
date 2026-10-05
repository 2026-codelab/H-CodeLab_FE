import styled, { keyframes } from "styled-components";

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

export const Trigger = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem 0.25rem 0.25rem;
  border: none;
  border-radius: 999px;
  background: ${(props) => (props.$active ? "#eef0fb" : "transparent")};
  cursor: pointer;
  transition: background 0.2s ease;
  font-family: inherit;

  &:hover {
    background: #f3f4f6;
  }

  &:focus-visible {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    padding: 0.25rem;
  }
`;

export const Avatar = styled.span<{ $large?: boolean }>`
  width: ${(props) => (props.$large ? "40px" : "32px")};
  height: ${(props) => (props.$large ? "40px" : "32px")};
  flex-shrink: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => (props.$large ? "1rem" : "0.85rem")};
  font-weight: 700;
  user-select: none;
`;

export const TriggerName = styled.span`
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const Chevron = styled.span<{ $open?: boolean }>`
  display: flex;
  font-size: 0.65rem;
  color: #9ca3af;
  transform: rotate(${(props) => (props.$open ? "180deg" : "0deg")});
  transition: transform 0.2s ease;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const Menu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 260px;
  max-width: calc(100vw - 2rem);
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  padding: 0.5rem;
  z-index: 1001;
  animation: ${dropIn} 0.15s ease;
`;

export const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
`;

export const ProfileText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
`;

export const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  min-width: 0;
`;

export const ProfileName = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ProfileEmail = styled.span`
  font-size: 0.8rem;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const RoleBadge = styled.span`
  flex-shrink: 0;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  background: #eef0fb;
  color: #667eea;
  font-size: 0.72rem;
  font-weight: 600;
`;

export const Divider = styled.div`
  height: 1px;
  background: #e5e7eb;
  margin: 0.375rem 0;
`;

export const MenuItem = styled.button<{ $danger?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.6rem 0.625rem;
  border: none;
  border-radius: 8px;
  background: none;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: left;
  color: ${(props) => (props.$danger ? "#dc2626" : "#374151")};
  cursor: pointer;

  svg {
    width: 0.9rem;
    color: ${(props) => (props.$danger ? "#dc2626" : "#9ca3af")};
  }

  &:hover {
    background: ${(props) => (props.$danger ? "#fef2f2" : "#f3f4f6")};
  }

  &:focus-visible {
    outline: 2px solid #667eea;
    outline-offset: -2px;
  }
`;

/** 비로그인 시 상단바 로그인 버튼 (모든 상단바 공통) */
export const LoginButton = styled.button`
  padding: 0.55rem 1.25rem;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  &:focus-visible {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }
`;

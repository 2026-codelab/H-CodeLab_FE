import styled from "styled-components";

export const HeaderContainer = styled.header`
  width: 100%;
  background: white;
  border-bottom: 1px solid #e5e7eb;
`;

export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 80px;
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: opacity 0.2s ease;
  margin-left: -20px;

  &:hover {
    opacity: 0.8;
  }
`;

export const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

export const LogoText = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
  padding-left: 0;
  text-indent: 0;
`;

export const HeaderLinks = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-right: -50px;
`;

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

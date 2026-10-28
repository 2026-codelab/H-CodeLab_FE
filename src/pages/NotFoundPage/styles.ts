import styled from "styled-components";
import { Link } from "react-router-dom";

export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

export const Card = styled.main`
  background: rgba(255, 255, 255, 0.97);
  border-radius: 20px;
  box-shadow: 0 24px 60px rgba(102, 126, 234, 0.25);
  width: 100%;
  max-width: 440px;
  padding: 44px 40px 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

export const Code = styled.p`
  font-size: 72px;
  font-weight: 800;
  line-height: 1;
  margin: 0 0 16px;
  letter-spacing: -2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

export const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 10px;
  text-align: center;
  letter-spacing: -0.3px;
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  text-align: center;
  line-height: 1.7;
  margin: 0 0 28px;
  word-break: keep-all;
`;

export const HomeLink = styled(Link)`
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: all 0.2s;
  box-shadow: 0 4px 14px rgba(102, 126, 234, 0.35);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.45);
  }

  &:focus-visible {
    outline: 3px solid rgba(102, 126, 234, 0.5);
    outline-offset: 2px;
  }
`;

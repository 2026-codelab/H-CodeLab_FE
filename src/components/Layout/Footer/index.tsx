import React from "react";
import * as S from "./styles";

const Footer: React.FC = () => {
  return (
    <S.FooterContainer>
      <S.FooterWrapper>
        <S.FooterContent>
          <S.FooterText>연락처 및 기타 정보</S.FooterText>
          <S.FooterPlaceholder>
            <S.PlaceholderItem>이메일: kkim@handong.edu</S.PlaceholderItem>
            <S.PlaceholderItem>주소: 한동대학교</S.PlaceholderItem>
          </S.FooterPlaceholder>
        </S.FooterContent>
      </S.FooterWrapper>
    </S.FooterContainer>
  );
};

export default Footer;

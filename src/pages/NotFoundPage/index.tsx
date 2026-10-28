import type React from "react";
import * as S from "./styles";

/** 정의되지 않은 경로(와일드카드 라우트)에서 보여주는 404 페이지 */
const NotFoundPage: React.FC = () => {
	return (
		<S.Container>
			<S.Card>
				<S.Code aria-hidden="true">404</S.Code>
				<S.Title>페이지를 찾을 수 없습니다</S.Title>
				<S.Subtitle>
					요청하신 페이지가 존재하지 않거나 이동되었습니다.
					<br />
					주소를 다시 확인해 주세요.
				</S.Subtitle>
				<S.HomeLink to="/">홈으로 돌아가기</S.HomeLink>
			</S.Card>
		</S.Container>
	);
};

export default NotFoundPage;

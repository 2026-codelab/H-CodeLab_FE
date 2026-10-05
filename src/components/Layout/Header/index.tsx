import type React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import TutorNotificationPanel from "../../Tutor/TutorNotificationPanel";
import UserMenu from "../UserMenu";
import { LoginButton } from "../UserMenu/styles";
import * as S from "./styles";

interface HeaderProps {
	/** 이전 버전 호환용 (이름 클릭 대신 프로필 메뉴를 사용하므로 더 이상 쓰지 않음) */
	onUserNameClick?: () => void;
}

const Header: React.FC<HeaderProps> = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { logout, user, isAuthenticated } = useAuth();

	const roleLabel = user?.role === "SUPER_ADMIN" ? "시스템 관리자" : null;

	const handleLogout = async () => {
		try {
			await logout();
			navigate("/index");
		} catch (error) {
			console.error("로그아웃 실패:", error);
			navigate("/index");
		}
	};

	const handleLogin = () => {
		navigate("/login");
	};

	// 비로그인 상태면 항상 /index로. 로그인 상태에서는 로그인·/courses에서는 /index, 나머지는 /courses
	const handleLogoClick = () => {
		if (!isAuthenticated) {
			navigate("/index");
			return;
		}
		navigate(
			location.pathname === "/login" || location.pathname === "/courses"
				? "/index"
				: "/courses",
		);
	};

	return (
		<S.HeaderContainer>
			<S.HeaderWrapper>
				<S.Logo onClick={handleLogoClick}>
					<S.LogoIcon>
						<img src="/logo.svg" alt="H-CodeLab Logo" />
					</S.LogoIcon>
					<S.LogoText>H-CodeLab</S.LogoText>
				</S.Logo>
				<S.HeaderLinks>
					{isAuthenticated ? (
						<>
							<TutorNotificationPanel />
							<UserMenu roleLabel={roleLabel} onLogout={handleLogout} />
						</>
					) : (
						<LoginButton type="button" onClick={handleLogin}>
							로그인
						</LoginButton>
					)}
				</S.HeaderLinks>
			</S.HeaderWrapper>
		</S.HeaderContainer>
	);
};

export default Header;

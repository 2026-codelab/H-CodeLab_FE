import type React from "react";
import { useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import type { SuperAdminRouteProps } from "./types";

const SuperAdminRoute: React.FC<SuperAdminRouteProps> = ({ children }) => {
	const { user, isAuthenticated, loading } = useAuth();
	const location = useLocation();
	const alerted = useRef(false);

	// 새로고침 시 토큰 복원 후 /user/me 응답 전까지는 user가 비어 있으므로 확인 중으로 처리
	const checking = loading || (isAuthenticated && !user);
	const isSuperAdmin = user?.role === "SUPER_ADMIN";
	const denied = !checking && isAuthenticated && !isSuperAdmin;

	useEffect(() => {
		if (denied && !alerted.current) {
			alerted.current = true;
			alert("시스템 관리자만 접근할 수 있습니다.");
		}
	}, [denied]);

	if (checking) {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "100vh",
					fontSize: "1.2rem",
				}}
			>
				인증 확인 중...
			</div>
		);
	}

	if (!isAuthenticated) {
		return (
			<Navigate
				to="/login"
				replace
				state={{ redirectTo: `${location.pathname}${location.search}` }}
			/>
		);
	}

	if (!isSuperAdmin) {
		return <Navigate to="/index" replace />;
	}

	return <>{children}</>;
};

export default SuperAdminRoute;

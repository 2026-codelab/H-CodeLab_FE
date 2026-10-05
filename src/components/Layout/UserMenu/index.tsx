import type React from "react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	FaChevronDown,
	FaCog,
	FaGraduationCap,
	FaPencilAlt,
	FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../../../hooks/useAuth";
import { useDropdownDismiss } from "../../../hooks/useDropdownDismiss";
import * as S from "./styles";

interface UserMenuProps {
	/** 메뉴 상단에 표시할 역할 (예: 강의자, 튜터, 시스템 관리자) */
	roleLabel?: string | null;
	onLogout: () => void;
}

/**
 * 상단바 프로필 아바타 + 드롭다운 메뉴
 * 관리 페이지(TutorHeader)와 일반 페이지(Header)에서 공통 사용
 */
const UserMenu: React.FC<UserMenuProps> = ({ roleLabel, onLogout }) => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const [open, setOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	useDropdownDismiss(containerRef, open, () => setOpen(false));

	const displayName = user?.name || user?.username || user?.email || "";
	const initial = displayName.trim().charAt(0).toUpperCase() || "?";
	const isSuperAdmin = user?.role === "SUPER_ADMIN";

	const go = (path: string) => {
		setOpen(false);
		navigate(path);
	};

	return (
		<S.Container ref={containerRef}>
			<S.Trigger
				type="button"
				onClick={() => setOpen((prev) => !prev)}
				aria-haspopup="menu"
				aria-expanded={open}
				aria-label={`${displayName} 계정 메뉴`}
				$active={open}
			>
				<S.Avatar aria-hidden="true">{initial}</S.Avatar>
				<S.TriggerName>{displayName}</S.TriggerName>
				<S.Chevron $open={open} aria-hidden="true">
					<FaChevronDown />
				</S.Chevron>
			</S.Trigger>

			{open && (
				<S.Menu role="menu">
					<S.Profile>
						<S.Avatar $large aria-hidden="true">
							{initial}
						</S.Avatar>
						<S.ProfileText>
							<S.ProfileName>{displayName}</S.ProfileName>
							{user?.email && user.email !== displayName && (
								<S.ProfileEmail>{user.email}</S.ProfileEmail>
							)}
							{roleLabel && <S.RoleBadge>{roleLabel}</S.RoleBadge>}
						</S.ProfileText>
					</S.Profile>

					<S.Divider />

					<S.MenuItem
						type="button"
						role="menuitem"
						onClick={() => go("/courses")}
					>
						<FaGraduationCap />내 강의실
					</S.MenuItem>
					<S.MenuItem
						type="button"
						role="menuitem"
						onClick={() => go("/tutor")}
					>
						<FaPencilAlt />
						관리 페이지
					</S.MenuItem>
					{isSuperAdmin && (
						<S.MenuItem
							type="button"
							role="menuitem"
							onClick={() => go("/super-admin")}
						>
							<FaCog />
							시스템 관리
						</S.MenuItem>
					)}

					<S.Divider />

					<S.MenuItem
						type="button"
						role="menuitem"
						$danger
						onClick={() => {
							setOpen(false);
							onLogout();
						}}
					>
						<FaSignOutAlt />
						로그아웃
					</S.MenuItem>
				</S.Menu>
			)}
		</S.Container>
	);
};

export default UserMenu;

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaComments } from "react-icons/fa";
import { useDropdownDismiss } from "../../../hooks/useDropdownDismiss";
import { useNotifications } from "../../../hooks/useNotifications";
import { getNotificationTargetPath } from "../../../utils/notificationUtils";
import type { NotificationItem } from "../../../utils/notificationUtils";
import * as S from "./styles";

// 플로팅 버튼 시절 저장하던 위치 키 (상단바로 옮기면서 더 이상 쓰지 않음)
const LEGACY_POSITION_STORAGE_KEYS = [
	"tutor_notification_position",
	"tutor_notification_position_v2",
];

/**
 * TutorNotificationPanel - 상단바 알림 버튼 + 드롭다운
 *
 * 상단바에 고정된 알림 아이콘을 누르면 아래로 알림 목록이 열립니다.
 * 바깥 클릭, Esc, 페이지 이동 시 닫힙니다.
 * 알림 데이터는 useNotifications(공통 상태)에서 가져옵니다.
 */
const TutorNotificationPanel: React.FC = () => {
	const navigate = useNavigate();
	const {
		notifications,
		unreadCount,
		loading: loadingNotifications,
		markAllAsRead,
	} = useNotifications();
	const [showNotificationPanel, setShowNotificationPanel] =
		useState<boolean>(false);
	const [markingAllRead, setMarkingAllRead] = useState<boolean>(false);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		try {
			for (const key of LEGACY_POSITION_STORAGE_KEYS) {
				localStorage.removeItem(key);
			}
		} catch {
			// localStorage 접근 불가 시 무시
		}
	}, []);

	// 바깥 클릭 · Esc · 페이지 이동 시 닫기
	useDropdownDismiss(containerRef, showNotificationPanel, () =>
		setShowNotificationPanel(false),
	);

	// 알림 아이템 클릭
	const handleNotificationClick = (
		notif: NotificationItem,
		e: React.MouseEvent,
	) => {
		e.stopPropagation();
		const targetPath = getNotificationTargetPath(notif);
		if (targetPath) {
			navigate(targetPath);
			setShowNotificationPanel(false);
		}
	};

	// 모두 읽음
	const handleMarkAllAsRead = async () => {
		if (unreadCount === 0 || markingAllRead) return;
		try {
			setMarkingAllRead(true);
			await markAllAsRead();
		} catch (error) {
			console.error("모두 읽음 처리 실패:", error);
			alert("알림을 읽음 처리하지 못했습니다.");
		} finally {
			setMarkingAllRead(false);
		}
	};

	return (
		<S.Container ref={containerRef}>
			<S.IconButton
				type="button"
				onClick={() => setShowNotificationPanel((prev) => !prev)}
				aria-label={
					unreadCount > 0 ? `알림 (읽지 않은 알림 ${unreadCount}개)` : "알림"
				}
				aria-haspopup="true"
				aria-expanded={showNotificationPanel}
				$active={showNotificationPanel}
			>
				<FaBell />
				{unreadCount > 0 && (
					<S.Badge>{unreadCount > 99 ? "99+" : unreadCount}</S.Badge>
				)}
			</S.IconButton>

			{showNotificationPanel && (
				<S.Panel role="dialog" aria-label="알림">
					<S.PanelHeader>
						<S.PanelTitle>알림</S.PanelTitle>
						<S.MarkAllButton
							type="button"
							onClick={handleMarkAllAsRead}
							disabled={unreadCount === 0 || markingAllRead}
						>
							모두 읽음
						</S.MarkAllButton>
					</S.PanelHeader>
					<S.PanelBody>
						{loadingNotifications ? (
							<S.Loading>
								<S.LoadingSpinner />
								<p>알림을 불러오는 중...</p>
							</S.Loading>
						) : notifications.length > 0 ? (
							<S.List>
								{notifications.map((notif, index) => (
									<S.Item
										key={notif.id || index}
										$unread={!notif.isRead}
										onClick={(e) => handleNotificationClick(notif, e)}
									>
										<S.ItemIcon>
											{notif.type === "QUESTION_COMMENT" ||
											notif.type === "COMMENT_ACCEPTED" ? (
												<FaComments />
											) : (
												<FaBell />
											)}
										</S.ItemIcon>
										<S.ItemContent>
											<S.ItemTitle>{notif.displayTitle}</S.ItemTitle>
											<S.ItemMeta>
												<S.ItemSection>{notif.sectionTitle}</S.ItemSection>
												<S.ItemTime>
													{new Date(notif.createdAt).toLocaleString("ko-KR", {
														year: "numeric",
														month: "2-digit",
														day: "2-digit",
														hour: "2-digit",
														minute: "2-digit",
													})}
												</S.ItemTime>
											</S.ItemMeta>
										</S.ItemContent>
									</S.Item>
								))}
							</S.List>
						) : (
							<S.Empty>
								<p>알림이 없습니다.</p>
							</S.Empty>
						)}
					</S.PanelBody>
				</S.Panel>
			)}
		</S.Container>
	);
};

export default TutorNotificationPanel;

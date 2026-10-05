import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBell, FaComments } from "react-icons/fa";
import APIService from "../../../services/APIService";
import * as S from "./styles";


interface Section {
	sectionId: number;
	courseTitle: string;
}

interface Notification {
	id: number;
	type: string;
	sectionId?: number;
	noticeId?: number;
	noticeTitle?: string;
	assignmentId?: number;
	assignmentTitle?: string;
	questionId?: number;
	message?: string;
	courseTitle?: string;
	createdAt: string;
	isRead: boolean;
	displayTitle?: string;
	displayLink?: string | null;
	sectionTitle?: string;
}

// 플로팅 버튼 시절 저장하던 위치 키 (상단바로 옮기면서 더 이상 쓰지 않음)
const LEGACY_POSITION_STORAGE_KEYS = [
	"tutor_notification_position",
	"tutor_notification_position_v2",
];

/**
 * TutorNotificationPanel - 튜터 페이지 상단바 알림 버튼 + 드롭다운
 *
 * 상단바(TutorHeader)에 고정된 알림 아이콘을 누르면 아래로 알림 목록이 열립니다.
 * 바깥 클릭, Esc, 페이지 이동 시 닫힙니다.
 */
const TutorNotificationPanel: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [loadingNotifications, setLoadingNotifications] =
		useState<boolean>(false);
	const [showNotificationPanel, setShowNotificationPanel] =
		useState<boolean>(false);
	const [unreadCount, setUnreadCount] = useState<number>(0);
	const [sections, setSections] = useState<Section[]>([]);
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

	// 바깥 클릭 · Esc로 닫기
	useEffect(() => {
		if (!showNotificationPanel) return;

		const handleMouseDown = (e: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			) {
				setShowNotificationPanel(false);
			}
		};
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") setShowNotificationPanel(false);
		};

		document.addEventListener("mousedown", handleMouseDown);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("mousedown", handleMouseDown);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [showNotificationPanel]);

	// 페이지 이동 시 닫기
	useEffect(() => {
		setShowNotificationPanel(false);
	}, [location.pathname]);


	// 수업 목록 가져오기
	useEffect(() => {
		const fetchSections = async () => {
			try {
				const dashboardResponse = await APIService.getInstructorDashboard();
				const dashboardData = dashboardResponse?.data || [];
				setSections(dashboardData);
			} catch (error) {
				console.error("수업 목록 조회 실패:", error);
			}
		};
		fetchSections();
	}, []);

	// 알림 조회
	const fetchNotifications = async () => {
		try {
			setLoadingNotifications(true);
			const notificationsResponse = await APIService.getCommunityNotifications(
				null,
				0,
				20,
			);
			const notificationsList = notificationsResponse.data?.content || [];

			const processedNotifications = notificationsList.map((notif: any) => {
				let title = "";
				let link: string | null = null;
				let sectionTitle = "";

				switch (notif.type) {
					case "NOTICE_CREATED":
						title = notif.noticeTitle || "공지사항";
						link =
							notif.sectionId && notif.noticeId
								? `/sections/${notif.sectionId}/course-notices/${notif.noticeId}`
								: null;
						break;
					case "ASSIGNMENT_CREATED":
						title = notif.assignmentTitle || "새 과제";
						link =
							notif.sectionId && notif.assignmentId
								? `/sections/${notif.sectionId}/course-assignments?assignmentId=${notif.assignmentId}`
								: null;
						break;
					case "QUESTION_COMMENT":
						title = notif.message || "커뮤니티에 새 댓글이 달렸습니다";
						link =
							notif.sectionId && notif.questionId
								? `/sections/${notif.sectionId}/community/${notif.questionId}`
								: null;
						break;
					case "COMMENT_ACCEPTED":
						title = notif.message || "댓글이 채택되었습니다";
						link =
							notif.sectionId && notif.questionId
								? `/sections/${notif.sectionId}/community/${notif.questionId}`
								: null;
						break;
					default:
						title = notif.message || "알림";
						link = notif.sectionId
							? `/sections/${notif.sectionId}/community`
							: null;
				}

				if (notif.courseTitle) {
					sectionTitle = notif.courseTitle;
				} else {
					const section = sections.find((s) => s.sectionId === notif.sectionId);
					if (section) {
						sectionTitle = section.courseTitle;
					}
				}

				return {
					...notif,
					displayTitle: title,
					displayLink: link,
					sectionTitle: sectionTitle || "알 수 없는 수업",
					createdAt: notif.createdAt,
				};
			});

			setNotifications(processedNotifications);
			const unread = processedNotifications.filter((n) => !n.isRead).length;
			setUnreadCount(unread);
		} catch (error) {
			console.error("알림 조회 실패:", error);
			setNotifications([]);
			setUnreadCount(0);
		} finally {
			setLoadingNotifications(false);
		}
	};

	useEffect(() => {
		fetchNotifications();
	}, []);

	useEffect(() => {
		if (sections.length > 0) {
			fetchNotifications();
		}
	}, [sections]);

	// 알림 아이템 클릭
	const handleNotificationClick = (
		notif: Notification,
		e: React.MouseEvent,
	) => {
		e.stopPropagation();
		let targetPath: string | null = null;

		switch (notif.type) {
			case "NOTICE_CREATED":
				if (notif.sectionId && notif.noticeId) {
					targetPath = `/sections/${notif.sectionId}/course-notices/${notif.noticeId}`;
				} else if (notif.sectionId) {
					targetPath = `/sections/${notif.sectionId}/course-notices`;
				}
				break;
			case "ASSIGNMENT_CREATED":
				if (notif.sectionId && notif.assignmentId) {
					targetPath = `/sections/${notif.sectionId}/course-assignments?assignmentId=${notif.assignmentId}`;
				} else if (notif.sectionId) {
					targetPath = `/sections/${notif.sectionId}/course-assignments`;
				}
				break;
			case "QUESTION_COMMENT":
			case "COMMENT_ACCEPTED":
			case "COMMENT_REPLY":
				if (notif.sectionId && notif.questionId) {
					targetPath = `/sections/${notif.sectionId}/community/${notif.questionId}`;
				} else if (notif.sectionId) {
					targetPath = `/sections/${notif.sectionId}/community`;
				}
				break;
			default:
				if (notif.displayLink) {
					targetPath = notif.displayLink;
				} else if (notif.sectionId) {
					targetPath = `/sections/${notif.sectionId}/community`;
				}
		}

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
			await APIService.markAllNotificationsAsRead();
			setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
			setUnreadCount(0);
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

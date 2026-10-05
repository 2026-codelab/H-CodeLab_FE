import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { authState, notificationState } from "../recoil/atoms";
import APIService from "../services/APIService";
import { toDisplayNotification } from "../utils/notificationUtils";
import type { NotificationSection } from "../utils/notificationUtils";

/** 상단바에 보여줄 최근 알림 개수 */
const RECENT_NOTIFICATION_SIZE = 20;

// 여러 상단바가 동시에 마운트돼도 같은 사용자 알림은 한 번만 불러오도록 진행 중인 사용자 기록
let loadingUserId: number | null = null;

/**
 * 상단바 알림 데이터 공통 훅
 * - 알림은 recoil(notificationState)에 보관해서, 페이지 이동으로 상단바가 다시 마운트돼도 다시 부르지 않음
 * - 로그인 사용자가 바뀌면 새로 불러오고, 로그아웃하면 비움
 */
export function useNotifications() {
	const auth = useRecoilValue(authState);
	const userId: number | null = auth.user?.id ?? null;
	const [state, setState] = useRecoilState(notificationState);

	const load = useCallback(
		async (targetUserId: number) => {
			setState((prev) => ({
				...(prev.userId === targetUserId
					? prev
					: { items: [], unreadCount: 0, loaded: false }),
				userId: targetUserId,
				loading: true,
			}));

			try {
				const [dashboardResponse, notificationsResponse] = await Promise.all([
					APIService.getInstructorDashboard().catch(() => null),
					APIService.getCommunityNotifications(
						null,
						0,
						RECENT_NOTIFICATION_SIZE,
					),
				]);
				const sections: NotificationSection[] = dashboardResponse?.data || [];
				const items = (notificationsResponse?.data?.content || []).map(
					(notif: any) => toDisplayNotification(notif, sections),
				);

				setState({
					userId: targetUserId,
					items,
					unreadCount: items.filter((n) => !n.isRead).length,
					loaded: true,
					loading: false,
				});
			} catch (error) {
				console.error("알림 조회 실패:", error);
				setState({
					userId: targetUserId,
					items: [],
					unreadCount: 0,
					loaded: true,
					loading: false,
				});
			}
		},
		[setState],
	);

	useEffect(() => {
		if (userId === null) {
			// 로그아웃: 이전 사용자의 알림이 남지 않도록 비움
			if (state.userId !== null) {
				setState({
					userId: null,
					items: [],
					unreadCount: 0,
					loaded: false,
					loading: false,
				});
			}
			return;
		}
		if (state.userId === userId && (state.loaded || state.loading)) return;
		if (loadingUserId === userId) return;

		loadingUserId = userId;
		load(userId).finally(() => {
			if (loadingUserId === userId) loadingUserId = null;
		});
	}, [userId, state.userId, state.loaded, state.loading, load, setState]);

	/** 모두 읽음 처리 (서버 반영 후 로컬 상태 갱신, 실패 시 예외 전달) */
	const markAllAsRead = useCallback(async () => {
		await APIService.markAllNotificationsAsRead();
		setState((prev) => ({
			...prev,
			items: prev.items.map((n) => ({ ...n, isRead: true })),
			unreadCount: 0,
		}));
	}, [setState]);

	return {
		notifications: state.items,
		unreadCount: state.unreadCount,
		loading: state.loading || (userId !== null && !state.loaded),
		markAllAsRead,
	};
}

/**
 * 상단바 알림 공통 유틸
 * - 서버 알림 데이터를 화면 표시용으로 변환
 * - 알림 클릭 시 이동할 경로 계산
 */

export interface NotificationSection {
	sectionId: number;
	courseTitle: string;
}

export interface NotificationItem {
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

/** 서버 알림 1건을 화면 표시용(제목·링크·수업명)으로 변환 */
export function toDisplayNotification(
	// 서버 응답 원본
	notif: any,
	sections: NotificationSection[],
): NotificationItem {
	let title = "";
	let link: string | null = null;

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
			link = notif.sectionId ? `/sections/${notif.sectionId}/community` : null;
	}

	const sectionTitle =
		notif.courseTitle ||
		sections.find((s) => s.sectionId === notif.sectionId)?.courseTitle ||
		"";

	return {
		...notif,
		displayTitle: title,
		displayLink: link,
		sectionTitle: sectionTitle || "알 수 없는 수업",
		createdAt: notif.createdAt,
	};
}

/** 알림 클릭 시 이동할 경로 (이동할 곳이 없으면 null) */
export function getNotificationTargetPath(
	notif: NotificationItem,
): string | null {
	switch (notif.type) {
		case "NOTICE_CREATED":
			if (notif.sectionId && notif.noticeId) {
				return `/sections/${notif.sectionId}/course-notices/${notif.noticeId}`;
			}
			return notif.sectionId
				? `/sections/${notif.sectionId}/course-notices`
				: null;
		case "ASSIGNMENT_CREATED":
			if (notif.sectionId && notif.assignmentId) {
				return `/sections/${notif.sectionId}/course-assignments?assignmentId=${notif.assignmentId}`;
			}
			return notif.sectionId
				? `/sections/${notif.sectionId}/course-assignments`
				: null;
		case "QUESTION_COMMENT":
		case "COMMENT_ACCEPTED":
		case "COMMENT_REPLY":
			if (notif.sectionId && notif.questionId) {
				return `/sections/${notif.sectionId}/community/${notif.questionId}`;
			}
			return notif.sectionId ? `/sections/${notif.sectionId}/community` : null;
		default:
			if (notif.displayLink) return notif.displayLink;
			return notif.sectionId ? `/sections/${notif.sectionId}/community` : null;
	}
}

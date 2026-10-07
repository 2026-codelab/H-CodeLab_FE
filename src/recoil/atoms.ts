import { atom } from "recoil";
import type { NotificationItem } from "../utils/notificationUtils";

interface User {
	id: number;
	name?: string;
	username?: string;
	email: string;
	role?: string;
	[key: string]: any;
}

interface AuthState {
	isAuthenticated: boolean;
	user: User | null;
	accessToken: string | null;
	loading: boolean;
	error: string | null;
}

interface OnboardingState {
	currentStep: number;
	isCompleted: boolean;
	userPreferences: { [key: string]: any };
}

export const authState = atom<AuthState>({
	key: "authState",
	default: {
		isAuthenticated: false,
		user: null,
		accessToken: null,
		loading: true,
		error: null,
	},
});

export const onboardingState = atom<OnboardingState>({
	key: "onboardingState",
	default: {
		currentStep: 0,
		isCompleted: false,
		userPreferences: {},
	},
});

export const sidebarCollapsedState = atom<boolean>({
	key: "sidebarCollapsedState",
	default: false,
});

/**
 * 상단바 알림 상태 (페이지 이동으로 상단바가 다시 마운트돼도 유지)
 * userId: 이 데이터를 불러온 사용자 — 다른 사용자로 바뀌면 다시 불러옴
 */
export interface NotificationStoreState {
	userId: number | null;
	items: NotificationItem[];
	unreadCount: number;
	loaded: boolean;
	loading: boolean;
}

export const notificationState = atom<NotificationStoreState>({
	key: "notificationState",
	default: {
		userId: null,
		items: [],
		unreadCount: 0,
		loaded: false,
		loading: false,
	},
});

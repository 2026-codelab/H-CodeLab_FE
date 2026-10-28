import { fetchEventSource } from "@microsoft/fetch-event-source";
import type { EventSourceMessage } from "@microsoft/fetch-event-source";
import tokenManager from "./tokenManager";

/**
 * SSE 연결 중 인증이 만료된 것으로 확인되어 더 이상 진행할 수 없을 때 던진다.
 * message가 사용자에게 그대로 보여줄 수 있는 문구로 채워져 있다.
 */
export class SSEAuthExpiredError extends Error {
	constructor(message = "세션이 만료되었습니다. 다시 로그인해주세요.") {
		super(message);
		this.name = "SSEAuthExpiredError";
	}
}

interface ConnectAuthenticatedSSEOptions {
	signal: AbortSignal;
	openWhenHidden?: boolean;
	onmessage: (event: EventSourceMessage) => void;
}

/**
 * 인증 토큰을 자동으로 갱신하는 SSE 연결.
 *
 * 일반 API 호출(APIService.request())은 401을 받으면 토큰을 갱신하고
 * 재시도하는데, fetchEventSource는 이 로직을 안 거쳐서 토큰이 만료된
 * 채로 열리면 그대로 실패했다. 이 헬퍼는 onopen에서 401을 감지해
 * refreshToken()을 한 번 시도하고, 성공하면 새 토큰으로 다시 연결한다.
 * 갱신도 실패하면 tokenManager.handleTokenExpired()를 호출해 기존
 * 전역 처리(알림 + 로그인 페이지 이동, useAuth.ts에 등록됨)로 넘기고
 * SSEAuthExpiredError를 던진다. 호출부는 기존처럼 catch한 에러의
 * message를 보여주면 된다.
 */
export async function connectAuthenticatedSSE(
	url: string,
	{ signal, openWhenHidden = true, onmessage }: ConnectAuthenticatedSSEOptions,
): Promise<void> {
	const attempt = async (alreadyRetried: boolean): Promise<void> => {
		const token = tokenManager.getAccessToken();
		try {
			await fetchEventSource(url, {
				method: "GET",
				headers: token ? { Authorization: `Bearer ${token}` } : {},
				signal,
				openWhenHidden,
				async onopen(response) {
					if (response.ok) return;
					if (response.status === 401) {
						throw new SSEAuthExpiredError();
					}
					throw new Error(`연결에 실패했습니다. (HTTP ${response.status})`);
				},
				onmessage,
				onerror(err) {
					// 던져야 fetchEventSource 자체의 자동 재시도를 막고 호출부로 에러가 전달된다.
					throw err;
				},
			});
		} catch (err) {
			if (signal.aborted) return;
			if (err instanceof SSEAuthExpiredError) {
				if (!alreadyRetried) {
					try {
						await tokenManager.refreshToken();
					} catch {
						tokenManager.handleTokenExpired();
						throw err;
					}
					return attempt(true);
				}
				tokenManager.handleTokenExpired();
			}
			throw err;
		}
	};

	return attempt(false);
}

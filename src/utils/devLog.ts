/* eslint-disable no-console */

/**
 * 개발 환경에서만 출력되는 디버그 로그.
 *
 * 프로덕션 빌드(main.js 번들)에도 console.log가 그대로 남아있어서,
 * 내부 API 응답(학생 제출/과제 데이터 등) 원본이 브라우저 콘솔에
 * 노출되던 문제가 있었다. NODE_ENV가 "production"이 아닐 때만 찍도록
 * 하여, 개발 중 디버깅 편의는 유지하면서 배포본에는 남지 않게 한다.
 */
export function devLog(...args: unknown[]): void {
	if (process.env.NODE_ENV !== "production") {
		console.log(...args);
	}
}

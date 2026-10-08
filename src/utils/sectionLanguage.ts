/**
 * 수업 언어 (수업 생성·복사 때 교수님이 선택). 과제·코딩테스트는 이 언어로만 풀이·제출한다.
 */
export const SECTION_LANGUAGES = ["c", "cpp", "java", "python"];

/**
 * 섹션 정보의 language 값을 에디터·제출에 쓰는 언어 키로 변환합니다.
 * 언어가 없는 기존 수업이나 알 수 없는 값은 C로 취급합니다 (BE와 동일).
 */
export const toSectionLanguage = (language?: string | null): string => {
	const normalized = (language ?? "").trim().toLowerCase();
	return SECTION_LANGUAGES.includes(normalized) ? normalized : "c";
};

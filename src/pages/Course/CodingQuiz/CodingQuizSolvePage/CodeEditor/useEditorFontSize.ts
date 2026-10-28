import { useCallback, useEffect, useMemo, useState } from "react";
import { EditorView, keymap } from "@codemirror/view";

const STORAGE_KEY = "hcl.codeEditor.fontSize";
/** 기존 에디터에 실제로 적용되던 크기 (페이지에서 상속된 16px) */
export const DEFAULT_FONT_SIZE = 16;
export const MIN_FONT_SIZE = 10;
export const MAX_FONT_SIZE = 28;

const clamp = (size: number) => Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, size));

const readStoredSize = () => {
	try {
		const stored = Number(window.localStorage.getItem(STORAGE_KEY));
		return Number.isFinite(stored) && stored > 0 ? clamp(stored) : DEFAULT_FONT_SIZE;
	} catch {
		return DEFAULT_FONT_SIZE;
	}
};

/**
 * 에디터 글꼴 크기 조절 — 브라우저(localStorage)에 기억한다.
 * 에디터에 포커스가 있을 때 Ctrl/Cmd + = / - / 0 으로 조절하며, 이때는 브라우저 확대/축소 대신 동작한다.
 */
export function useEditorFontSize() {
	const [fontSize, setFontSize] = useState(readStoredSize);

	useEffect(() => {
		try {
			window.localStorage.setItem(STORAGE_KEY, String(fontSize));
		} catch {
			// 저장소를 쓸 수 없는 환경(시크릿 모드 등)에서는 기억하지 않고 계속 동작
		}
	}, [fontSize]);

	const increase = useCallback(() => setFontSize((size) => clamp(size + 1)), []);
	const decrease = useCallback(() => setFontSize((size) => clamp(size - 1)), []);
	const reset = useCallback(() => setFontSize(DEFAULT_FONT_SIZE), []);

	const fontSizeTheme = useMemo(
		() => EditorView.theme({ "&": { fontSize: `${fontSize}px` } }),
		[fontSize],
	);

	const fontSizeKeymap = useMemo(() => {
		const run = (action: () => void) => () => {
			action();
			return true;
		};
		return keymap.of([
			{ key: "Mod-=", run: run(increase) },
			{ key: "Mod-+", run: run(increase) },
			{ key: "Mod--", run: run(decrease) },
			{ key: "Mod-0", run: run(reset) },
		]);
	}, [increase, decrease, reset]);

	return { fontSize, increase, decrease, reset, fontSizeExtensions: [fontSizeTheme, fontSizeKeymap] };
}

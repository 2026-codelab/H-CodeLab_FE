import { useEffect, useRef } from "react";

/**
 * Ctrl/Cmd + Enter → 테스트하기.
 * CodeMirror 기본 키맵의 Mod-Enter(빈 줄 삽입)보다 먼저 잡도록 window capture 단계에서 처리한다.
 * 에디터 밖의 다른 입력창(textarea 등)에서 누른 경우는 건드리지 않는다.
 */
export function useRunShortcut(onRun: () => void, disabled: boolean) {
	const onRunRef = useRef(onRun);
	const disabledRef = useRef(disabled);
	onRunRef.current = onRun;
	disabledRef.current = disabled;

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key !== "Enter" || !(event.ctrlKey || event.metaKey)) return;
			if (event.shiftKey || event.altKey || event.isComposing) return;

			const target = event.target as HTMLElement | null;
			const inEditor = Boolean(target?.closest?.(".cm-editor"));
			const inOtherInput =
				!inEditor &&
				(target?.tagName === "INPUT" ||
					target?.tagName === "TEXTAREA" ||
					Boolean(target?.isContentEditable));
			if (inOtherInput) return;

			event.preventDefault();
			event.stopPropagation();
			if (event.repeat || disabledRef.current) return;
			onRunRef.current();
		};

		window.addEventListener("keydown", handleKeyDown, true);
		return () => window.removeEventListener("keydown", handleKeyDown, true);
	}, []);
}

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { useLocation } from "react-router-dom";

/**
 * 드롭다운 닫기 공통 처리
 * - 바깥 클릭, Esc, 페이지 이동 시 onClose 호출
 */
export function useDropdownDismiss(
	ref: RefObject<HTMLElement | null>,
	open: boolean,
	onClose: () => void,
) {
	const location = useLocation();
	const onCloseRef = useRef(onClose);
	onCloseRef.current = onClose;

	useEffect(() => {
		if (!open) return;

		const handleMouseDown = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				onCloseRef.current();
			}
		};
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onCloseRef.current();
		};

		document.addEventListener("mousedown", handleMouseDown);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("mousedown", handleMouseDown);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [open, ref]);

	useEffect(() => {
		onCloseRef.current();
	}, [location.pathname]);
}

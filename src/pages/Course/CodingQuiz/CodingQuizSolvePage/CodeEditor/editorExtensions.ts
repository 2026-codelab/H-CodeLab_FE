import {
	Decoration,
	type DecorationSet,
	type EditorView,
	MatchDecorator,
	ViewPlugin,
	type ViewUpdate,
} from "@codemirror/view";
import { indentationMarkers } from "@replit/codemirror-indentation-markers";

/** 들여쓰기 깊이를 세로선으로 표시 (커서가 있는 블록은 진하게) */
const indentGuides = indentationMarkers({
	highlightActiveBlock: true,
	markerType: "fullScope",
	thickness: 1,
	colors: {
		light: "#e1e4e8",
		activeLight: "#afb8c1",
		dark: "#21262d",
		activeDark: "#484f58",
	},
});

/**
 * 탭 문자를 화살표로 표시한다 (.cm-highlightTab은 CodeMirror 기본 스타일).
 * 들여쓰기는 공백 4칸이므로, 다른 곳에서 붙여넣은 탭이 섞이면 눈에 보이게 해
 * Python 탭/공백 혼용 오류(IndentationError)를 미리 알아챌 수 있게 한다.
 */
const tabMatcher = new MatchDecorator({
	regexp: /\t/g,
	decoration: Decoration.mark({ class: "cm-highlightTab" }),
});

const highlightTabs = ViewPlugin.fromClass(
	class {
		decorations: DecorationSet;

		constructor(view: EditorView) {
			this.decorations = tabMatcher.createDeco(view);
		}

		update(update: ViewUpdate) {
			this.decorations = tabMatcher.updateDeco(update, this.decorations);
		}
	},
	{ decorations: (plugin) => plugin.decorations },
);

export const indentationVisuals = [indentGuides, highlightTabs];

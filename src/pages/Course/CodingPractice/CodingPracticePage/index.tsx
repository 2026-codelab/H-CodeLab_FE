import { useCallback, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Split from "react-split";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import DraggablePanel from "../../CodingQuiz/CodingQuizSolvePage/DraggablePanel";
import * as ES from "../../CodingQuiz/CodingQuizSolvePage/CodeEditor/styles";
import * as RS from "../../CodingQuiz/CodingQuizSolvePage/ExecutionResult/styles";
import * as DS from "../../CodingQuiz/CodingQuizSolvePage/ProblemDescription/styles";
import * as PS from "../../../AssignmentPage/ProblemSolvePage/styles";
import apiService from "../../../../services/APIService";
import tokenManager from "../../../../utils/tokenManager";
import * as S from "./styles";

type Language = "c" | "cpp" | "java" | "python";
type PanelKey = "editor" | "stdin" | "output";
type PanelLayout = { left: PanelKey; topRight: PanelKey; bottomRight: PanelKey };
type Theme = "light" | "dark";

const DEFAULT_CODE: Record<Language, string> = {
	c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, world!\\n");\n    return 0;\n}\n',
	cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, world!" << std::endl;\n    return 0;\n}\n',
	java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, world!");\n    }\n}\n',
	python: 'print("Hello, world!")\n',
};

type RunState =
	| { status: "idle" }
	| { status: "running" }
	| { status: "output"; output: string; outputError: string }
	| { status: "ce"; outputCompile: string }
	| { status: "error"; message: string };

function getLanguageExtension(language: Language) {
	switch (language) {
		case "java":
			return [java()];
		case "python":
			return [python()];
		case "cpp":
		case "c":
		default:
			return [cpp()]; // CodeMirror에 별도 C 모드가 없어 C++ 하이라이팅을 재사용
	}
}

export default function CodingPracticePage() {
	const { sectionId } = useParams<{ sectionId: string }>();
	const navigate = useNavigate();
	const [theme, setTheme] = useState<Theme>("light");
	const [language, setLanguage] = useState<Language>("c");
	const [code, setCode] = useState(DEFAULT_CODE.c);
	const [stdin, setStdin] = useState("");
	const [runState, setRunState] = useState<RunState>({ status: "idle" });
	const [panelLayout, setPanelLayout] = useState<PanelLayout>({
		left: "editor",
		topRight: "stdin",
		bottomRight: "output",
	});
	const abortRef = useRef<AbortController | null>(null);

	const handlePanelMove = useCallback((draggedId: string, targetId: string) => {
		if (draggedId === targetId) return;
		setPanelLayout((current) => {
			let draggedPos: keyof PanelLayout | null = null;
			let targetPos: keyof PanelLayout | null = null;
			(Object.keys(current) as Array<keyof PanelLayout>).forEach((pos) => {
				if (current[pos] === draggedId) draggedPos = pos;
				if (current[pos] === targetId) targetPos = pos;
			});
			if (draggedPos && targetPos) {
				return { ...current, [draggedPos]: targetId as PanelKey, [targetPos]: draggedId as PanelKey };
			}
			return current;
		});
	}, []);

	const handleLanguageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
		const next = e.target.value as Language;
		setLanguage(next);
		setCode(DEFAULT_CODE[next]);
	}, []);

	const handleRun = useCallback(async () => {
		if (!sectionId || runState.status === "running") return;

		abortRef.current?.abort();
		const abortController = new AbortController();
		abortRef.current = abortController;

		setRunState({ status: "running" });

		try {
			const submitRes = await apiService.runSubmit(sectionId, code, language, stdin);
			const sessionKey = (submitRes as any)?.sessionKey ?? (submitRes as any)?.data?.sessionKey;
			const domjudgeProblemId =
				(submitRes as any)?.domjudgeProblemId ?? (submitRes as any)?.data?.domjudgeProblemId;

			if (!sessionKey || !domjudgeProblemId) {
				throw new Error("실행 세션을 받지 못했습니다. 다시 시도해주세요.");
			}

			const baseURL = process.env.REACT_APP_API_URL || "https://hcl.walab.info/api";
			const token = tokenManager.getAccessToken();

			await fetchEventSource(
				`${baseURL}/run/stream/${sessionKey}?domjudgeProblemId=${encodeURIComponent(domjudgeProblemId)}`,
				{
					method: "GET",
					headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
					signal: abortController.signal,
					openWhenHidden: true,
					onmessage(event) {
						if (abortController.signal.aborted) return;
						const data = JSON.parse(event.data);
						if (event.event === "output") {
							setRunState({ status: "output", output: data.output ?? "", outputError: data.outputError ?? "" });
							abortController.abort();
						} else if (event.event === "ce") {
							setRunState({ status: "ce", outputCompile: data.output_compile ?? "" });
							abortController.abort();
						} else if (event.event === "error") {
							setRunState({ status: "error", message: data.message ?? "실행에 실패했습니다." });
							abortController.abort();
						}
					},
					onerror(err) {
						if (!abortController.signal.aborted) {
							setRunState({ status: "error", message: "연결이 끊어졌습니다. 다시 시도해주세요." });
						}
						abortController.abort();
						throw err;
					},
				},
			);
		} catch (err) {
			setRunState((prev) =>
				prev.status === "output" || prev.status === "ce"
					? prev
					: { status: "error", message: err instanceof Error ? err.message : "실행 요청에 실패했습니다." },
			);
		}
	}, [sectionId, code, language, stdin, runState.status]);

	const editorPanel = (
		<ES.EditorWrapper>
			<ES.EditorHeader>
				<ES.EditorHeaderLeft>
					<span>
						solution.{language === "python" ? "py" : language === "cpp" ? "cpp" : language}
					</span>
				</ES.EditorHeaderLeft>
				<ES.EditorHeaderRight>
					<S.LanguageSelect value={language} onChange={handleLanguageChange}>
						<option value="c">C</option>
						<option value="cpp">C++</option>
						<option value="java">Java</option>
						<option value="python">Python</option>
					</S.LanguageSelect>
					<ES.SubmitButton
						onClick={handleRun}
						disabled={runState.status === "running"}
						title="채점 없이 stdout/stderr만 바로 확인합니다"
					>
						{runState.status === "running" ? "실행 중..." : "실행하기"}
					</ES.SubmitButton>
				</ES.EditorHeaderRight>
			</ES.EditorHeader>
			<ES.EditorScrollArea>
				<CodeMirror
					value={code}
					height="100%"
					extensions={getLanguageExtension(language)}
					theme={theme}
					onChange={setCode}
				/>
			</ES.EditorScrollArea>
		</ES.EditorWrapper>
	);

	const stdinPanel = (
		<DS.DescriptionArea>
			<DS.DescriptionHeader>입력값 (STDIN)</DS.DescriptionHeader>
			<div style={{ height: "calc(100% - 64px)" }}>
				<S.StdinTextarea
					value={stdin}
					onChange={(e) => setStdin(e.target.value)}
					placeholder="프로그램이 scanf/input()으로 읽을 값을 입력하세요 (선택)"
				/>
			</div>
		</DS.DescriptionArea>
	);

	const outputPanel = (
		<RS.ResultArea>
			<S.OutputWrapper>
				{runState.status === "idle" && (
					<S.OutputPlaceholder>실행하기를 누르면 결과가 여기에 표시됩니다.</S.OutputPlaceholder>
				)}
				{runState.status === "running" && <S.OutputPlaceholder>실행 중...</S.OutputPlaceholder>}
				{runState.status === "output" && (
					<>
						<RS.Label $type="output">실행 결과</RS.Label>
						<RS.Content>
							<pre>{runState.output || "(표준출력 없음)"}</pre>
						</RS.Content>
						{runState.outputError && (
							<RS.CompileOutputSection>
								<RS.Label $type="error">표준에러</RS.Label>
								<RS.Content>
									<pre>{runState.outputError}</pre>
								</RS.Content>
							</RS.CompileOutputSection>
						)}
					</>
				)}
				{runState.status === "ce" && (
					<>
						<RS.Label $type="error">컴파일 에러</RS.Label>
						<RS.Content>
							<pre>{runState.outputCompile || "컴파일 에러가 발생했습니다."}</pre>
						</RS.Content>
					</>
				)}
				{runState.status === "error" && <RS.ErrorMessage>{runState.message}</RS.ErrorMessage>}
			</S.OutputWrapper>
		</RS.ResultArea>
	);

	const panels: Record<PanelKey, React.ReactNode> = { editor: editorPanel, stdin: stdinPanel, output: outputPanel };
	const titles: Record<PanelKey, string> = { editor: "코드 에디터", stdin: "입력값", output: "실행 결과" };

	const renderPanel = (panelType: PanelKey) => (
		<DraggablePanel id={panelType} type={panelType} title={titles[panelType]} onMove={handlePanelMove} showDragHandle>
			{panels[panelType]}
		</DraggablePanel>
	);

	return (
		<DndProvider backend={HTML5Backend}>
			<PS.PageWrapper className={`problem-solve-page ${theme}`} $theme={theme}>
				<PS.Header $theme={theme}>
					<PS.HeaderBreadcrumbWrap>
						<PS.Breadcrumb>
							<PS.BreadcrumbLink type="button" onClick={() => navigate(`/sections/${sectionId}/dashboard`)}>
								대시보드
							</PS.BreadcrumbLink>
							<span> › </span>
							<PS.BreadcrumbCurrent $theme={theme}>코딩 실습</PS.BreadcrumbCurrent>
						</PS.Breadcrumb>
					</PS.HeaderBreadcrumbWrap>
					<PS.Controls>
						<PS.ThemeButton type="button" $active={theme === "light"} $theme={theme} onClick={() => setTheme("light")}>
							Light
						</PS.ThemeButton>
						<PS.ThemeButton type="button" $active={theme === "dark"} $theme={theme} onClick={() => setTheme("dark")}>
							Dark
						</PS.ThemeButton>
					</PS.Controls>
				</PS.Header>
				<PS.MainSplit>
					<Split
						sizes={[65, 35]}
						direction="horizontal"
						minSize={200}
						gutterSize={20}
						gutterStyle={() => ({ backgroundColor: theme === "dark" ? "#2d3748" : "#cbd5e0" })}
						style={{ display: "flex", width: "100%" }}
					>
						{renderPanel(panelLayout.left)}
						<Split
							sizes={[45, 55]}
							direction="vertical"
							minSize={80}
							gutterSize={20}
							gutterStyle={() => ({ backgroundColor: theme === "dark" ? "#2d3748" : "#cbd5e0" })}
							style={{ display: "flex", flexDirection: "column", height: "100%" }}
						>
							{renderPanel(panelLayout.topRight)}
							{renderPanel(panelLayout.bottomRight)}
						</Split>
					</Split>
				</PS.MainSplit>
			</PS.PageWrapper>
		</DndProvider>
	);
}

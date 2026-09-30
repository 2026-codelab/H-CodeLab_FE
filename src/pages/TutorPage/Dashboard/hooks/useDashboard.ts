import { useState, useEffect } from "react";
import APIService from "../../../../services/APIService";
import type {
	DashboardSection,
	DashboardFormData,
	DashboardCopyFormData,
	DashboardNotice,
	DashboardAssignment,
} from "../types";

const createInitialFormData = (): DashboardFormData => {
	const current = getCurrentSemester();
	return {
		courseId: "",
		courseTitle: "",
		description: "",
		year: current.year,
		semester: current.semester,
	};
};

const createInitialCopyFormData = (): DashboardCopyFormData => {
	const current = getCurrentSemester();
	return {
		sourceSectionId: "",
		courseTitle: "",
		description: "",
		year: current.year,
		semester: current.semester,
		copyNotices: true,
		copyAssignments: true,
		selectedNoticeIds: [],
		selectedAssignmentIds: [],
		assignmentProblems: {},
		noticeEdits: {},
		assignmentEdits: {},
		problemEdits: {},
	};
};

export const SEMESTER_OPTIONS = [
	"SPRING",
	"SUMMER",
	"FALL",
	"WINTER",
	"CAMP",
	"SPECIAL",
	"IRREGULAR",
];

export const PAST_SEMESTER_MSG = "지난 학기에는 수업을 만들 수 없습니다.";

export function getSemesterLabel(semester: string): string {
	switch (semester) {
		case "SPRING":
			return "1학기";
		case "SUMMER":
			return "여름학기";
		case "FALL":
			return "2학기";
		case "WINTER":
			return "겨울학기";
		case "CAMP":
			return "캠프";
		case "SPECIAL":
			return "특강";
		case "IRREGULAR":
			return "비정규 세션";
		default:
			return semester || "";
	}
}

/**
 * 학기 종료 시점(해당 학기 마지막 날의 다음 날 0시) 반환
 * 1학기 3~6월, 여름 7~8월, 2학기 9~12월, 겨울 다음 해 1~2월
 * 기간이 없는 구분(캠프/특강/비정규)은 해당 년도 말까지
 */
function getSemesterEnd(year: number, semester: string): Date {
	switch (semester) {
		case "SPRING":
			return new Date(year, 6, 1);
		case "SUMMER":
			return new Date(year, 8, 1);
		case "WINTER":
			return new Date(year + 1, 2, 1);
		default:
			return new Date(year + 1, 0, 1);
	}
}

/** 이미 끝난 학기인지 여부 */
export function isPastSemester(
	year: number,
	semester: string,
	now: Date = new Date(),
): boolean {
	return now >= getSemesterEnd(year, semester);
}

/**
 * 년도가 바뀌어 선택된 학기가 지난 학기가 되면 선택 가능한 첫 학기로 교체
 * (선택 가능한 학기가 없으면 그대로 둠)
 */
export function adjustSemesterForYear(
	year: number | string,
	semester: string,
): string {
	const yearNum = Number(year);
	if (year === "" || Number.isNaN(yearNum)) return semester;
	if (!isPastSemester(yearNum, semester)) return semester;
	return (
		SEMESTER_OPTIONS.find((option) => !isPastSemester(yearNum, option)) ??
		semester
	);
}

/** 오늘 날짜 기준 현재 학기 (1~2월은 전년도 겨울학기) */
export function getCurrentSemester(now: Date = new Date()): {
	year: number;
	semester: string;
} {
	const year = now.getFullYear();
	const month = now.getMonth() + 1;
	if (month <= 2) return { year: year - 1, semester: "WINTER" };
	if (month <= 6) return { year, semester: "SPRING" };
	if (month <= 8) return { year, semester: "SUMMER" };
	return { year, semester: "FALL" };
}

export function formatDate(dateString: string): string {
	if (!dateString) return "";
	const date = new Date(dateString);
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${y}.${m}.${d}`;
}

/**
 * 새 수업 만들기 모달 상태와 생성 처리
 * 관리 페이지 대시보드와 내 강의실에서 함께 사용
 */
export function useCreateSection(onCreated?: () => void | Promise<void>) {
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [formData, setFormData] = useState<DashboardFormData>(createInitialFormData);
	const [isCreatingSection, setIsCreatingSection] = useState(false);

	const handleCreateSection = async () => {
		if (!formData.courseTitle?.toString().trim()) {
			alert("새 강의 제목을 입력해주세요.");
			return;
		}
		setIsCreatingSection(true);
		try {
			const courseResponse = await APIService.createCourse({
				title: formData.courseTitle.toString().trim(),
				description: formData.description?.toString() || "",
			});
			const courseId = courseResponse.id;
			await APIService.createSection({
				courseId,
				instructorId: await APIService.getCurrentUserId(),
				sectionNumber: null,
				year: Number.parseInt(String(formData.year)),
				semester: formData.semester,
			});
			alert("수업이 성공적으로 생성되었습니다!");
			setShowCreateModal(false);
			setFormData(createInitialFormData());
			await onCreated?.();
			window.dispatchEvent(new Event("tutor-sections-refresh"));
		} catch (err: unknown) {
			console.error("수업 생성 실패:", err);
			alert((err as Error).message || "수업 생성에 실패했습니다.");
		} finally {
			setIsCreatingSection(false);
		}
	};

	return {
		showCreateModal,
		setShowCreateModal,
		formData,
		setFormData,
		isCreatingSection,
		handleCreateSection,
	};
}

export function useDashboard() {
	const [sections, setSections] = useState<DashboardSection[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterYear, setFilterYear] = useState("ALL");
	const [filterSemester, setFilterSemester] = useState("ALL");
	const [filterStatus, setFilterStatus] = useState("ALL");
	const {
		showCreateModal,
		setShowCreateModal,
		formData,
		setFormData,
		isCreatingSection,
		handleCreateSection,
	} = useCreateSection(() => fetchSections());
	const [showCopyModal, setShowCopyModal] = useState(false);
	const [isCopyingSection, setIsCopyingSection] = useState(false);
	const [copyFormData, setCopyFormData] =
		useState<DashboardCopyFormData>(createInitialCopyFormData);
	const [sourceNotices, setSourceNotices] = useState<DashboardNotice[]>([]);
	const [sourceAssignments, setSourceAssignments] = useState<
		DashboardAssignment[]
	>([]);
	const [loadingNotices, setLoadingNotices] = useState(false);
	const [loadingAssignments, setLoadingAssignments] = useState(false);
	const [expandedAssignments, setExpandedAssignments] = useState<
		Record<number, boolean>
	>({});
	const [copyStep, setCopyStep] = useState(1);
	const [editingNoticeId, setEditingNoticeId] = useState<number | null>(null);
	const [editingAssignmentId, setEditingAssignmentId] = useState<number | null>(
		null,
	);
	const [editingProblemId, setEditingProblemId] = useState<number | null>(null);
	const [viewingNoticeId, setViewingNoticeId] = useState<number | null>(null);
	const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

	const fetchSections = async () => {
		try {
			setLoading(true);
			const res = await APIService.getInstructorDashboard();
			const data = res?.data || [];
			setSections(data);
		} catch {
			setSections([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchSections();
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				openDropdownId &&
				!(event.target as Element).closest(".dropdown-container")
			) {
				setOpenDropdownId(null);
			}
		};
		if (openDropdownId) {
			document.addEventListener("mousedown", handleClickOutside);
			return () =>
				document.removeEventListener("mousedown", handleClickOutside);
		}
	}, [openDropdownId]);

	const handleToggleActive = async (
		sectionId: number,
		currentActive: boolean,
	) => {
		const newActive = !currentActive;
		const message = newActive
			? "이 수업을 활성화하시겠습니까?"
			: "이 수업을 비활성화하시겠습니까?";

		if (!window.confirm(message)) {
			return;
		}

		try {
			await APIService.toggleSectionActive(sectionId, newActive);
			alert(
				newActive ? "수업이 활성화되었습니다." : "수업이 비활성화되었습니다.",
			);
			fetchSections();
		} catch (err: unknown) {
			console.error("수업 상태 변경 실패:", err);
			alert((err as Error).message || "수업 상태 변경에 실패했습니다.");
		}
	};

	const handleDeleteSection = async (
		sectionId: number,
		sectionTitle: string,
	) => {
		if (
			!window.confirm(`정말로 분반 "${sectionTitle}"을(를) 삭제하시겠습니까?`)
		) {
			return;
		}
		try {
			await APIService.deleteSection(sectionId);
			alert("분반이 삭제되었습니다.");
			fetchSections();
		} catch (err: unknown) {
			console.error("분반 삭제 실패:", err);
			alert((err as Error).message || "분반 삭제에 실패했습니다.");
		}
	};

	const handleSourceSectionChange = async (sectionId: string) => {
		setCopyFormData((prev) => ({
			...prev,
			sourceSectionId: sectionId,
			selectedNoticeIds: [],
			selectedAssignmentIds: [],
			assignmentProblems: {},
			noticeEdits: {},
			assignmentEdits: {},
			problemEdits: {},
		}));
		setExpandedAssignments({});

		if (!sectionId) {
			setSourceNotices([]);
			setSourceAssignments([]);
			return;
		}

		try {
			setLoadingNotices(true);
			setLoadingAssignments(true);
			const sid = Number.parseInt(sectionId);

			const notices = await APIService.getSectionNotices(sid);
			const noticesData = notices?.data || notices || [];
			setSourceNotices(noticesData);

			const assignments = await APIService.getAssignmentsBySection(sid);
			const assignmentsData = assignments?.data || assignments || [];
			const withProblems = await Promise.all(
				assignmentsData.map(async (a: DashboardAssignment) => {
					try {
						const problems = await APIService.getAssignmentProblems(sid, a.id);
						return { ...a, problems: problems || [] };
					} catch {
						return { ...a, problems: [] };
					}
				}),
			);
			setSourceAssignments(withProblems);
			setCopyFormData((prev) => ({
				...prev,
				sourceSectionId: sectionId,
				selectedNoticeIds: [],
				selectedAssignmentIds: [],
				assignmentProblems: {},
			}));
		} catch (error) {
			console.error("데이터 조회 실패:", error);
			setSourceNotices([]);
			setSourceAssignments([]);
		} finally {
			setLoadingNotices(false);
			setLoadingAssignments(false);
		}
	};

	const handleNoticeToggle = (noticeId: number) => {
		setCopyFormData((prev) => {
			const isSelected = prev.selectedNoticeIds.includes(noticeId);
			return {
				...prev,
				selectedNoticeIds: isSelected
					? prev.selectedNoticeIds.filter((id) => id !== noticeId)
					: [...prev.selectedNoticeIds, noticeId],
			};
		});
	};

	const handleSelectAllNotices = () => {
		setCopyFormData((prev) => ({
			...prev,
			selectedNoticeIds:
				prev.selectedNoticeIds.length === sourceNotices.length
					? []
					: sourceNotices.map((n) => n.id),
		}));
	};

	const handleNoticeEdit = (noticeId: number, field: string, value: string) => {
		setCopyFormData((prev) => {
			const edits = prev.noticeEdits[noticeId] || {};
			return {
				...prev,
				noticeEdits: {
					...prev.noticeEdits,
					[noticeId]: { ...edits, [field]: value },
				},
			};
		});
	};

	const handleAssignmentToggle = (assignmentId: number) => {
		setCopyFormData((prev) => {
			const isSelected = prev.selectedAssignmentIds.includes(assignmentId);
			if (isSelected) {
				const next = { ...prev.assignmentProblems };
				delete next[assignmentId];
				return {
					...prev,
					selectedAssignmentIds: prev.selectedAssignmentIds.filter(
						(id) => id !== assignmentId,
					),
					assignmentProblems: next,
				};
			}
			const assignment = sourceAssignments.find((a) => a.id === assignmentId);
			return {
				...prev,
				selectedAssignmentIds: [...prev.selectedAssignmentIds, assignmentId],
				assignmentProblems: {
					...prev.assignmentProblems,
					[assignmentId]: assignment?.problems.map((p) => p.id) || [],
				},
			};
		});
	};

	const handleSelectAllAssignments = () => {
		if (
			copyFormData.selectedAssignmentIds.length === sourceAssignments.length
		) {
			setCopyFormData((prev) => ({
				...prev,
				selectedAssignmentIds: [],
				assignmentProblems: {},
			}));
		} else {
			const assignmentProblems: Record<number, number[]> = {};
			for (const a of sourceAssignments) {
				assignmentProblems[a.id] = a.problems.map((p) => p.id);
			}
			setCopyFormData((prev) => ({
				...prev,
				selectedAssignmentIds: sourceAssignments.map((a) => a.id),
				assignmentProblems,
			}));
		}
	};

	const handleAssignmentEdit = (
		assignmentId: number,
		field: string,
		value: string,
	) => {
		setCopyFormData((prev) => {
			const edits = prev.assignmentEdits[assignmentId] || {};
			return {
				...prev,
				assignmentEdits: {
					...prev.assignmentEdits,
					[assignmentId]: { ...edits, [field]: value },
				},
			};
		});
	};

	const toggleAssignmentExpand = (assignmentId: number) => {
		setExpandedAssignments((prev) => ({
			...prev,
			[assignmentId]: !prev[assignmentId],
		}));
	};

	const handleProblemToggle = (assignmentId: number, problemId: number) => {
		setCopyFormData((prev) => {
			const current = prev.assignmentProblems[assignmentId] || [];
			const isSelected = current.includes(problemId);
			return {
				...prev,
				assignmentProblems: {
					...prev.assignmentProblems,
					[assignmentId]: isSelected
						? current.filter((id) => id !== problemId)
						: [...current, problemId],
				},
			};
		});
	};

	const handleSelectAllProblems = (assignmentId: number) => {
		const assignment = sourceAssignments.find((a) => a.id === assignmentId);
		if (!assignment) return;
		const allIds = assignment.problems.map((p) => p.id);
		const current = copyFormData.assignmentProblems[assignmentId] || [];
		setCopyFormData((prev) => ({
			...prev,
			assignmentProblems: {
				...prev.assignmentProblems,
				[assignmentId]: current.length === allIds.length ? [] : allIds,
			},
		}));
	};

	const handleProblemEdit = (problemId: number, title: string) => {
		setCopyFormData((prev) => ({
			...prev,
			problemEdits: { ...prev.problemEdits, [problemId]: { title } },
		}));
	};

	const handleCopySection = async () => {
		if (!copyFormData.sourceSectionId) {
			alert("복사할 수업을 선택해주세요.");
			return;
		}
		if (!copyFormData.courseTitle) {
			alert("새 수업 제목을 입력해주세요.");
			return;
		}
		if (
			isPastSemester(
				Number.parseInt(String(copyFormData.year)),
				copyFormData.semester,
			)
		) {
			alert(PAST_SEMESTER_MSG);
			return;
		}
		setIsCopyingSection(true);
		try {
			const response = await APIService.copySection(
				Number.parseInt(copyFormData.sourceSectionId),
				null,
				Number.parseInt(String(copyFormData.year)),
				copyFormData.semester,
				copyFormData.courseTitle,
				copyFormData.description || "",
				copyFormData.copyNotices,
				copyFormData.copyAssignments,
				copyFormData.copyNotices ? copyFormData.selectedNoticeIds : [],
				copyFormData.copyAssignments ? copyFormData.selectedAssignmentIds : [],
				copyFormData.copyAssignments ? copyFormData.assignmentProblems : {},
				copyFormData.noticeEdits,
				copyFormData.assignmentEdits,
				copyFormData.problemEdits,
			);
			if (response.success) {
				alert("수업이 성공적으로 복사되었습니다!");
				setShowCopyModal(false);
				setCopyStep(1);
				setCopyFormData(createInitialCopyFormData());
				setSourceNotices([]);
				setSourceAssignments([]);
				setExpandedAssignments({});
				setEditingNoticeId(null);
				setEditingAssignmentId(null);
				setEditingProblemId(null);
				fetchSections();
			} else {
				alert(response.message || "수업 복사에 실패했습니다.");
			}
		} catch (err: unknown) {
			console.error("수업 복사 실패:", err);
			alert((err as Error).message || "수업 복사에 실패했습니다.");
		} finally {
			setIsCopyingSection(false);
		}
	};

	const availableYears = [
		...new Set(sections.map((s) => s.year).filter(Boolean)),
	].sort((a, b) => b - a) as number[];

	const filteredSections = sections.filter((section) => {
		const matchSearch =
			!searchTerm ||
			section.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(section.instructorName &&
				section.instructorName
					.toLowerCase()
					.includes(searchTerm.toLowerCase()));
		const matchYear =
			filterYear === "ALL" || section.year === Number.parseInt(filterYear);
		const matchSemester =
			filterSemester === "ALL" || section.semester === filterSemester;
		const matchStatus =
			filterStatus === "ALL" ||
			(filterStatus === "ACTIVE" && section.active !== false) ||
			(filterStatus === "INACTIVE" && section.active === false);
		return matchSearch && matchYear && matchSemester && matchStatus;
	});

	const hasActiveFilters =
		!!searchTerm ||
		filterYear !== "ALL" ||
		filterSemester !== "ALL" ||
		filterStatus !== "ALL";

	return {
		// state
		sections,
		loading,
		searchTerm,
		setSearchTerm,
		filterYear,
		setFilterYear,
		filterSemester,
		setFilterSemester,
		filterStatus,
		setFilterStatus,
		showCreateModal,
		setShowCreateModal,
		formData,
		setFormData,
		showCopyModal,
		setShowCopyModal,
		isCreatingSection,
		isCopyingSection,
		copyFormData,
		setCopyFormData,
		sourceNotices,
		sourceAssignments,
		loadingNotices,
		loadingAssignments,
		expandedAssignments,
		copyStep,
		setCopyStep,
		editingNoticeId,
		setEditingNoticeId,
		editingAssignmentId,
		setEditingAssignmentId,
		editingProblemId,
		setEditingProblemId,
		viewingNoticeId,
		setViewingNoticeId,
		openDropdownId,
		setOpenDropdownId,
		// computed
		filteredSections,
		availableYears,
		hasActiveFilters,
		// actions
		fetchSections,
		handleCreateSection,
		handleToggleActive,
		handleDeleteSection,
		handleSourceSectionChange,
		handleNoticeToggle,
		handleSelectAllNotices,
		handleNoticeEdit,
		handleAssignmentToggle,
		handleSelectAllAssignments,
		handleAssignmentEdit,
		toggleAssignmentExpand,
		handleProblemToggle,
		handleSelectAllProblems,
		handleProblemEdit,
		handleCopySection,
	};
}

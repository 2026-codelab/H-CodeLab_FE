import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import CourseSidebar from "../../../../components/Course/CourseSidebar";
import CourseHeader from "../../../../components/Course/CourseHeader";
import { sidebarCollapsedState } from "../../../../recoil/atoms";
import APIService from "../../../../services/APIService";
import * as CS from "../../CodingQuiz/CodingQuizPage/styles";
import { PRACTICE_LANGUAGES } from "../languages";
import * as S from "./styles";

type SectionInfo = { courseTitle?: string; courseName?: string };

export default function CodingPracticeLanguagePage() {
	const { sectionId } = useParams<{ sectionId: string }>();
	const navigate = useNavigate();
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useRecoilState(sidebarCollapsedState);
	const [sectionInfo, setSectionInfo] = useState<SectionInfo | null>(null);

	useEffect(() => {
		if (!sectionId) return;
		APIService.getSectionInfo(sectionId)
			.then((res: { data?: SectionInfo } & SectionInfo) => setSectionInfo(res?.data ?? res))
			.catch((err: unknown) => console.error("Error fetching section info:", err));
	}, [sectionId]);

	const handleToggleSidebar = useCallback(() => {
		setIsSidebarCollapsed((prev) => !prev);
	}, [setIsSidebarCollapsed]);

	return (
		<CS.Container $isCollapsed={isSidebarCollapsed}>
			<CourseSidebar
				sectionId={sectionId}
				activeMenu="코딩 실습"
				isCollapsed={isSidebarCollapsed}
				onMenuClick={() => {}}
				onToggleSidebar={handleToggleSidebar}
			/>
			<CS.Content $isCollapsed={isSidebarCollapsed}>
				<CourseHeader
					courseName={sectionInfo?.courseTitle || sectionInfo?.courseName || "강의"}
					onToggleSidebar={handleToggleSidebar}
					isSidebarCollapsed={isSidebarCollapsed}
				/>
				<S.Body>
					<S.PageHeader>
						<h1>코딩 실습</h1>
						<p>실습할 언어를 선택하세요. 과제와 관계없이 코드를 자유롭게 실행해 볼 수 있습니다.</p>
					</S.PageHeader>
					<S.LanguageGrid>
						{PRACTICE_LANGUAGES.map((lang) => {
							const Icon = lang.icon;
							return (
								<S.LanguageCard
									key={lang.id}
									type="button"
									$color={lang.color}
									onClick={() => navigate(`/sections/${sectionId}/coding-practice/${lang.id}`)}
								>
									<Icon className="language-icon" />
									<S.LanguageName>{lang.label}</S.LanguageName>
									<S.LanguageDescription>{lang.description}</S.LanguageDescription>
								</S.LanguageCard>
							);
						})}
					</S.LanguageGrid>
				</S.Body>
			</CS.Content>
		</CS.Container>
	);
}

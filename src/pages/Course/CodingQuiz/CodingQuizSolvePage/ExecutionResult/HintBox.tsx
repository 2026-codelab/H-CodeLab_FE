import type React from "react";
import { useEffect, useState } from "react";
import apiService from "../../../../../services/APIService";
import * as S from "./styles";

interface HintResponse {
	hint: string;
	category: string;
	tier: "SOCRATIC" | "MEDIUM" | "DIRECT";
	usedCount: number;
	usedFallback: boolean;
}

interface FailingTestcase {
	testcaseRank: number;
	result: string | null;
	testcaseInput?: string;
	expectedOutput?: string;
	output?: string;
	outputError?: string;
	outputDiff?: string;
}

interface HintBoxProps {
	problemId: number;
	code: string;
	/** 실패한(correct가 아닌) 테스트케이스 전체 — 한 번의 테스트 실행 결과를 통합해서 힌트 하나를 만든다. */
	failingTestcases: FailingTestcase[];
}

const TIER_LABEL: Record<HintResponse["tier"], string> = {
	SOCRATIC: "질문형 힌트",
	MEDIUM: "중간 힌트",
	DIRECT: "직접형 힌트",
};

/**
 * "테스트하기" 결과 중 실패한 테스트케이스가 하나 이상 있을 때 보이는 통합 "힌트" 버튼.
 * 테스트케이스별로 따로 받지 않고, 코드 + 실패한 케이스 전체를 한 번에 보내 공통 원인 힌트 하나를 받는다.
 * 사용 횟수 제한은 없고, 지금까지 사용한 횟수만 참고용으로 표시한다.
 */
const HintBox: React.FC<HintBoxProps> = ({ problemId, code, failingTestcases }) => {
	const [usedCount, setUsedCount] = useState<number | null>(null);
	const [hint, setHint] = useState<HintResponse | null>(null);
	const [isLoadingUsage, setIsLoadingUsage] = useState(true);
	const [isGenerating, setIsGenerating] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		setIsLoadingUsage(true);

		apiService
			.getHintUsage(problemId)
			.then((res) => {
				if (cancelled) return;
				setUsedCount(res.usedCount);
			})
			.catch(() => {
				if (cancelled) return;
				setUsedCount(null);
			})
			.finally(() => {
				if (!cancelled) setIsLoadingUsage(false);
			});

		return () => {
			cancelled = true;
		};
	}, [problemId]);

	const handleRequestHint = async () => {
		if (isGenerating || failingTestcases.length === 0) return;
		setIsGenerating(true);
		setError(null);
		try {
			const res: HintResponse = await apiService.requestHint(problemId, {
				code,
				testcases: failingTestcases,
			});
			setHint(res);
			setUsedCount(res.usedCount);
		} catch (e) {
			setError(e instanceof Error ? e.message : "힌트를 가져오지 못했습니다.");
		} finally {
			setIsGenerating(false);
		}
	};

	const isDisabled = isGenerating || isLoadingUsage || failingTestcases.length === 0;

	return (
		<S.HintSection>
			<S.HintButton type="button" $disabled={isDisabled} disabled={isDisabled} onClick={handleRequestHint}>
				{isGenerating ? "힌트 생성 중..." : "힌트 보기"}
			</S.HintButton>
			{usedCount !== null && <S.HintRemainingLabel>사용한 힌트: {usedCount}회</S.HintRemainingLabel>}

			{error && <S.HintError>{error}</S.HintError>}

			{hint && (
				<S.HintCard>
					<S.HintCardLabel>{TIER_LABEL[hint.tier] ?? "힌트"}</S.HintCardLabel>
					{hint.hint}
				</S.HintCard>
			)}
		</S.HintSection>
	);
};

export default HintBox;

import type React from "react";
import { useEffect, useState } from "react";
import apiService from "../../../../../services/APIService";
import * as S from "./styles";

interface HintResponse {
	hint: string;
	category: string;
	tier: "SOCRATIC" | "MEDIUM" | "DIRECT";
	remainingUses: number;
	usedFallback: boolean;
}

interface HintBoxProps {
	submissionId: number;
}

const TIER_LABEL: Record<HintResponse["tier"], string> = {
	SOCRATIC: "질문형 힌트",
	MEDIUM: "중간 힌트",
	DIRECT: "직접형 힌트",
};

/**
 * 제출 결과가 AC가 아닐 때 보이는 "힌트" 버튼.
 * 문제당 최대 3회까지만 쓸 수 있고, 남은 횟수는 페이지가 열릴 때 서버에서 조회해 정확히 표시한다.
 */
const HintBox: React.FC<HintBoxProps> = ({ submissionId }) => {
	const [remainingUses, setRemainingUses] = useState<number | null>(null);
	const [maxUses, setMaxUses] = useState<number>(3);
	const [hint, setHint] = useState<HintResponse | null>(null);
	const [isLoadingUsage, setIsLoadingUsage] = useState(true);
	const [isGenerating, setIsGenerating] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		setHint(null);
		setError(null);
		setIsLoadingUsage(true);

		apiService
			.getHintUsage(submissionId)
			.then((res) => {
				if (cancelled) return;
				setRemainingUses(res.remainingUses);
				setMaxUses(res.maxUses);
			})
			.catch(() => {
				if (cancelled) return;
				// 조회 실패 시에도 버튼은 눌러볼 수 있게 두고, 실제 제한은 서버가 다시 검증함
				setRemainingUses(null);
			})
			.finally(() => {
				if (!cancelled) setIsLoadingUsage(false);
			});

		return () => {
			cancelled = true;
		};
	}, [submissionId]);

	const handleRequestHint = async () => {
		if (isGenerating || remainingUses === 0) return;
		setIsGenerating(true);
		setError(null);
		try {
			const res: HintResponse = await apiService.requestHint(submissionId);
			setHint(res);
			setRemainingUses(res.remainingUses);
		} catch (e) {
			setError(e instanceof Error ? e.message : "힌트를 가져오지 못했습니다.");
		} finally {
			setIsGenerating(false);
		}
	};

	const isDisabled = isGenerating || isLoadingUsage || remainingUses === 0;

	return (
		<S.HintSection>
			<S.HintButton type="button" $disabled={isDisabled} disabled={isDisabled} onClick={handleRequestHint}>
				{isGenerating ? "힌트 생성 중..." : "힌트 보기"}
			</S.HintButton>
			{remainingUses !== null && (
				<S.HintRemainingLabel>
					남은 힌트: {remainingUses}/{maxUses}
				</S.HintRemainingLabel>
			)}

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

import type React from "react";
import { useEffect, useState } from "react";
import apiService from "../../../../../services/APIService";
import * as S from "./styles";

interface HintResponse {
	hint: string;
	category: string;
	tier: "SOCRATIC" | "MEDIUM" | "DIRECT";
}

interface CompileErrorHintProps {
	problemId: number;
	code: string;
	outputCompile: string;
}

/**
 * 컴파일 에러는 버튼 없이 바로 보여준다 — 컴파일러 메시지는 이미 학생에게 전부 공개되어 있어서
 * "유출" 개념이 없고, 그 메시지를 쉬운 말로 풀어주는 것뿐이라 힌트 사용 횟수도 소모하지 않는다.
 */
const CompileErrorHint: React.FC<CompileErrorHintProps> = ({ problemId, code, outputCompile }) => {
	const [hint, setHint] = useState<HintResponse | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		setIsLoading(true);
		setHint(null);
		setError(null);

		apiService
			.requestHint(problemId, { code, outputCompile })
			.then((res: HintResponse) => {
				if (!cancelled) setHint(res);
			})
			.catch((e: unknown) => {
				if (!cancelled) setError(e instanceof Error ? e.message : "설명을 가져오지 못했습니다.");
			})
			.finally(() => {
				if (!cancelled) setIsLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [problemId, code, outputCompile]);

	return (
		<S.HintSection>
			{isLoading && <S.HintRemainingLabel>컴파일 오류 설명 불러오는 중...</S.HintRemainingLabel>}
			{error && <S.HintError>{error}</S.HintError>}
			{hint && (
				<S.HintCard>
					<S.HintCardLabel>컴파일 오류 설명</S.HintCardLabel>
					{hint.hint}
				</S.HintCard>
			)}
		</S.HintSection>
	);
};

export default CompileErrorHint;

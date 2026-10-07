import type { IconType } from "react-icons";
import { SiC, SiCplusplus, SiOpenjdk, SiPython } from "react-icons/si";

export type PracticeLanguage = "c" | "cpp" | "java" | "python";

export type PracticeLanguageOption = {
	id: PracticeLanguage;
	label: string;
	description: string;
	fileName: string;
	icon: IconType;
	color: string;
};

export const PRACTICE_LANGUAGES: PracticeLanguageOption[] = [
	{ id: "c", label: "C", description: "GCC 컴파일러로 실행합니다.", fileName: "main.c", icon: SiC, color: "#283593" },
	{ id: "cpp", label: "C++", description: "G++ 컴파일러로 실행합니다.", fileName: "main.cpp", icon: SiCplusplus, color: "#00599c" },
	{ id: "java", label: "Java", description: "public class Main 기준으로 실행합니다.", fileName: "Main.java", icon: SiOpenjdk, color: "#e76f00" },
	{ id: "python", label: "Python", description: "Python 3로 실행합니다.", fileName: "main.py", icon: SiPython, color: "#3776ab" },
];

export const findPracticeLanguage = (value?: string) =>
	PRACTICE_LANGUAGES.find((lang) => lang.id === value?.toLowerCase());

import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { LoginFormData } from "../types";

interface LocationState {
	redirectTo?: string;
	message?: string;
}

export function useLoginPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const [formData, setFormData] = useState<LoginFormData>({
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);

	const state = location.state as LocationState | null;
	const queryRedirectTo = new URLSearchParams(location.search).get("redirectTo");
	const redirectTo = state?.redirectTo || queryRedirectTo || undefined;
	const loginMessage = state?.message;
	const pendingEnrollmentCode = typeof window !== "undefined"
		? sessionStorage.getItem("pendingEnrollmentCode")
		: null;

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const { name, value } = e.target;
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}));
		},
		[],
	);

	const handleSubmit = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			navigate("/auth/callback", {
				state: {
					type: "login",
					email: formData.email,
					password: formData.password,
					redirectTo,
				},
			});
		},
		[formData.email, formData.password, redirectTo, navigate],
	);

	const handleSignup = useCallback(() => {
		navigate("/signup");
	}, [navigate]);

	const setShowPasswordToggle = useCallback(() => {
		setShowPassword((prev) => !prev);
	}, []);

	return {
		formData,
		showPassword,
		redirectTo,
		loginMessage,
		pendingEnrollmentCode,
		handleInputChange,
		handleSubmit,
		handleSignup,
		setShowPasswordToggle,
	};
}

export type LoginPageHookReturn = ReturnType<typeof useLoginPage>;

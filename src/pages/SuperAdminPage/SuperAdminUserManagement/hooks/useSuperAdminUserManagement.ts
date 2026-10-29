import { useState, useEffect, useCallback, useMemo } from "react";
import APIService from "../../../../services/APIService";
import type { User, RoleFilter } from "../types";

export function useSuperAdminUserManagement() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
	const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

	const fetchUsers = useCallback(async () => {
		try {
			setLoading(true);
			const response = await APIService.getAllUsersForSuperAdmin();
			setUsers(response?.data || []);
		} catch (error) {
			console.error("사용자 조회 실패:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	const getRoleLabel = useCallback((role: string): string => {
		const labels: Record<string, string> = {
			USER: "사용자",
			ADMIN: "관리자",
			SUPER_ADMIN: "시스템 관리자",
		};
		return labels[role] || role;
	}, []);

	const handleRoleChange = useCallback(
		async (userId: number, newRole: string) => {
			const target = users.find((u) => u.id === userId);
			if (!target || target.role === newRole) return;

			const confirmed = window.confirm(
				`${target.name}님의 역할을 "${getRoleLabel(target.role)}"에서 "${getRoleLabel(newRole)}"(으)로 변경할까요?`,
			);
			if (!confirmed) return;

			setUpdatingUserId(userId);
			try {
				await APIService.updateUserRoleBySuperAdmin(userId, newRole);
				setUsers((prev) =>
					prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
				);
			} catch (error: any) {
				console.error("사용자 역할 변경 실패:", error);
				window.alert(error?.message || "역할 변경에 실패했습니다.");
			} finally {
				setUpdatingUserId(null);
			}
		},
		[users, getRoleLabel],
	);

	const filteredUsers = useMemo(
		() =>
			users.filter((u) => {
				const lowerSearch = searchTerm.toLowerCase();
				const matchesSearch =
					u.name.toLowerCase().includes(lowerSearch) ||
					(u.email?.toLowerCase().includes(lowerSearch) ?? false) ||
					u.studentId?.includes(searchTerm);
				const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
				return matchesSearch && matchesRole;
			}),
		[users, searchTerm, roleFilter],
	);

	return {
		loading,
		searchTerm,
		setSearchTerm,
		roleFilter,
		setRoleFilter,
		filteredUsers,
		getRoleLabel,
		updatingUserId,
		handleRoleChange,
	};
}

export type SuperAdminUserManagementHookReturn = ReturnType<
	typeof useSuperAdminUserManagement
>;

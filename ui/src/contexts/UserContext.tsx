import { createContext, useState, useEffect } from "react";

import { BASE_URL_CAP } from "@/constants";
import { Projects_User, Projects_Users, Roles } from "@entities";

export const UserContext = createContext({} as IUserContext);

interface IUserContext {
    userInfo: UserInfo;
    isAdmin: () => boolean;
    isExternalValidator: (projectId: string) => boolean;
    isAccountingMember: (projectId: string) => boolean;
    isCV: (userIdCV: string) => boolean;
    deriveListOfPossibleCV: (projectStaff: Projects_Users) => Projects_Users;
    isLoadingInfo: () => boolean;
}
interface UserInfo {
    id: string;
    givenName: string;
    familyName: string;
    company: string;
    isAdmin: boolean;
    projectRoles: ProjectRole[];
    isLoadingInfo: boolean;
}
interface ProjectRole {
    projectId: string;
    role: string;
    craft: string | null;
}

export function UserProvider({ children }: { children: any }) {
    const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchUserInfo().catch((error) => {
            console.log(error);
            setIsLoading(false);
        });
    }, []);

    async function fetchUserInfo(): Promise<void> {
        setIsLoading(true);
        const response = await fetch(`${BASE_URL_CAP}/getUserInfo()`);
        if (response.ok) {
            const data = (await response.json()) as UserInfo;
            setUserInfo(data);
        }
        setIsLoading(false);
    }

    function isLoadingInfo() {
        return isLoading;
    }

    function isAdmin() {
        return !isLoading && userInfo.isAdmin;
    }

    function isExternalValidator(projectId: string) {
        return !isLoading && hasRole(Roles.EXTERNAL_VALIDATOR, projectId);
    }

    function isAccountingMember(projectId: string) {
        return !isLoading && hasRole(Roles.ACCOUNTING_MEMBER, projectId);
    }

    function hasRole(role: string, projectId: string) {
        const projectRole = userInfo.projectRoles.find((pr) => pr.projectId === projectId);
        return projectRole?.role === role || false;
    }

    function isCV(idCV: string) {
        return userInfo.id === idCV;
    }

    function deriveListOfPossibleCV(projectStaff: Projects_Users) {
        const role = projectStaff.find(
            (member: Projects_User) =>
                // @ts-ignore
                member.user_ID === userInfo.id
        )?.role;
        if (role) {
            let filter;
            if (role === Roles.ACCOUNTING_MEMBER) {
                // i) manager can forward -> to every other role
                filter = (member: Projects_User) =>
                    // @ts-ignore
                    member.role !== Roles.ACCOUNTING_MEMBER && member.user_ID !== userInfo.id;
            } else if (role === Roles.EXTERNAL_VALIDATOR) {
                // ii) planner can only forward -> back to manager
                filter = (member: Projects_User) =>
                    // @ts-ignore
                    member.role === Roles.ACCOUNTING_MEMBER && member.user_ID !== userInfo.id;
            }
            if (filter) return projectStaff.filter(filter);
        }
        return [];
    }

    return (
        <UserContext.Provider
            value={{
                userInfo,
                isAdmin,
                isExternalValidator,
                isAccountingMember,
                isCV,
                deriveListOfPossibleCV,
                isLoadingInfo
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

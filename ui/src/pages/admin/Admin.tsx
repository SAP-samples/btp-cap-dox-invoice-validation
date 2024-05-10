import {
    Button,
    Card,
    FlexBox,
    Input,
    Select,
    Text,
    Option,
    Title,
    Toast,
    Ui5CustomEvent,
    InputDomRef,
    AnalyticalTable,
    Toolbar,
    AnalyticalTableColumnDefinition,
    TextAlign,
    SelectDomRef
} from "@ui5/webcomponents-react";
import { SelectChangeEventDetail } from "@ui5/webcomponents/dist/Select.js";
import { spacing, useI18nBundle } from "@ui5/webcomponents-react-base";
import "@ui5/webcomponents-icons/dist/delete.js";
import { useEffect, useRef, useState, useMemo, useCallback, useContext } from "react";

import { BASE_URL_CAP } from "@/constants";
import { Project, Projects, Projects_User, Projects_Users, Roles } from "@entities";
import { ROLE_DISPLAY_STRING_I18N_MAPPING } from "@/formatters";
import Surface from "@/custom/Surface";
import ConfirmationDialog from "@/custom/ConfirmationDialog";
import { UserContext } from "@/contexts/UserContext";

interface IRoleAssignment {
    userId: string;
    projectId: string;
    role: string;
    craft: string | null;
}

export default function Admin() {
    const i18n = useI18nBundle("app");
    const [projects, setProjects] = useState<Projects>([]);
    const [roleAssignment, setRoleAssignment] = useState<IRoleAssignment>({
        userId: "",
        projectId: "",
        role: Roles.ACCOUNTING_MEMBER,
        craft: null
    });
    // eslint-disable-next-line camelcase
    const { isAdmin, isLoadingInfo } = useContext(UserContext);
    const [users, setUsers] = useState<Projects_Users>([]);
    const toast = useRef(null);
    const [toastUserName, setToastUserName] = useState<string>("");
    const isButtonDisabled =
        !roleAssignment?.userId || (roleAssignment.role === "PROJECT_PLANNER" && !roleAssignment?.craft);

    async function fetchProjects() {
        const url = BASE_URL_CAP + `/Projects`;
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            setProjects(data.value as Projects);
            // callback syntax to not have to specify a dependency in the useEffect hook
            setRoleAssignment((assignment) => {
                return { ...assignment, projectId: data.value[0].ID };
            });
        }
    }

    async function fetchProjectUsers() {
        const url = BASE_URL_CAP + `/Projects_Users`;
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            // eslint-disable-next-line camelcase
            setUsers(data.value as Projects_Users);
        }
    }

    useEffect(() => {
        fetchProjects().catch(console.log);
        fetchProjectUsers().catch(console.log);
    }, []);

    function updateUsersTable() {
        const newUserEntry = {
            // eslint-disable-next-line camelcase
            project_ID: roleAssignment.projectId,
            // eslint-disable-next-line camelcase
            user_ID: roleAssignment.userId,
            role: roleAssignment.role,
            craft: roleAssignment.craft
        };
        const indexOfExistentUser = users.findIndex(
            // @ts-ignore
            (user) => user.user_ID === roleAssignment.userId && user.project_ID === roleAssignment.projectId
        );

        if (indexOfExistentUser != -1) {
            // eslint-disable-next-line camelcase
            users[indexOfExistentUser] = newUserEntry as Projects_User;
            setUsers(users);
        } else {
            // eslint-disable-next-line camelcase
            setUsers([newUserEntry as Projects_User, ...users]);
        }
    }

    async function onSave() {
        const response = await fetch(`${BASE_URL_CAP}/assignProjectRole`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(roleAssignment)
        });
        if (response.ok) {
            updateUsersTable();
            setToastUserName(roleAssignment.userId);
            setRoleAssignment({ ...roleAssignment, userId: "", craft: null });
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            toast.current!.show();
        }
    }

    function getUsersProject(projectID: string) {
        const matchingEntry = projects.find((project) => project.ID === projectID);
        return matchingEntry?.name;
    }

    const onDeleteUser = useCallback(
        async (userId: string, projectId: string) => {
            const response = await fetch(
                `${BASE_URL_CAP}/Projects_Users(user_ID='${userId}',project_ID=${projectId})`,
                {
                    method: "DELETE"
                }
            );
            if (response.ok) {
                // @ts-ignore
                const updatedUsers = users.filter((user) => user.user_ID !== userId || user.project_ID !== projectId);
                setUsers(updatedUsers);
            }
        },
        [users]
    );

    const handleProjectChange = (event: Ui5CustomEvent<SelectDomRef, SelectChangeEventDetail>) =>
        setRoleAssignment({ ...roleAssignment, projectId: event.detail.selectedOption.dataset.id ?? "" });

    const handleRoleChange = (event: Ui5CustomEvent<SelectDomRef, SelectChangeEventDetail>) => {
        const selectedRole = event.detail.selectedOption.dataset.id;
        setRoleAssignment({
            ...roleAssignment,
            role: selectedRole ?? "",
            craft: selectedRole !== Roles.EXTERNAL_VALIDATOR ? null : roleAssignment.craft
        });
    };

    const handleEmailChange = (event: Ui5CustomEvent<InputDomRef, never>) => {
        const newEmail = event.target.value;
        setRoleAssignment({ ...roleAssignment, userId: newEmail ? newEmail.trim() : "" });
    };

    const handleCraftChange = (event: Ui5CustomEvent<InputDomRef, never>) => {
        const newCraft = event.target.value;
        setRoleAssignment({ ...roleAssignment, craft: newCraft ? newCraft.trim() : null });
    };

    // eslint-disable-next-line camelcase
    const userTable = users.map((user: Projects_User) => {
        // @ts-ignore
        const userId = user.user_ID as string;
        // @ts-ignore
        const projectId = user.project_ID as string;
        // @ts-ignore
        const role = user.role as string;
        return {
            user: userId,
            project: getUsersProject(projectId),
            role: i18n.getText({
                key: ROLE_DISPLAY_STRING_I18N_MAPPING[role as Roles] as string,
                defaultText: ""
            }),
            craft: user.craft,
            deleteUser: { userId, projectId }
        };
    });

    const [dialogState, setDialogState] = useState<{
        showDialog: boolean;
        dialogText: string;
        onConfirm: () => void;
    }>({
        showDialog: false,
        dialogText: "",
        onConfirm: () => {}
    });

    const userTableColumns: Array<AnalyticalTableColumnDefinition> = useMemo(
        () => [
            {
                Header: `${i18n.getText({ key: "user", defaultText: "" })}`,
                accessor: "user"
            },
            {
                Header: `${i18n.getText({ key: "project", defaultText: "" })}`,
                accessor: "project"
            },
            {
                Header: `${i18n.getText({ key: "role", defaultText: "" })}`,
                accessor: `role`
            },
            {
                Header: `${i18n.getText({ key: "craft", defaultText: "" })}`,
                accessor: "craft"
            },
            {
                Header: "",
                accessor: "deleteUser",
                id: "deleteUserButton",
                hAlign: TextAlign.Center,
                width: 70,
                disableFilters: true,
                disableSortBy: true,
                Cell: (props: any) => {
                    const userCredentials = props.cell.value as { userId: string; projectId: string };
                    return (
                        <Button
                            icon="delete"
                            design="Negative"
                            style={spacing.sapUiTinyMarginBegin}
                            onClick={() => {
                                setDialogState({
                                    showDialog: true,
                                    dialogText: i18n.getText({ key: "deleteUserDialog", defaultText: "" }),
                                    onConfirm: () => {
                                        void onDeleteUser(userCredentials.userId, userCredentials.projectId);
                                        setDialogState((previousState) => ({
                                            ...previousState,
                                            showDialog: false
                                        }));
                                    }
                                });
                            }}
                        />
                    );
                }
            }
        ],
        [i18n, onDeleteUser]
    );

    useEffect(() => {
        if (!isLoadingInfo() && !isAdmin()) throw new Error("404 Not Found");
    }, [isAdmin]);

    return (
        <>
            <Title
                level="H2"
                style={{ ...spacing.sapUiLargeMarginBegin, ...spacing.sapUiSmallMarginTop, textAlign: "center" }}
            >
                {i18n.getText({ key: "adminDashboard", defaultText: "" })}
            </Title>
            <FlexBox direction="Column" style={{ alignItems: "center" }}>
                <ConfirmationDialog
                    dialogText={dialogState.dialogText}
                    openDialog={dialogState.showDialog}
                    onConfirm={dialogState.onConfirm}
                    onCancel={() =>
                        setDialogState((previousState) => ({
                            ...previousState,
                            showDialog: false
                        }))
                    }
                ></ConfirmationDialog>
                <Card style={{ ...spacing.sapUiMediumMarginTop, width: "70%" }}>
                    <FlexBox direction="Column" style={{ marginLeft: "30%", marginRight: "30%" }}>
                        <FlexBox direction="Row" style={{ ...spacing.sapUiMediumMarginTop, alignItems: "center" }}>
                            <Text style={{ width: "20%" }}>Email:</Text>
                            <Input
                                style={{ ...spacing.sapUiTinyMarginBegin, width: "80%" }}
                                value={roleAssignment.userId}
                                onInput={handleEmailChange}
                            />
                        </FlexBox>
                        <FlexBox direction="Row" style={{ ...spacing.sapUiMediumMarginTop, alignItems: "center" }}>
                            <Text style={{ width: "20%" }}>{i18n.getText({ key: "project", defaultText: "" })}:</Text>
                            <Select
                                style={{ ...spacing.sapUiTinyMarginBegin, width: "80%" }}
                                onChange={handleProjectChange}
                            >
                                {projects.map((projects: Project) => (
                                    <Option key={projects.ID} data-id={projects.ID}>
                                        {projects.name}
                                    </Option>
                                ))}
                            </Select>
                        </FlexBox>
                        <FlexBox direction="Row" style={{ ...spacing.sapUiMediumMarginTop, alignItems: "center" }}>
                            <Text style={{ width: "20%" }}>{i18n.getText({ key: "role", defaultText: "" })}:</Text>
                            <Select
                                style={{ ...spacing.sapUiTinyMarginBegin, width: "80%" }}
                                onChange={handleRoleChange}
                            >
                                {Object.entries(ROLE_DISPLAY_STRING_I18N_MAPPING).map(
                                    ([role, roleDisplayString]: [role: string, roleDisplayString: string]) => (
                                        <Option key={role} data-id={role}>
                                            {i18n.getText({ key: roleDisplayString, defaultText: "" })}
                                        </Option>
                                    )
                                )}
                            </Select>
                        </FlexBox>
                        {roleAssignment.role === Roles.EXTERNAL_VALIDATOR ? (
                            <FlexBox direction="Row" style={{ ...spacing.sapUiMediumMarginTop, alignItems: "center" }}>
                                <Text style={{ textAlign: "left", width: "20%" }}>
                                    {i18n.getText({ key: "craft", defaultText: "" })}:
                                </Text>
                                <Input
                                    style={{ ...spacing.sapUiTinyMarginBegin, width: "80%" }}
                                    value={roleAssignment.craft ?? ""}
                                    onInput={handleCraftChange}
                                />
                            </FlexBox>
                        ) : null}
                        <FlexBox style={{ alignItems: "center" }}></FlexBox>
                        <Button
                            style={{
                                ...spacing.sapUiMediumMarginBottom,
                                ...spacing.sapUiMediumMarginTop,
                                alignSelf: "center",
                                width: "40%"
                            }}
                            design="Emphasized"
                            disabled={isButtonDisabled}
                            onClick={() => onSave().catch(console.log)}
                        >
                            {i18n.getText({ key: "save", defaultText: "" })}
                        </Button>
                    </FlexBox>
                </Card>
                <Toast ref={toast}>
                    {navigator.language.startsWith("de") ? (
                        <>
                            <FlexBox direction="Row">
                                <Text>
                                    {toastUserName} {i18n.getText({ key: "userSent", defaultText: "" })}
                                </Text>
                            </FlexBox>
                        </>
                    ) : (
                        <FlexBox direction="Row">
                            <Text>
                                {i18n.getText({ key: "userSent", defaultText: "" })} {toastUserName}.
                            </Text>
                        </FlexBox>
                    )}
                </Toast>
                <Surface style={{ ...spacing.sapUiLargeMarginTop, width: "70%" }}>
                    <AnalyticalTable
                        header={
                            <Toolbar design="Transparent" toolbarStyle="Standard">
                                <Title level={"H5"} style={{ ...spacing.sapUiTinyMarginBegin }}>
                                    {i18n.getText({ key: "allUsers", defaultText: "" })}
                                </Title>
                            </Toolbar>
                        }
                        data={userTable}
                        columns={userTableColumns}
                        minRows={2}
                        filterable
                    />
                </Surface>
            </FlexBox>
        </>
    );
}

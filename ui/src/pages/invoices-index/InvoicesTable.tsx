import {
    Toolbar,
    Text,
    Button,
    Title,
    Link,
    AnalyticalTable,
    TextAlign,
    AnalyticalTableColumnDefinition,
    Icon
} from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/navigation-right-arrow.js";
import { useNavigate } from "react-router-dom";
import { spacing, useI18nBundle } from "@ui5/webcomponents-react-base";
import "@ui5/webcomponents-icons/dist/alert.js";

import { Invoices, FlowStatuses, Roles } from "@entities";
import { CSSProperties, useMemo } from "react";
import {
    formatDate,
    WORKFLOW_STATUS_I18N_KEY_MAPPING,
    getCurrentFlowStatus,
    ROLE_DISPLAY_STRING_I18N_MAPPING
} from "@/formatters";
import Surface from "@/custom/Surface";

export default function InvoicesTable({
    invoices,
    titleKey,
    noDataKey,
    sortedBy,
    styles = {},
    extractionState
}: {
    invoices: Invoices;
    titleKey: string;
    noDataKey: string;
    sortedBy: string;
    styles?: CSSProperties;
    extractionState: { [key: string]: boolean };
}) {
    const nav = useNavigate();
    const i18n = useI18nBundle("app");

    const columns: Array<AnalyticalTableColumnDefinition> = useMemo(() => {
        return [
            {
                Header: `${i18n.getText({ key: "project", defaultText: "" })}`,
                accessor: "project.name",
                id: "projectName",
                headerTooltip: `${i18n.getText({ key: "projectToolTip", defaultText: "" })}`,
                Cell: (props: any) => {
                    const val: string = props.cell.row.original.invoiceID as string;
                    return (
                        <>
                            {Object.keys(extractionState).length == 0 && (
                                <Link style={{ margin: -1.5 }}>{props.cell.value}</Link>
                            )}
                            {Object.keys(extractionState).length != 0 && !extractionState[val] && (
                                <>
                                    <Icon
                                        style={{ ...spacing.sapUiTinyMarginEnd }}
                                        name="alert"
                                        design="Critical"
                                        showTooltip={true}
                                        accessibleName="Document is being processed..."
                                    />
                                    <div style={{ color: "gray" }}>{props.cell.value}</div>
                                </>
                            )}
                            {Object.keys(extractionState).length != 0 && extractionState[val] && (
                                <Link
                                    onClick={() => nav(`/invoices/${props.cell.row.original.invoiceID}`)}
                                    style={{ margin: -1.5 }}
                                >
                                    {props.cell.value}
                                </Link>
                            )}
                        </>
                    );
                },
                width: 260
            },
            {
                Header: `${i18n.getText({ key: "invoiceNumber", defaultText: "" })}`,
                accessor: "invoiceID",
                headerTooltip: `${i18n.getText({ key: "invoiceToolTip", defaultText: "" })}`,
                Cell: (props: any) => {
                    const invoiceID = props.cell.value;
                    return (
                        <>
                            {Object.keys(extractionState).length == 0 && (
                                <Link style={{ margin: -1.5 }}>{invoiceID}</Link>
                            )}
                            {Object.keys(extractionState).length != 0 && extractionState[invoiceID] && (
                                <Link onClick={() => nav(`/invoices/${invoiceID}`)} style={{ margin: -1.5 }}>
                                    {invoiceID}
                                </Link>
                            )}
                            {Object.keys(extractionState).length != 0 && !extractionState[invoiceID] && (
                                <div>{invoiceID}</div>
                            )}
                        </>
                    );
                }
            },
            {
                Header: `${i18n.getText({ key: "company", defaultText: "" })}`,
                accessor: "company",
                headerTooltip: `${i18n.getText({ key: "companyToolTip", defaultText: "" })}`,
                width: 260
            },
            {
                Header: `${i18n.getText({ key: "costGroup", defaultText: "" })}`,
                accessor: "costGroup",
                headerTooltip: `${i18n.getText({ key: "costGroupToolTip", defaultText: "" })}`
            },
            {
                Header: `${i18n.getText({ key: "contact", defaultText: "" })}`,
                accessor: "contact",
                headerTooltip: `${i18n.getText({ key: "contactToolTip", defaultText: "" })}`
            },
            {
                Header: `${i18n.getText({ key: "dueDate", defaultText: "" })}`,
                accessor: "dueDate",
                headerTooltip: `${i18n.getText({ key: "dueDateToolTip", defaultText: "" })}`,
                Cell: (props: any) => {
                    const dueDateISOTimestamp = props.cell.value as string;
                    const dueDate = formatDate(dueDateISOTimestamp);
                    return <Text>{dueDate}</Text>;
                }
            },
            {
                Header: `${i18n.getText({ key: "amount", defaultText: "" })}`,
                accessor: "total",
                headerTooltip: `${i18n.getText({ key: "amountToolTip", defaultText: "" })}`
            },
            {
                Header: `${i18n.getText({ key: "status", defaultText: "" })}`,
                accessor: "statuses",
                headerTooltip: `${i18n.getText({ key: "statusToolTip", defaultText: "" })}`,
                Cell: (props: any) => {
                    const workflowStatuses = props.cell.value as FlowStatuses;
                    const currentStatus = getCurrentFlowStatus(workflowStatuses);
                    const translationKey = WORKFLOW_STATUS_I18N_KEY_MAPPING[currentStatus] as string;
                    const translatedStatus = i18n.getText({ key: translationKey, defaultText: "" });
                    return <Text wrapping>{translatedStatus}</Text>;
                }
            },
            {
                Header: `${i18n.getText({ key: "currentCV", defaultText: "" })}`,
                accessor: "CV_user_ID",
                headerTooltip: `${i18n.getText({ key: "currentCV", defaultText: "" })}`,
                Cell: (props: any) =>
                    !props.cell.row.original.CV ? <Text>N/A</Text> : <Text>{props.cell.row.original.CV_user_ID}</Text>
            },
            {
                Header: `${i18n.getText({ key: "role", defaultText: "" })}`,
                accessor: "CV.role",
                headerTooltip: `${i18n.getText({ key: "role", defaultText: "" })}`,
                Cell: (props: any) =>
                    !props.cell.row.original.CV ? (
                        <Text>N/A</Text>
                    ) : (
                        <Text>
                            {i18n.getText({
                                key: ROLE_DISPLAY_STRING_I18N_MAPPING[
                                    props.cell.row.original.CV?.role as Roles
                                ] as string,
                                defaultText: ""
                            })}
                        </Text>
                    )
            },
            {
                Header: "",
                accessor: "invoiceID",
                id: "invoiceNavigation",
                width: 64,
                hAlign: TextAlign.Center,
                disableFilters: true,
                disableSortBy: true,
                Cell: (props: any) => {
                    const invoiceID = props.cell.value;
                    return (
                        <>
                            <Button
                                design="Transparent"
                                icon="navigation-right-arrow"
                                onClick={() => {
                                    nav(`/invoices/${invoiceID}`);
                                }}
                            />
                        </>
                    );
                }
            }
        ].filter(Boolean) as AnalyticalTableColumnDefinition[];
    }, [i18n, nav, extractionState]);

    return (
        <Surface style={styles}>
            <AnalyticalTable
                header={
                    <Toolbar design="Transparent" toolbarStyle="Standard">
                        <Title level={"H5"} style={{ ...spacing.sapUiTinyMarginBegin }}>
                            {i18n.getText({ key: titleKey, defaultText: "" })}
                        </Title>
                    </Toolbar>
                }
                filterable
                sortable
                reactTableOptions={{
                    initialState: {
                        sortBy: [
                            {
                                id: sortedBy,
                                desc: false
                            }
                        ]
                    }
                }}
                noDataText={i18n.getText({ key: noDataKey, defaultText: "" })}
                columns={columns}
                data={invoices}
                minRows={3}
            />
        </Surface>
    );
}

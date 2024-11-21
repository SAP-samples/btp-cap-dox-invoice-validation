import {
    Text,
    FlexBox,
    Button,
    Title,
    Toolbar,
    ToolbarSpacer,
    AnalyticalTable,
    AnalyticalTableColumnDefinition
} from "@ui5/webcomponents-react";
import { spacing, useI18nBundle } from "@ui5/webcomponents-react-base";
import "@ui5/webcomponents-icons/dist/delete.js";
import "@ui5/webcomponents-icons/dist/feeder-arrow.js";
import "@ui5/webcomponents-icons/dist/add.js";

import { Retention, Retentions } from "@entities";
import { formatDate } from "@/formatters";
import { ViewState } from "@pages/invoice-details/InvoiceDetails";
import Surface from "@/custom/Surface";
import DeleteButton from "@/custom/DeleteButton";
import { Dispatch, SetStateAction, useCallback, useContext, useMemo } from "react";
import { UserContext } from "@/contexts/UserContext";
import { BASE_URL_CAP } from "@/constants";

export default function RetentionsCard({
    retentions,
    setRetentions,
    retentionsTotal,
    handleChangeRetentionClick,
    setViewState,
    isCVState,
    setDialogState,
    isInvoiceImmutable
}: {
    retentions: Retentions;
    setRetentions: Dispatch<SetStateAction<Retentions>>;
    retentionsTotal: number;
    handleChangeRetentionClick: (retention: Retention) => void;
    setViewState: Dispatch<SetStateAction<ViewState>>;
    isCVState: boolean;
    setDialogState: Dispatch<
        SetStateAction<{
            showDialog: boolean;
            dialogText: string;
            onConfirm: () => void;
        }>
    >;
    isInvoiceImmutable: boolean;
}) {
    const i18n = useI18nBundle("app");
    const { isAdmin } = useContext(UserContext);
    const isUserAdmin = isAdmin();

    const retentionsTable = retentions.map((retention: Retention) => {
        const retentionID = retention.ID!;
        return {
            value: retention.amount?.toString(),
            reason: retention.reason,
            changedBy: retention.modifiedBy,
            changedOn: formatDate(retention.modifiedAt as string),
            buttons: { retentionID, retention }
        };
    });

    const onDeleteRetention = useCallback(
        async (id: string, event: React.MouseEvent<HTMLElement> | undefined) => {
            const button = event?.target as HTMLButtonElement;
            button.disabled = true;
            try {
                const response = await fetch(`${BASE_URL_CAP}/Retentions/${id}`, {
                    method: "DELETE"
                });
                if (response.ok)
                    setRetentions((oldRetentions) =>
                        oldRetentions.filter((retention: Retention) => retention.ID !== id)
                    );
            } catch (err) {
                console.log(err);
            } finally {
                button.disabled = false;
            }
        },
        [setRetentions]
    );

    const retentionsColumns: Array<AnalyticalTableColumnDefinition> = useMemo(() => {
        const columns: Array<AnalyticalTableColumnDefinition> = [
            {
                Header: () => <div>{i18n.getText({ key: "value", defaultText: "" })} in EUR</div>,
                accessor: "value"
            },
            {
                Header: `${i18n.getText({ key: "reason", defaultText: "" })}`,
                accessor: "reason"
            },
            {
                Header: `${i18n.getText({ key: "changedOn", defaultText: "" })}`,
                accessor: `changedOn`
            },
            {
                Header: `${i18n.getText({ key: "changedBy", defaultText: "" })}`,
                accessor: "changedBy"
            }
        ];
        if (!isInvoiceImmutable && (isCVState || isUserAdmin)) {
            columns.push({
                Header: ``,
                accessor: `buttons`,
                width: 105,
                disableFilters: true,
                disableSortBy: true,
                Cell: (props: any) => {
                    const retention = props.cell.value;
                    return (
                        <FlexBox direction="Row">
                            <DeleteButton
                                style={spacing.sapUiTinyMarginBegin}
                                onClickFunction={(event) =>
                                    setDialogState({
                                        showDialog: true,
                                        dialogText: i18n.getText({ key: "deleteRetentionDialog", defaultText: "" }),
                                        onConfirm: () => {
                                            void onDeleteRetention(retention.retentionID, event);
                                            setDialogState((previousState) => ({
                                                ...previousState,
                                                showDialog: false
                                            }));
                                        }
                                    })
                                }
                            />
                            <Button
                                icon="feeder-arrow"
                                design="Transparent"
                                style={spacing.sapUiTinyMarginBegin}
                                onClick={() => handleChangeRetentionClick(retention.retention)}
                            />
                        </FlexBox>
                    );
                }
            });
        }
        return columns;
    }, [handleChangeRetentionClick, i18n, isCVState, isUserAdmin, onDeleteRetention, setDialogState]);

    return (
        <>
            <Surface style={spacing.sapUiMediumMarginTop}>
                <AnalyticalTable
                    header={
                        <Toolbar design="Transparent" toolbarStyle="Standard">
                            <Title level="H5" style={spacing.sapUiTinyMarginBegin}>
                                {i18n.getText({ key: "retentions", defaultText: "" })}
                            </Title>
                            {!isInvoiceImmutable && (isCVState || isUserAdmin) && (
                                <>
                                    <ToolbarSpacer />
                                    <Button
                                        icon="add"
                                        design="Transparent"
                                        onClick={() => setViewState(ViewState.ADD_NEW_RETENTION)}
                                    >
                                        {i18n.getText({ key: "new", defaultText: "" })}
                                    </Button>
                                </>
                            )}
                        </Toolbar>
                    }
                    data={retentionsTable}
                    columns={retentionsColumns}
                    noDataText={i18n.getText({ key: "noRetentions", defaultText: "" })}
                    minRows={2}
                    filterable
                />
                <FlexBox direction="Row" style={spacing.sapUiSmallMarginTop}>
                    <Text style={spacing.sapUiTinyMarginEnd}>
                        {i18n.getText({ key: "totalRetentions", defaultText: "" })}:
                    </Text>
                    <Text style={{ fontWeight: "bold" }}>{retentionsTotal.toFixed(2)}</Text>
                </FlexBox>
            </Surface>
        </>
    );
}

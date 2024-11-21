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

import { Deduction, Deductions } from "@entities";
import { formatDate } from "@/formatters";
import { ViewState } from "@pages/invoice-details/InvoiceDetails";
import Surface from "@/custom/Surface";
import DeleteButton from "@/custom/DeleteButton";
import { Dispatch, SetStateAction, useCallback, useContext, useMemo } from "react";
import { UserContext } from "@/contexts/UserContext";
import { BASE_URL_CAP } from "@/constants";

export default function DeductionsCard({
    deductions,
    setDeductions,
    setViewState,
    deductionsTotal,
    handleChangeDeductionCorrectionClick,
    isCVState,
    setDialogState,
    isInvoiceImmutable
}: {
    deductions: Deductions;
    setDeductions: Dispatch<SetStateAction<Deductions>>;
    setViewState: Dispatch<SetStateAction<ViewState>>;
    deductionsTotal: number;
    handleChangeDeductionCorrectionClick: (deduction: Deduction) => void;
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
    const isUserAdmin: boolean = isAdmin();

    const deductionsTable = deductions.map((deduction: Deduction) => {
        const deductionID = deduction.ID!;
        return {
            position: deduction.positionDescriptor,
            value: deduction.amount?.toString(),
            reason: deduction.reason,
            changedBy: deduction.modifiedBy,
            changedOn: formatDate(deduction.modifiedAt as string),
            buttons: { deductionID, deduction }
        };
    });

    const onDeleteDeduction = useCallback(
        async (id: string, event: React.MouseEvent<HTMLElement> | undefined) => {
            const button = event?.target as HTMLButtonElement;
            button.disabled = true;
            try {
                const response = await fetch(`${BASE_URL_CAP}/Deductions/${id}`, {
                    method: "DELETE"
                });
                if (response.ok)
                    setDeductions((oldDeductions) =>
                        oldDeductions.filter((deduction: Deduction) => deduction.ID !== id)
                    );
            } catch (err) {
                console.log(err);
            } finally {
                button.disabled = false;
            }
        },
        [setDeductions]
    );

    const deductionsColumns: Array<AnalyticalTableColumnDefinition> = useMemo(() => {
        const columns: Array<AnalyticalTableColumnDefinition> = [
            {
                Header: `${i18n.getText({ key: "position", defaultText: "" })}`,
                accessor: "position"
            },
            {
                Header: () => <div>{i18n.getText({ key: "value", defaultText: "" })} in EUR</div>,
                accessor: `value`
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
                    const deduction = props.cell.value;
                    return (
                        <FlexBox direction="Row">
                            <DeleteButton
                                style={spacing.sapUiTinyMarginBegin}
                                onClickFunction={(event) =>
                                    setDialogState({
                                        showDialog: true,
                                        dialogText: i18n.getText({ key: "deleteDeductionDialog", defaultText: "" }),
                                        onConfirm: () => {
                                            void onDeleteDeduction(deduction.deductionID, event);
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
                                onClick={() => handleChangeDeductionCorrectionClick(deduction.deduction)}
                            />
                        </FlexBox>
                    );
                }
            });
        }
        return columns;
    }, [handleChangeDeductionCorrectionClick, i18n, isCVState, isUserAdmin, onDeleteDeduction, setDialogState]);

    return (
        <>
            <Surface style={spacing.sapUiMediumMarginTop}>
                <AnalyticalTable
                    header={
                        <Toolbar design="Transparent" toolbarStyle="Standard">
                            <Title level="H5" style={spacing.sapUiTinyMarginBegin}>
                                {i18n.getText({ key: "deductions", defaultText: "" })}
                            </Title>
                            {!isInvoiceImmutable && (isCVState || isUserAdmin) && (
                                <>
                                    <ToolbarSpacer />
                                    <Button
                                        icon="add"
                                        design="Transparent"
                                        onClick={() => setViewState(ViewState.ADD_NEW_DEDUCTION)}
                                    >
                                        {i18n.getText({ key: "new", defaultText: "" })}
                                    </Button>
                                </>
                            )}
                        </Toolbar>
                    }
                    data={deductionsTable}
                    columns={deductionsColumns}
                    noDataText={i18n.getText({ key: "noDeductions", defaultText: "" })}
                    minRows={2}
                    filterable
                />
                <FlexBox direction="Row" style={spacing.sapUiSmallMarginTop}>
                    <Text style={spacing.sapUiTinyMarginEnd}>
                        {i18n.getText({ key: "totalDeductions", defaultText: "" })}:
                    </Text>
                    <Text style={{ fontWeight: "bold" }}>{deductionsTotal.toFixed(2)}</Text>
                </FlexBox>
            </Surface>
        </>
    );
}

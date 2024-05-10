import {
    FlexBox,
    Input,
    Table,
    TableCell,
    TableColumn,
    TableRow,
    Title,
    Text,
    Button,
    AnalyticalTable,
    AnalyticalTableColumnDefinition,
    Toolbar
} from "@ui5/webcomponents-react";
import { spacing, useI18nBundle } from "@ui5/webcomponents-react-base";
import { useEffect, useMemo, useState } from "react";
import CurrencyFormat from "react-currency-format";

import { Deduction, DeductionVersion, DeductionVersions, Deductions } from "@entities";
import { formatDate } from "@/formatters";
import { BASE_URL_CAP } from "@/constants";
import Surface from "@/custom/Surface";

interface DeductionEntry {
    amount: number;
    reason: string;
}

export default function ChangeDeductionCorrection({
    onCancel,
    deductions,
    focusedDeduction,
    setDeductions
}: {
    onCancel: () => void;
    deductions: Deductions;
    focusedDeduction: Deduction;
    setDeductions: React.Dispatch<React.SetStateAction<Deductions>>;
}) {
    const initialDeduction: DeductionEntry = {
        amount: focusedDeduction.amount as number,
        reason: focusedDeduction.positionDescriptor!
    };

    const [insertedDeduction, setInsertedDeduction] = useState<DeductionEntry>(initialDeduction);
    const i18n = useI18nBundle("app");
    const [deductionVersions, setDeductionVersions] = useState<DeductionVersions>([]);
    const isButtonDisabled = insertedDeduction.amount === ("" as unknown as number) || !insertedDeduction.reason;

    const sendNewDeductionCorrection = async (event: React.MouseEvent<HTMLElement>): Promise<void> => {
        const button = event.target as HTMLButtonElement;
        button.disabled = true;
        try {
            const response = await fetch(`${BASE_URL_CAP}/Deductions(${focusedDeduction.ID})`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    amount: insertedDeduction.amount,
                    reason: insertedDeduction.reason
                })
            });
            if (response.ok) {
                const updatedDeduction: Deduction = (await response.json()) as Deduction;

                const index = deductions.findIndex((d) => d.ID === focusedDeduction.ID);
                // found deduction
                if (index !== -1) {
                    // deduction returned from response does not include corrections => needs to be updated as well
                    const actualUpdatedDeduction = {
                        ...updatedDeduction,
                        createdAt: updatedDeduction.modifiedAt,
                        modifiedAt: updatedDeduction.modifiedAt
                    } as DeductionVersion;
                    deductions[index] = {
                        ...updatedDeduction,
                        corrections: [actualUpdatedDeduction].concat(deductions[index].corrections as DeductionVersions)
                    };
                }
                setDeductions(deductions);
                onCancel();
            }
        } catch (err) {
            console.log(err);
        } finally {
            button.disabled = false;
        }
    };

    useEffect(() => {
        const fetchAllDeductionsVersions = async (): Promise<void> => {
            const response = await fetch(
                `${BASE_URL_CAP}/DeductionVersions?$filter=deduction_ID eq ${focusedDeduction.ID}&$orderby=modifiedAt desc`
            );
            if (response.ok) {
                const data: any = await response.json();
                setDeductionVersions(data.value as DeductionVersions);
            }
        };
        fetchAllDeductionsVersions().catch(console.log);
    }, [focusedDeduction]);

    const previousDeductions = deductionVersions.map((deductionVersion) => {
        return {
            value: deductionVersion.amount,
            reason: deductionVersion.reason,
            changedBy: deductionVersion.modifiedBy,
            changedOn: formatDate(deductionVersion.modifiedAt as string)
        };
    });

    const previousDeductionsColumns: Array<AnalyticalTableColumnDefinition> = useMemo(
        () => [
            {
                Header: () => <div>{i18n.getText({ key: "value", defaultText: "" })} in EUR</div>,
                accessor: "value"
            },
            {
                Header: `${i18n.getText({ key: "reason", defaultText: "" })}`,
                accessor: `reason`
            },
            {
                Header: `${i18n.getText({ key: "changedOn", defaultText: "" })}`,
                accessor: "changedOn"
            },
            {
                Header: `${i18n.getText({ key: "changedBy", defaultText: "" })}`,
                accessor: "changedBy"
            }
        ],
        [i18n]
    );

    return (
        <div>
            <Title level={"H5"}>{i18n.getText({ key: "deductionCorrection", defaultText: "" })}</Title>
            <FlexBox direction="Row" style={{ ...spacing.sapUiMediumMarginTop }}>
                <Text style={{ fontWeight: "bold" }}>{i18n.getText({ key: "positionVariable", defaultText: "" })}</Text>
                <Text style={{ ...spacing.sapUiTinyMarginBegin }}>{focusedDeduction.positionDescriptor}</Text>
            </FlexBox>
            <Title level={"H5"} style={{ ...spacing.sapUiMediumMarginTop, ...spacing.sapUiSmallMarginBegin }}>
                {i18n.getText({ key: "new", defaultText: "" })}
            </Title>
            <Table style={spacing.sapUiTinyMarginTop}>
                <TableColumn slot="columns">
                    <Title level="H6" wrappingType="Normal">
                        {i18n.getText({ key: "value", defaultText: "" })} in EUR
                    </Title>
                </TableColumn>
                <TableColumn slot="columns">
                    <Title level="H6" wrappingType="Normal">
                        {i18n.getText({ key: "reason", defaultText: "" })}
                    </Title>
                </TableColumn>
                <TableRow>
                    <TableCell>
                        <CurrencyFormat
                            style={{ width: "6.5rem", height: "2rem", padding: "0 0.5rem" }}
                            value={insertedDeduction.amount}
                            thousandSeparator={"."}
                            decimalSeparator={","}
                            decimalScale={2}
                            allowNegative={false}
                            onValueChange={(valueObject: any) =>
                                setInsertedDeduction({
                                    ...insertedDeduction,
                                    amount: isNaN(valueObject.floatValue)
                                        ? ("" as unknown as number)
                                        : valueObject.floatValue
                                })
                            }
                        />
                    </TableCell>
                    <TableCell>
                        <Input
                            style={{ maxWidth: 200 }}
                            value={insertedDeduction.reason}
                            onInput={(event: any) =>
                                setInsertedDeduction({
                                    ...insertedDeduction,
                                    reason: event.target.value
                                })
                            }
                        />
                    </TableCell>
                </TableRow>
            </Table>
            <FlexBox direction="Row" style={{ ...spacing.sapUiMediumMarginTop, justifyContent: "flex-end" }}>
                <Button
                    design="Emphasized"
                    onClick={(event) => sendNewDeductionCorrection(event)}
                    disabled={isButtonDisabled}
                >
                    {i18n.getText({ key: "change", defaultText: "" })}
                </Button>
                <Button design="Transparent" onClick={() => onCancel()} style={{ ...spacing.sapUiTinyMarginBegin }}>
                    {i18n.getText({ key: "cancel", defaultText: "" })}
                </Button>
            </FlexBox>
            <Surface style={{ marginBottom: 15, ...spacing.sapUiMediumMarginTop }}>
                <AnalyticalTable
                    header={
                        <Toolbar design="Transparent" toolbarStyle="Standard">
                            <Title level={"H5"} style={{ ...spacing.sapUiTinyMarginBegin }}>
                                {i18n.getText({ key: "previousDeductions", defaultText: "" })}
                            </Title>
                        </Toolbar>
                    }
                    data={previousDeductions}
                    noDataText={i18n.getText({ key: "previousDeductionsNotLoaded", defaultText: "" })}
                    columns={previousDeductionsColumns}
                    minRows={2}
                    filterable
                />
            </Surface>
        </div>
    );
}

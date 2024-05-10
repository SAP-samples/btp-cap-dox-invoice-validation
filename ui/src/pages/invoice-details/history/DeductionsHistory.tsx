import { AnalyticalTable, AnalyticalTableColumnDefinition, Text, Title, Toolbar } from "@ui5/webcomponents-react";
import { spacing, useI18nBundle } from "@ui5/webcomponents-react-base";

import { Deduction, DeductionVersions, Deductions } from "@entities";
import { formatDate } from "@/formatters";
import Surface from "@/custom/Surface";
import { useMemo } from "react";

export default function DeductionsHistory({ deductions }: { deductions: Deductions }) {
    const i18n = useI18nBundle("app");
    const formattedDeductions = deductions.map((deduction: Deduction) => {
        const descriptor = deduction.positionDescriptor as string;
        let correctionsArray = [...(deduction.corrections as DeductionVersions)];
        correctionsArray?.sort(
            (a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime()
        );
        correctionsArray = correctionsArray.map((correction) => {
            return {
                positionDescriptor: descriptor,
                ...correction
            };
        });
        const result = { ...deduction, corrections: correctionsArray.slice(1) };
        return result;
    });

    const formattedDeductionsColumns: Array<AnalyticalTableColumnDefinition> = useMemo(
        () => [
            {
                Header: `${i18n.getText({ key: "position", defaultText: "" })}`,
                accessor: "positionDescriptor"
            },
            {
                Header: () => <div>{i18n.getText({ key: "value", defaultText: "" })} in EUR</div>,
                accessor: "amount"
            },
            {
                Header: `${i18n.getText({ key: "reason", defaultText: "" })}`,
                accessor: "reason"
            },
            {
                Header: `${i18n.getText({ key: "changedOn", defaultText: "" })}`,
                accessor: "modifiedAt",
                Cell: (props: any) => {
                    const date = props.cell.value as string;
                    const formattedDate = formatDate(date);
                    return <Text>{formattedDate}</Text>;
                }
            },
            {
                Header: `${i18n.getText({ key: "changedBy", defaultText: "" })}`,
                accessor: "modifiedBy"
            }
        ],
        [i18n]
    );

    return (
        <Surface>
            <AnalyticalTable
                header={
                    <Toolbar design="Transparent" toolbarStyle="Standard">
                        <Title level={"H5"} style={{ ...spacing.sapUiTinyMarginBegin }}>
                            {i18n.getText({ key: "deductionsHistory", defaultText: "" })}
                        </Title>
                    </Toolbar>
                }
                data={formattedDeductions}
                noDataText={i18n.getText({ key: "noDeductions", defaultText: "" })}
                columns={formattedDeductionsColumns}
                subRowsKey="corrections"
                isTreeTable
                filterable
            />
        </Surface>
    );
}

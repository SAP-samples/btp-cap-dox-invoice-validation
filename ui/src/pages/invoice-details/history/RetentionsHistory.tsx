import { spacing, useI18nBundle } from "@ui5/webcomponents-react-base";
import { AnalyticalTable, AnalyticalTableColumnDefinition, Text, Title, Toolbar } from "@ui5/webcomponents-react";

import { formatDate } from "@/formatters";
import { Retention, RetentionVersions, Retentions } from "@entities";
import Surface from "@/custom/Surface";
import { useMemo } from "react";

export default function RetentionsHistory({ retentions }: { retentions: Retentions }) {
    const i18n = useI18nBundle("app");

    const formattedRetentions = retentions.map((retention: Retention) => {
        const correctionsArray = [...(retention.corrections as RetentionVersions)];
        correctionsArray?.sort(
            (a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime()
        );
        const result = { ...retention, corrections: correctionsArray.slice(1) };
        return result;
    });

    const formattedRetentionsColumns: Array<AnalyticalTableColumnDefinition> = useMemo(
        () => [
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
                            {i18n.getText({ key: "retentionsHistory", defaultText: "" })}
                        </Title>
                    </Toolbar>
                }
                data={formattedRetentions}
                noDataText={i18n.getText({ key: "noRetentions", defaultText: "" })}
                columns={formattedRetentionsColumns}
                subRowsKey="corrections"
                isTreeTable
                filterable
            />
        </Surface>
    );
}

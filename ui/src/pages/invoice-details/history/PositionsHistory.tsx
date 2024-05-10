import { AnalyticalTable, AnalyticalTableColumnDefinition, Text, Title, Toolbar } from "@ui5/webcomponents-react";
import { spacing, useI18nBundle } from "@ui5/webcomponents-react-base";

import { formatDate } from "@/formatters";
import { Position, PositionCorrections, Positions } from "@entities";
import Surface from "@/custom/Surface";
import { useMemo } from "react";

export default function PositionHistory({ positions }: { positions: Positions }) {
    const i18n = useI18nBundle("app");

    const formattedCorrections = positions.map((position: Position) => {
        const descriptor = position.descriptor as string;
        let correctionsArray = [...(position.corrections as PositionCorrections)];
        correctionsArray?.sort(
            (a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime()
        );
        const lastCorrection = correctionsArray.length - 1;
        correctionsArray[lastCorrection].reason = " ";
        correctionsArray = correctionsArray.map((correction) => {
            const revisedUnitQuantity = correction.revisedUnitQuantity as number;
            const revisedUnitPrice = correction.revisedUnitPrice as number;
            return {
                ...correction,
                descriptor: descriptor,
                reason: correction.reason,
                modifiedBy: correction.modifiedBy,
                modifiedAt: correction.modifiedAt,
                revisedUnitPrice: correction.revisedUnitPrice,
                revisedUnitQuantity: correction.revisedUnitQuantity,
                totalAmount: Math.round(revisedUnitQuantity * revisedUnitPrice * 100) / 100
            };
        });
        const result = { ...correctionsArray[0], corrections: correctionsArray.slice(1) };
        return result;
    });

    const formattedCorrectionsColumns: Array<AnalyticalTableColumnDefinition> = useMemo(
        () => [
            {
                Header: `${i18n.getText({ key: "position", defaultText: "" })}`,
                accessor: "descriptor",
                width: 150
            },
            {
                Header: `${i18n.getText({ key: "quantity", defaultText: "" })}`,
                accessor: "revisedUnitQuantity",
                width: 140
            },
            {
                Header: () => (
                    <div>
                        {i18n.getText({ key: "unitPrice", defaultText: "" })} <br /> in EUR
                    </div>
                ),
                accessor: "revisedUnitPrice"
            },
            {
                Header: () => (
                    <div>
                        {i18n.getText({ key: "totalAmount", defaultText: "" })} <br /> in EUR
                    </div>
                ),
                accessor: `totalAmount`
            },
            {
                Header: `${i18n.getText({ key: "reason", defaultText: "" })}`,
                accessor: "reason",
                width: 150
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
                            {i18n.getText({ key: "positionsHistory", defaultText: "" })}
                        </Title>
                    </Toolbar>
                }
                data={formattedCorrections}
                noDataText={i18n.getText({ key: "noPositionCorrections", defaultText: "" })}
                columns={formattedCorrectionsColumns}
                subRowsKey="corrections"
                filterable
                isTreeTable
            />
        </Surface>
    );
}

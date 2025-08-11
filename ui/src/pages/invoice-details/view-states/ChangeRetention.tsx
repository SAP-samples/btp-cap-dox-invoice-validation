import {
    Title,
    Table,
    TableColumn,
    TableRow,
    TableCell,
    Input,
    FlexBox,
    Button,
    AnalyticalTable,
    AnalyticalTableColumnDefinition,
    Toolbar
} from "@ui5/webcomponents-react";
import { spacing, useI18nBundle } from "@ui5/webcomponents-react-base";
import { useEffect, useMemo, useState } from "react";
import { NumericFormat } from "react-number-format";

import { BASE_URL_CAP } from "@/constants";
import { formatDate } from "@/formatters";
import { Retention, RetentionVersion, RetentionVersions, Retentions } from "@entities";
import Surface from "@/custom/Surface";

export default function ChangeRetention({
    retentions,
    setRetentions,
    onCancel,
    focusedRetention
}: {
    retentions: Retentions;
    setRetentions: React.Dispatch<React.SetStateAction<Retentions>>;
    onCancel: () => void;
    focusedRetention: Retention;
}) {
    const i18n = useI18nBundle("app");

    const initialRetention: Retention = {
        amount: focusedRetention.amount as number,
        reason: focusedRetention.reason
    };
    const [insertedRetention, setInsertedRetention] = useState(initialRetention);
    const isButtonDisabled = insertedRetention.amount === ("" as unknown as number) || !insertedRetention.reason;

    const [retentionVersions, setRetentionVersions] = useState<RetentionVersions>([]);
    const sendNewRetentionCorrection = async (event: React.MouseEvent<HTMLElement>): Promise<void> => {
        const button = event.target as HTMLButtonElement;
        button.disabled = true;
        try {
            const response = await fetch(`${BASE_URL_CAP}/Retentions(${focusedRetention.ID})`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    amount: insertedRetention.amount,
                    reason: insertedRetention.reason
                })
            });
            if (response.ok) {
                const updatedRetention: Retention = (await response.json()) as Retention;
                const index = retentions.findIndex((r) => r.ID === focusedRetention.ID);
                // found retention
                if (index !== -1) {
                    // retention returned from response does not include corrections => needs to be updated as well
                    const actualUpdatedRetention = {
                        ...updatedRetention,
                        createdAt: updatedRetention.modifiedAt,
                        modifiedAt: updatedRetention.modifiedAt
                    } as RetentionVersion;
                    retentions[index] = {
                        ...updatedRetention,
                        corrections: [actualUpdatedRetention].concat(retentions[index].corrections as RetentionVersions)
                    };
                }
                setRetentions(retentions);
                onCancel();
            }
        } catch (err) {
            console.log(err);
        } finally {
            button.disabled = false;
        }
    };

    useEffect(() => {
        const fetchAllRetentions = async (): Promise<void> => {
            const response = await fetch(
                `${BASE_URL_CAP}/RetentionVersions?$filter=retention_ID eq ${focusedRetention.ID}&$orderby=modifiedAt desc`
            );
            if (response.ok) {
                const data: any = await response.json();
                setRetentionVersions(data.value as RetentionVersions);
            }
        };
        fetchAllRetentions().catch(console.log);
    }, [focusedRetention]);

    const previousRetentions = retentionVersions.map((retentionVersion) => {
        return {
            value: retentionVersion.amount,
            reason: retentionVersion.reason,
            changedBy: retentionVersion.modifiedBy,
            changedOn: formatDate(retentionVersion.modifiedAt as string)
        };
    });

    const previousRetentionsColumns: Array<AnalyticalTableColumnDefinition> = useMemo(
        () => [
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
        <>
            <Title level={"H5"}>{i18n.getText({ key: "retentionCorrection", defaultText: "" })}</Title>
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
                        <NumericFormat
                            style={{ width: "6.5rem", height: "2rem", padding: "0 0.5rem" }}
                            value={insertedRetention.amount}
                            thousandSeparator={"."}
                            decimalSeparator={","}
                            decimalScale={2}
                            allowNegative={false}
                            onValueChange={(valueObject: any) =>
                                setInsertedRetention({
                                    ...insertedRetention,
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
                            value={insertedRetention.reason as string}
                            onInput={(event: any) =>
                                setInsertedRetention({
                                    ...insertedRetention,
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
                    onClick={(event) => sendNewRetentionCorrection(event)}
                    disabled={isButtonDisabled}
                >
                    {i18n.getText({ key: "change", defaultText: "" })}
                </Button>
                <Button design="Transparent" onClick={() => onCancel()} style={{ ...spacing.sapUiTinyMarginBegin }}>
                    {i18n.getText({ key: "cancel", defaultText: "" })}
                </Button>
            </FlexBox>
            <Surface style={{ ...spacing.sapUiMediumMarginTop }}>
                <AnalyticalTable
                    header={
                        <Toolbar design="Transparent" toolbarStyle="Standard">
                            <Title level={"H5"} style={{ ...spacing.sapUiTinyMarginBegin }}>
                                {i18n.getText({ key: "previousRetentions", defaultText: "" })}
                            </Title>
                        </Toolbar>
                    }
                    data={previousRetentions}
                    noDataText={i18n.getText({ key: "previousRetentionsNotLoaded", defaultText: "" })}
                    columns={previousRetentionsColumns}
                    minRows={2}
                    filterable
                />
            </Surface>
        </>
    );
}

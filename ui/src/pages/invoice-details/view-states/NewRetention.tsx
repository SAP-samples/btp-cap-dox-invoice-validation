import {
    Button,
    ButtonDomRef,
    FlexBox,
    Input,
    Table,
    TableCell,
    TableColumn,
    TableRow,
    Title
} from "@ui5/webcomponents-react";
import { spacing, useI18nBundle } from "@ui5/webcomponents-react-base";
import React, { MouseEventHandler, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import CurrencyFormat from "react-currency-format";

import { Invoice, Retention, Retentions } from "@entities";
import { BASE_URL_CAP } from "@/constants";

export default function NewRetention({
    onCancel,
    invoice,
    setRetentions
}: {
    onCancel: () => void;
    invoice: Invoice;
    setRetentions: React.Dispatch<React.SetStateAction<Retentions>>;
}) {
    const i18n = useI18nBundle("app");
    const initialRetention: Retention = {
        amount: "" as unknown as number,
        reason: ""
    };

    const [insertedRetention, setInsertedRetention] = useState<Retention>(initialRetention);
    const isButtonDisabled = insertedRetention.amount === ("" as unknown as number) || !insertedRetention.reason;

    const onSaveRetention: MouseEventHandler<ButtonDomRef> = async (event: React.MouseEvent<HTMLElement>) => {
        const button = event.target as HTMLButtonElement;
        button.disabled = true;
        try {
            const response = await fetch(`${BASE_URL_CAP}/Retentions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    amount: insertedRetention.amount,
                    reason: insertedRetention.reason,
                    invoice_invoiceID: invoice.invoiceID
                })
            });
            if (response.ok) {
                const createdRetention = (await response.json()) as Retention;
                setRetentions((prevRetentions) => [
                    ...prevRetentions,
                    {
                        ...createdRetention,
                        corrections: [
                            {
                                ID: uuidv4(),
                                amount: createdRetention.amount,
                                reason: createdRetention.reason,
                                createdAt: createdRetention.createdAt,
                                createdBy: createdRetention.createdBy,
                                modifiedAt: createdRetention.modifiedAt,
                                modifiedBy: createdRetention.modifiedBy
                            }
                        ]
                    }
                ]);
                setInsertedRetention(initialRetention);
                onCancel();
            }
        } catch (err) {
            console.log(err);
        } finally {
            button.disabled = false;
        }
    };
    return (
        <>
            <Title level={"H5"} style={spacing.sapUiMediumMarginBottom}>
                {i18n.getText({ key: "addNewRetention", defaultText: "" })}
            </Title>
            <Table>
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
            <FlexBox direction="Row" style={{ ...spacing.sapUiLargeMarginTop, justifyContent: "flex-end" }}>
                <Button design="Emphasized" disabled={isButtonDisabled} onClick={onSaveRetention}>
                    {i18n.getText({ key: "insert", defaultText: "" })}
                </Button>
                <Button design="Transparent" style={{ ...spacing.sapUiTinyMarginBegin }} onClick={onCancel}>
                    {i18n.getText({ key: "cancel", defaultText: "" })}
                </Button>
            </FlexBox>
        </>
    );
}

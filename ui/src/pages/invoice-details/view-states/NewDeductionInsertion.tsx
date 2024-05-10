import {
    FlexBox,
    Title,
    Button,
    Input,
    Table,
    TableColumn,
    TableRow,
    TableCell,
    ButtonDomRef,
    Text,
    ValueState
} from "@ui5/webcomponents-react";
import { spacing, useI18nBundle } from "@ui5/webcomponents-react-base";
import { MouseEventHandler, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import CurrencyFormat from "react-currency-format";

import { BASE_URL_CAP } from "@/constants";
import { Deduction, Deductions, Invoice } from "@entities";

interface DeductionEntry {
    position: string;
    amount: number;
    reason: string;
}

export default function NewDeductionInsertion({
    onCancel,
    setDeductions,
    invoice
}: {
    onCancel: () => void;
    setDeductions: React.Dispatch<React.SetStateAction<Deductions>>;
    invoice: Invoice;
}) {
    const initialDeduction: DeductionEntry = {
        position: "",
        amount: "" as unknown as number,
        reason: ""
    };
    const [insertedDeduction, setInsertedDeduction] = useState<DeductionEntry>(initialDeduction);
    const [positionValueState, setPositionValueState] = useState(ValueState.None);

    const isButtonDisabled =
        !insertedDeduction.position ||
        insertedDeduction.amount === ("" as unknown as number) ||
        !insertedDeduction.reason ||
        positionValueState === ValueState.Error;

    const onChangePositionInput = (event: any) => {
        const inputValue = event.target.value;
        const att: string = event.target.id.replace("Input", "");
        setInsertedDeduction({
            ...insertedDeduction,
            [att]: inputValue
        });
        setPositionValueState(ValueState.None);
        if (!invoice.deductions) return;
        for (const deduction of invoice.deductions) {
            if (deduction.positionDescriptor === inputValue) {
                setPositionValueState(ValueState.Error);
                break;
            }
        }
    };

    const onChangeReasonInput = (event: any) => {
        const inputValue = event.target.value;
        const att: string = event.target.id.replace("Input", "");
        setInsertedDeduction({
            ...insertedDeduction,
            [att]: inputValue
        });
    };

    const onSaveDeduction: MouseEventHandler<ButtonDomRef> = async (event: React.MouseEvent<HTMLElement>) => {
        const button = event.target as HTMLButtonElement;
        button.disabled = true;
        try {
            const response = await fetch(`${BASE_URL_CAP}/Deductions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    positionDescriptor: insertedDeduction.position,
                    amount: insertedDeduction.amount,
                    reason: insertedDeduction.reason,
                    invoice_invoiceID: invoice.invoiceID
                })
            });
            if (response.ok) {
                const createdDeduction = (await response.json()) as Deduction;
                setDeductions((prevDeductions) => [
                    ...prevDeductions,
                    {
                        ...createdDeduction,
                        corrections: [
                            {
                                ID: uuidv4(),
                                amount: createdDeduction.amount,
                                reason: createdDeduction.reason,
                                createdAt: createdDeduction.createdAt,
                                createdBy: createdDeduction.createdBy,
                                modifiedAt: createdDeduction.modifiedAt,
                                modifiedBy: createdDeduction.modifiedBy
                            }
                        ]
                    }
                ]);
                setInsertedDeduction(initialDeduction);
                onCancel();
            }
        } catch (err) {
            console.log(err);
        } finally {
            button.disabled = false;
        }
    };

    const blockNegativeNumbers = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.currentTarget.value === "" && e.key === "-") {
            e.preventDefault();
        }
    };

    const i18n = useI18nBundle("app");
    return (
        <>
            <Title level={"H5"} style={spacing.sapUiMediumMarginBottom}>
                {i18n.getText({ key: "addNewDeduction", defaultText: "" })}
            </Title>
            <Table>
                <TableColumn slot="columns">
                    <Title level="H6" wrappingType="Normal">
                        {i18n.getText({ key: "position", defaultText: "" })}
                    </Title>
                </TableColumn>
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
                        <Input
                            id="positionInput"
                            onKeyDown={blockNegativeNumbers}
                            value={insertedDeduction.position}
                            onInput={onChangePositionInput}
                            style={{ maxWidth: 140 }}
                            valueState={positionValueState}
                            valueStateMessage={
                                <Text>{i18n.getText({ key: "positionIsAvailable", defaultText: "" })}</Text>
                            }
                        />
                    </TableCell>
                    <TableCell>
                        <CurrencyFormat
                            style={{ width: "6.5rem", height: "2rem", padding: "0 0.5rem" }}
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
                            id="reasonInput"
                            value={insertedDeduction.reason}
                            onInput={onChangeReasonInput}
                            style={{ maxWidth: 200 }}
                        />
                    </TableCell>
                </TableRow>
            </Table>
            <FlexBox direction="Row" style={{ ...spacing.sapUiLargeMarginTop, justifyContent: "flex-end" }}>
                <Button design="Emphasized" disabled={isButtonDisabled} onClick={onSaveDeduction}>
                    {i18n.getText({ key: "insert", defaultText: "" })}
                </Button>
                <Button design="Transparent" style={{ ...spacing.sapUiTinyMarginBegin }} onClick={onCancel}>
                    {i18n.getText({ key: "cancel", defaultText: "" })}
                </Button>
            </FlexBox>
        </>
    );
}

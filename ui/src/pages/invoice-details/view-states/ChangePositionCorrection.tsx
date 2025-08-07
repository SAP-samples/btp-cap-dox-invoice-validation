import {
    Text,
    Title,
    FlexBox,
    TableRow,
    Table,
    TableColumn,
    TableCell,
    TextArea,
    Button,
    Card,
    Toolbar,
    AnalyticalTable,
    AnalyticalTableColumnDefinition
} from "@ui5/webcomponents-react";
import { spacing, useI18nBundle } from "@ui5/webcomponents-react-base";
import { useState, useMemo, useEffect } from "react";
import "@ui5/webcomponents/dist/features/InputElementsFormSupport.js";
import { NumericFormat } from "react-number-format";

import { Position, Positions, PositionCorrection } from "@entities";
import { BASE_URL_CAP } from "@/constants";
import { formatDate } from "@/formatters";
import Surface from "@/custom/Surface";
import { CorrectionSession } from "../InvoiceDetails";

export default function ChangePositionCorrection({
    correctionSession,
    onCancel,
    positions,
    setPositions
}: {
    correctionSession: CorrectionSession;
    onCancel: () => void;
    positions: Positions;
    setPositions: React.Dispatch<React.SetStateAction<Positions>>;
}) {
    const [amount, setAmount] = useState(correctionSession.previousCorrections[0].revisedUnitQuantity as number);
    const [price, setPrice] = useState(correctionSession.previousCorrections[0].revisedUnitPrice as number);
    const [reason, setReason] = useState<string>(
        correctionSession.position.corrections ? (correctionSession.position.corrections[0].reason as string) : ""
    );

    useEffect(() => {
        setAmount(correctionSession.previousCorrections[0].revisedUnitQuantity as number);
        setPrice(correctionSession.previousCorrections[0].revisedUnitPrice as number);
        setReason(
            correctionSession.position.corrections ? (correctionSession.position.corrections[0].reason as string) : ""
        );
    }, [correctionSession]);

    const isButtonDisabled = amount.toString() === "" || price.toString() === "" || isNaN(amount) || isNaN(price);

    const i18n = useI18nBundle("app");

    async function sendNewCorrection(event: React.MouseEvent<HTMLElement>): Promise<void> {
        const button = event.target as HTMLButtonElement;
        button.disabled = true;
        try {
            const response = await fetch(BASE_URL_CAP + `/PositionCorrections`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    position_ID: correctionSession.position.ID,
                    revisedUnitQuantity: amount,
                    revisedUnitPrice: price,
                    reason: reason
                })
            });
            if (response.ok) {
                const latestCorrection = (await response.json()) as PositionCorrection;
                populateLatestCorrection(latestCorrection);
                // go back to invoice correction view
                onCancel();
            }
        } catch (err) {
            console.log(err);
        } finally {
            button.disabled = false;
        }
    }

    function populateLatestCorrection(correction: PositionCorrection): void {
        const positionID = (correction as PositionCorrection & { position_ID: string }).position_ID;
        const relatedPosition = positions.find((p) => p.ID === positionID) as Position;
        relatedPosition.corrections?.unshift(correction);
        setPositions(positions);
    }

    const calculateTotalPrice = () => {
        const totalPrice = Math.round(amount * price * 100) / 100;
        if (isNaN(totalPrice)) {
            return "0";
        } else {
            return totalPrice;
        }
    };

    const previousCorrections = correctionSession.previousCorrections.map((correction: PositionCorrection) => {
        const revisedUnitQuantity = correction.revisedUnitQuantity as number;
        const revisedUnitPrice = correction.revisedUnitPrice as number;
        return {
            quantity: correction.revisedUnitQuantity,
            unitPrice: correction.revisedUnitPrice,
            totalAmount: Math.round(revisedUnitQuantity * revisedUnitPrice * 100) / 100,
            changedBy: correction.modifiedBy,
            changedOn: formatDate(correction.createdAt as string),
            reason: correction.reason
        };
    });

    const previousCorrectionsColumns: Array<AnalyticalTableColumnDefinition> = useMemo(
        () => [
            {
                Header: `${i18n.getText({ key: "quantity", defaultText: "" })}`,
                accessor: "quantity"
            },
            {
                Header: () => (
                    <div>
                        {i18n.getText({ key: "unitPrice", defaultText: "" })} <br /> in EUR
                    </div>
                ),
                accessor: `unitPrice`
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
            <Title level={"H5"}>{i18n.getText({ key: "correctionUpdate", defaultText: "" })}</Title>
            <FlexBox direction="Row" style={{ ...spacing.sapUiMediumMarginTop, ...spacing.sapUiSmallMarginBegin }}>
                <Text style={{ fontWeight: "bold", alignSelf: "center" }}>
                    Index:{correctionSession.position.index}
                </Text>
            </FlexBox>
            <FlexBox direction="Row" style={{ ...spacing.sapUiMediumMarginTop }}>
                <Text style={{ fontWeight: "bold" }}>{i18n.getText({ key: "positionVariable", defaultText: "" })}</Text>
                <Text style={spacing.sapUiTinyMarginBegin}>{correctionSession.position.descriptor}</Text>
            </FlexBox>
            <Title level={"H5"} style={{ ...spacing.sapUiMediumMarginTop, ...spacing.sapUiSmallMarginBegin }}>
                {i18n.getText({ key: "new", defaultText: "" })}
            </Title>
            <Table style={spacing.sapUiTinyMarginTop}>
                <TableColumn slot="columns">
                    <Title level="H6" wrappingType="Normal">
                        {i18n.getText({ key: "quantity", defaultText: "" })}
                    </Title>
                </TableColumn>
                <TableColumn slot="columns">
                    <Title level="H6" wrappingType="Normal">
                        {i18n.getText({ key: "unitPrice", defaultText: "" })}
                        <br />
                        in EUR
                    </Title>
                </TableColumn>
                <TableColumn slot="columns">
                    <Title level="H6" wrappingType="Normal">
                        {i18n.getText({ key: "totalAmount", defaultText: "" })} <br />
                        in EUR
                    </Title>
                </TableColumn>
                <TableRow>
                    <TableCell>
                        <NumericFormat
                            style={{ width: "5rem", height: "1.8rem", padding: "0 0.5rem" }}
                            thousandSeparator={"."}
                            decimalSeparator={","}
                            decimalScale={2}
                            value={amount}
                            allowNegative={false}
                            onValueChange={(valueObject: any) => {
                                isNaN(valueObject.floatValue)
                                    ? setAmount("" as unknown as number)
                                    : setAmount(valueObject.floatValue);
                            }}
                        />
                    </TableCell>
                    <TableCell>
                        <NumericFormat
                            style={{ width: "6.5rem", height: "1.8rem", padding: "0 0.5rem" }}
                            thousandSeparator={"."}
                            decimalSeparator={","}
                            decimalScale={2}
                            value={price}
                            allowNegative={false}
                            onValueChange={(valueObject: any) => {
                                isNaN(valueObject.floatValue)
                                    ? setPrice("" as unknown as number)
                                    : setPrice(valueObject.floatValue);
                            }}
                        />
                    </TableCell>
                    <TableCell>
                        <NumericFormat
                            displayType={"text"}
                            thousandSeparator={"."}
                            decimalSeparator={","}
                            value={calculateTotalPrice()}
                        />
                    </TableCell>
                </TableRow>
            </Table>
            <Card style={{ ...spacing.sapUiMediumMarginTop, maxWidth: "80%" }}>
                <Toolbar design="Transparent" toolbarStyle="Standard">
                    <Title level={"H5"} style={{ ...spacing.sapUiTinyMarginBegin }}>
                        {i18n.getText({ key: "reasons", defaultText: "" })}
                    </Title>
                </Toolbar>
                <TextArea
                    rows={5}
                    style={{
                        paddingTop: "0.2rem",
                        paddingRight: "1.4rem",
                        paddingBottom: "1rem",
                        paddingLeft: "1.4rem"
                    }}
                    value={reason}
                    onChange={(event) => setReason(event.target.value as string)}
                />
            </Card>
            <FlexBox direction="Row" style={{ ...spacing.sapUiMediumMarginTop, justifyContent: "flex-end" }}>
                <Button
                    design="Emphasized"
                    disabled={isButtonDisabled}
                    onClick={(event) => sendNewCorrection(event).catch(console.log)}
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
                                {i18n.getText({ key: "previousCorrection", defaultText: "" })}
                            </Title>
                        </Toolbar>
                    }
                    data={previousCorrections}
                    noDataText={i18n.getText({ key: "previousCorrectionsNotLoaded", defaultText: "" })}
                    columns={previousCorrectionsColumns}
                    minRows={2}
                    filterable
                />
            </Surface>
        </>
    );
}

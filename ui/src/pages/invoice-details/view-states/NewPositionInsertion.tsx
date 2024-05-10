import React, { MouseEventHandler, useEffect, useState } from "react";
import {
    Text,
    Title,
    FlexBox,
    Input,
    TableRow,
    Table,
    TableColumn,
    TableCell,
    TextArea,
    Button,
    ValueState,
    Card,
    Toolbar,
    ButtonDomRef,
    MessageStrip
} from "@ui5/webcomponents-react";
import { spacing, useI18nBundle } from "@ui5/webcomponents-react-base";
import { v4 as uuidv4 } from "uuid";
import CurrencyFormat from "react-currency-format";

import { BASE_URL_CAP } from "@/constants";
import { Positions } from "@entities";

export default function NewPositionInsertion({
    id,
    handleBackAndSaveButton,
    positions,
    setPositions,
    initialValues,
    setInitialValues
}: {
    id: string;
    handleBackAndSaveButton: () => void;
    positions: Positions;
    setPositions: React.Dispatch<React.SetStateAction<Positions>>;
    initialValues: any;
    setInitialValues: React.Dispatch<React.SetStateAction<any>>;
}) {
    const [index, setIndex] = useState<string>("");
    const [inputNewPosition, setInputNewPosition] = useState<string>("");
    const [initialQuantity, setInitialQuantity] = useState("" as unknown as number);
    const [initialPrice, setInitialPrice] = useState("" as unknown as number);
    const [revisedQuantity, setRevisedQuantity] = useState("" as unknown as number);
    const [revisedPrice, setRevisedPrice] = useState("" as unknown as number);
    const [reason, setReason] = useState<string>("");
    const [valueState, setValueState] = useState(ValueState.None);
    const [indexValueState, setIndexValueState] = useState(ValueState.None);
    const [showMessageStrip, setShowMessageStrip] = useState<boolean>(false);
    const isButtonDisabled =
        isNaN(parseInt(index)) ||
        index == "" ||
        inputNewPosition === "" ||
        valueState === ValueState.Error ||
        indexValueState === ValueState.Error ||
        isNaN(initialQuantity) ||
        initialQuantity.toString() === "" ||
        isNaN(initialPrice) ||
        initialPrice.toString() === "" ||
        isNaN(revisedQuantity) ||
        revisedQuantity.toString() === "" ||
        isNaN(revisedPrice) ||
        revisedPrice.toString() == "" ||
        showMessageStrip;
    const positionsUrl = `${BASE_URL_CAP}/Positions`;
    const positionCorrectionUrl = `${BASE_URL_CAP}/PositionCorrections`;
    const initialTotal = Math.round(initialQuantity * initialPrice * 100) / 100;
    const revisedTotal = Math.round(revisedQuantity * revisedPrice * 100) / 100;
    const i18n = useI18nBundle("app");

    //POST request logic
    const postData = async (url: string, data: any) => {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`Response failed with code ${response.status}`);
            }
            const json = await response.json();
            return json;
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (!initialValues) return;
        setIndex(initialValues.index);
        setInputNewPosition(initialValues.position ? initialValues.position : "");
        setInitialQuantity(initialValues.quantity);
        setInitialPrice(initialValues.unitPrice);
        setRevisedQuantity(initialValues.quantity);
        setRevisedPrice(initialValues.unitPrice);
        setInitialValues(null);
    }, [initialValues]);
    //Save button and payload logics
    const onSave: MouseEventHandler<ButtonDomRef> = async (event: React.MouseEvent<HTMLElement>) => {
        const button = event.target as HTMLButtonElement;
        button.disabled = true;
        try {
            //Payload for creating new postion
            const uuid = uuidv4();
            const positionResponse = await postData(positionsUrl, {
                index: parseInt(index),
                ID: uuid,
                descriptor: inputNewPosition,
                invoice_invoiceID: id
            });

            //Payload for inital quantity and price
            const positionPreviousCorrection = await postData(positionCorrectionUrl, {
                position_ID: positionResponse.ID,
                revisedUnitQuantity: initialQuantity,
                revisedUnitPrice: initialPrice,
                reason: reason
            });

            //Payload for revised quantity and price
            const positionCurrentCorrection = await postData(positionCorrectionUrl, {
                position_ID: positionResponse.ID,
                revisedUnitQuantity: revisedQuantity,
                revisedUnitPrice: revisedPrice,
                reason: reason
            });
            positionResponse.corrections = [positionCurrentCorrection, positionPreviousCorrection];
            positions.push(positionResponse);
            setPositions(positions);
            handleBackAndSaveButton();
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

    useEffect(() => {
        if (
            initialQuantity !== ("" as unknown as number) &&
            initialPrice !== ("" as unknown as number) &&
            revisedQuantity !== ("" as unknown as number) &&
            revisedPrice !== ("" as unknown as number) &&
            initialQuantity === revisedQuantity &&
            initialPrice === revisedPrice
        ) {
            setShowMessageStrip(true);
        } else setShowMessageStrip(false);
    }, [initialQuantity, revisedQuantity, initialPrice, revisedPrice]);

    return (
        <>
            <Title level={"H5"}>{i18n.getText({ key: "correctNewPosition", defaultText: "" })}</Title>
            <FlexBox direction="Row" style={{ ...spacing.sapUiMediumMarginTop, ...spacing.sapUiSmallMarginBegin }}>
                <Text style={{ fontWeight: "bold", alignSelf: "center" }}>Index:</Text>
                <Input
                    style={{ width: "5.92rem", ...spacing.sapUiSmallMarginBegin }}
                    value={index}
                    onInput={(event: any) => {
                        const inputValue = event.target.value;
                        setIndex(inputValue);
                        setIndexValueState(ValueState.None);
                        for (const position of positions) {
                            if (position.index === parseInt(inputValue)) {
                                setIndexValueState(ValueState.Error);
                                break;
                            }
                        }
                    }}
                    type={"Number"}
                    valueState={indexValueState}
                    valueStateMessage={<Text>{i18n.getText({ key: "indexIsAvailable", defaultText: "" })}</Text>}
                />
            </FlexBox>
            <FlexBox direction="Row" style={{ ...spacing.sapUiMediumMarginTop, ...spacing.sapUiSmallMarginBegin }}>
                <Text style={{ fontWeight: "bold", alignSelf: "center" }}>
                    {i18n.getText({ key: "positionVariable", defaultText: "" })}
                </Text>
                <Input
                    style={{ width: "160px", ...spacing.sapUiSmallMarginBegin }}
                    value={inputNewPosition}
                    onKeyDown={blockNegativeNumbers}
                    onInput={(event) => {
                        const inputValue = event.target.value;
                        const position = positions.find((element) => element.descriptor === inputValue);
                        position ? setValueState(ValueState.Error) : setValueState(ValueState.None);

                        setInputNewPosition(inputValue as string);
                    }}
                    valueState={valueState}
                    valueStateMessage={<Text>{i18n.getText({ key: "positionIsAvailable", defaultText: "" })}</Text>}
                />
            </FlexBox>
            <Title level={"H5"} style={{ ...spacing.sapUiLargeMarginTop, ...spacing.sapUiSmallMarginBegin }}>
                {i18n.getText({ key: "inInvoice", defaultText: "" })}
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
                        <br /> in EUR
                    </Title>
                </TableColumn>
                <TableColumn slot="columns">
                    <Title level="H6" wrappingType="Normal">
                        {i18n.getText({ key: "totalAmount", defaultText: "" })}
                        <br /> in EUR
                    </Title>
                </TableColumn>
                <TableRow>
                    <TableCell>
                        <CurrencyFormat
                            style={{ width: "5rem", height: "1.8rem", padding: "0 0.5rem" }}
                            thousandSeparator={"."}
                            decimalSeparator={","}
                            decimalScale={2}
                            value={initialQuantity}
                            allowNegative={false}
                            onValueChange={(valueObject: any) => {
                                if (!isNaN(valueObject.floatValue)) {
                                    setInitialQuantity(valueObject.floatValue);
                                    setRevisedQuantity(valueObject.floatValue);
                                } else {
                                    setInitialQuantity("" as unknown as number);
                                    setRevisedQuantity("" as unknown as number);
                                }
                            }}
                        />
                    </TableCell>
                    <TableCell>
                        <CurrencyFormat
                            style={{ width: "6.5rem", height: "1.8rem", padding: "0 0.5rem" }}
                            thousandSeparator={"."}
                            decimalSeparator={","}
                            decimalScale={2}
                            value={initialPrice}
                            allowNegative={false}
                            onValueChange={(valueObject: any) => {
                                if (!isNaN(valueObject.floatValue)) {
                                    setInitialPrice(valueObject.floatValue);
                                    setRevisedPrice(valueObject.floatValue);
                                } else {
                                    setInitialPrice("" as unknown as number);
                                    setRevisedPrice("" as unknown as number);
                                }
                            }}
                        />
                    </TableCell>
                    <TableCell>
                        <CurrencyFormat
                            displayType={"text"}
                            thousandSeparator={"."}
                            decimalSeparator={","}
                            value={isNaN(initialTotal) ? 0 : initialTotal}
                        />
                    </TableCell>
                </TableRow>
            </Table>

            <Title level={"H5"} style={{ ...spacing.sapUiMediumMarginTop, ...spacing.sapUiSmallMarginBegin }}>
                {i18n.getText({ key: "corrected", defaultText: "" })}
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
                        <br /> in EUR
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
                        <CurrencyFormat
                            style={{ width: "5rem", height: "1.8rem", padding: "0 0.5rem" }}
                            thousandSeparator={"."}
                            decimalSeparator={","}
                            decimalScale={2}
                            value={revisedQuantity}
                            allowNegative={false}
                            onValueChange={(valueObject: any) => {
                                isNaN(valueObject.floatValue)
                                    ? setRevisedQuantity("" as unknown as number)
                                    : setRevisedQuantity(valueObject.floatValue);
                            }}
                        />
                    </TableCell>
                    <TableCell>
                        <CurrencyFormat
                            style={{ width: "6.5rem", height: "1.8rem", padding: "0 0.5rem" }}
                            thousandSeparator={"."}
                            decimalSeparator={","}
                            decimalScale={2}
                            value={revisedPrice}
                            allowNegative={false}
                            onValueChange={(valueObject: any) => {
                                isNaN(valueObject.floatValue)
                                    ? setRevisedPrice("" as unknown as number)
                                    : setRevisedPrice(valueObject.floatValue);
                            }}
                        />
                    </TableCell>
                    <TableCell>
                        <CurrencyFormat
                            displayType={"text"}
                            thousandSeparator={"."}
                            decimalSeparator={","}
                            value={isNaN(revisedTotal) ? 0 : revisedTotal}
                        />
                    </TableCell>
                </TableRow>
            </Table>
            {showMessageStrip && (
                <MessageStrip
                    design="Warning"
                    onClose={() => setShowMessageStrip(false)}
                    style={{ width: 400, marginTop: 10 }}
                >
                    {i18n.getText({ key: "warning", defaultText: "" })}
                </MessageStrip>
            )}
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
                <Button design="Emphasized" onClick={onSave} disabled={isButtonDisabled}>
                    {i18n.getText({ key: "insert", defaultText: "" })}
                </Button>
                <Button
                    design="Transparent"
                    onClick={() => handleBackAndSaveButton()}
                    style={{ ...spacing.sapUiTinyMarginBegin }}
                >
                    {i18n.getText({ key: "cancel", defaultText: "" })}
                </Button>
            </FlexBox>
        </>
    );
}

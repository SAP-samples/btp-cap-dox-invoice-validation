import { Position, PositionCorrections, Positions } from "@entities";
import {
    Title,
    Text,
    Button,
    FlexBox,
    Toolbar,
    ToolbarSpacer,
    AnalyticalTable,
    AnalyticalTableColumnDefinition
} from "@ui5/webcomponents-react";
import { spacing, useI18nBundle } from "@ui5/webcomponents-react-base";
import "@ui5/webcomponents-icons/dist/add.js";
import "@ui5/webcomponents-icons/dist/feeder-arrow.js";
import "@ui5/webcomponents-icons/dist/arrow-left";
import { Dispatch, SetStateAction, useCallback, useContext, useMemo } from "react";

import { formatDate } from "@/formatters";
import { ViewState } from "@pages/invoice-details/InvoiceDetails";
import Surface from "@/custom/Surface";
import DeleteButton from "@/custom/DeleteButton";
import { UserContext } from "@/contexts/UserContext";
import { BASE_URL_CAP } from "@/constants";

export default function PostionsCard({
    positions,
    setPositions,
    handleChangeCorrectionClick,
    sumPositionCorrections,
    setViewState,
    isCVState,
    setDialogState,
    navigateToPositionInPDF,
    isInvoiceImmutable
}: {
    positions: Positions;
    setPositions: Dispatch<SetStateAction<Positions>>;
    handleChangeCorrectionClick: (positionID: string) => void;
    sumPositionCorrections: number;
    setViewState: Dispatch<SetStateAction<ViewState>>;
    isCVState: boolean;
    setDialogState: Dispatch<
        SetStateAction<{
            showDialog: boolean;
            dialogText: string;
            onConfirm: () => void;
        }>
    >;
    navigateToPositionInPDF: ((props: any) => void) | null;
    isInvoiceImmutable: boolean;
}) {
    const i18n = useI18nBundle("app");
    const { isAdmin } = useContext(UserContext);
    const isUserAdmin = isAdmin();

    const positionCorrections = positions?.map((position: Position) => {
        const correctionsArray = position.corrections as PositionCorrections;
        correctionsArray?.sort(
            (a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime()
        );
        const latestCorrection = correctionsArray[0];
        const totalForPosition =
            Math.round(
                (latestCorrection.revisedUnitQuantity as number) * (latestCorrection.revisedUnitPrice as number) * 100
            ) / 100;
        return {
            index: position.index as number,
            position: position.descriptor,
            quantity: latestCorrection.revisedUnitQuantity,
            unitPrice: latestCorrection.revisedUnitPrice,
            totalAmount: totalForPosition,
            changedBy: latestCorrection.createdBy,
            changedOn: formatDate(latestCorrection.createdAt as string),
            reason: latestCorrection.reason,
            buttons: position.ID!
        };
    });

    const deletePositionCorrection = useCallback(
        async (positionID: string, event: React.MouseEvent<HTMLElement> | undefined) => {
            const button = event?.target as HTMLButtonElement;
            button.disabled = true;
            try {
                const response = await fetch(`${BASE_URL_CAP}/Positions/${positionID}`, {
                    method: "DELETE"
                });
                if (response.ok)
                    setPositions((positions) => positions.filter((position) => position.ID !== positionID));
            } catch (err) {
                console.log(err);
            } finally {
                button.disabled = false;
            }
        },
        [setPositions]
    );

    const getCellColor = (props: any, accessor: string) => {
        const descriptor = props.cell.row.original.position;
        const position = positions.find((p: Position) => p.descriptor === descriptor);
        const latestAmount = props.cell.row.original.totalAmount;

        const correctionsArray = position?.corrections as PositionCorrections;
        const firstCorrection = correctionsArray.at(-1);

        const firstAmount =
            (firstCorrection?.revisedUnitQuantity as number) * (firstCorrection?.revisedUnitPrice as number);
        const cellColor = latestAmount - firstAmount > 0 ? { color: "red" } : {};

        return <div style={cellColor}>{props.cell.row.values[accessor]}</div>;
    };

    const positionCorrectionsColumns: Array<AnalyticalTableColumnDefinition> = useMemo(() => {
        const columns: Array<AnalyticalTableColumnDefinition> = [
            {
                Header: `Index`,
                accessor: "index",
                width: 85,
                defaultCanSort: true,
                Cell: (props: any) => {
                    return (
                        <>
                            <div onClick={() => navigateToPositionInPDF!(props)} style={{ cursor: "pointer" }}>
                                {getCellColor(props, "index")}
                            </div>
                            <Button
                                icon="arrow-left"
                                design="Default"
                                style={spacing.sapUiTinyMarginBegin}
                                onClick={() => navigateToPositionInPDF!(props)}
                            ></Button>
                        </>
                    );
                }
            },
            {
                Header: `${i18n.getText({ key: "position", defaultText: "" })}`,
                accessor: "position",
                Cell: (props: any) => {
                    return <div>{getCellColor(props, "position")}</div>;
                }
            },
            {
                Header: `${i18n.getText({ key: "quantity", defaultText: "" })}`,
                accessor: "quantity",
                Cell: (props: any) => getCellColor(props, "quantity")
            },
            {
                Header: () => (
                    <div>
                        {i18n.getText({ key: "unitPrice", defaultText: "" })}
                        <br />
                        in EUR
                    </div>
                ),
                accessor: "unitPrice",
                Cell: (props: any) => getCellColor(props, "unitPrice")
            },
            {
                Header: () => (
                    <div>
                        {i18n.getText({ key: "totalAmount", defaultText: "" })}
                        <br />
                        in EUR
                    </div>
                ),
                accessor: `totalAmount`
            },
            {
                Header: `${i18n.getText({ key: "reason", defaultText: "" })}`,
                accessor: `reason`
            },
            {
                Header: `${i18n.getText({ key: "changedOn", defaultText: "" })}`,
                accessor: `changedOn`
            },
            {
                Header: `${i18n.getText({ key: "changedBy", defaultText: "" })}`,
                accessor: `changedBy`
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
                    const positionID = props.cell.value;
                    return (
                        <FlexBox direction="Row">
                            <DeleteButton
                                onClickFunction={(event) => {
                                    if (positionID) {
                                        setDialogState({
                                            showDialog: true,
                                            dialogText: i18n.getText({
                                                key: "deletePositionCorrectionDialog",
                                                defaultText: ""
                                            }),
                                            onConfirm: () => {
                                                void deletePositionCorrection(positionID, event);
                                                setDialogState((previousState) => ({
                                                    ...previousState,
                                                    showDialog: false
                                                }));
                                            }
                                        });
                                    }
                                }}
                                style={spacing.sapUiTinyMarginBegin}
                            />
                            <Button
                                icon="feeder-arrow"
                                design="Transparent"
                                style={spacing.sapUiTinyMarginBegin}
                                onClick={() => handleChangeCorrectionClick(positionID)}
                            />
                        </FlexBox>
                    );
                }
            });
        }
        return columns;
    }, [i18n, isCVState, isUserAdmin, setDialogState, deletePositionCorrection, handleChangeCorrectionClick]);

    return (
        <Surface>
            <AnalyticalTable
                header={
                    <Toolbar design="Transparent" toolbarStyle="Standard">
                        <Title level="H5" style={spacing.sapUiTinyMarginBegin}>
                            {i18n.getText({ key: "positionCorrections", defaultText: "" })}
                        </Title>
                        {!isInvoiceImmutable && (isCVState || isUserAdmin) && (
                            <>
                                <ToolbarSpacer />
                                <Button
                                    icon="add"
                                    design="Transparent"
                                    onClick={() => setViewState(ViewState.ADD_NEW_POSITION)}
                                >
                                    {i18n.getText({ key: "new", defaultText: "" })}
                                </Button>
                            </>
                        )}
                    </Toolbar>
                }
                reactTableOptions={{
                    initialState: {
                        sortBy: [
                            {
                                id: "index",
                                desc: false
                            }
                        ]
                    }
                }}
                data={positionCorrections}
                columns={positionCorrectionsColumns}
                noDataText={i18n.getText({ key: "noPositionCorrections", defaultText: "" })}
                minRows={2}
                filterable
            />
            {sumPositionCorrections !== 0 && (
                <FlexBox direction="Row" style={spacing.sapUiSmallMarginTop}>
                    <>
                        <Text>
                            {i18n.getText({ key: "positionsAdjusted", defaultText: "" })}{" "}
                            {sumPositionCorrections < 0
                                ? i18n.getText({ key: "downwards", defaultText: "" })
                                : i18n.getText({ key: "upwards", defaultText: "" })}{" "}
                            {i18n.getText({ key: "inTotalBy", defaultText: "" })}
                        </Text>
                        <Text style={{ fontWeight: "bold", ...spacing.sapUiTinyMarginBegin }}>
                            {Math.abs(sumPositionCorrections).toFixed(2)}
                        </Text>
                    </>
                </FlexBox>
            )}
        </Surface>
    );
}

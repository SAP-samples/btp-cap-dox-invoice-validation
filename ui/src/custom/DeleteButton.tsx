import { Button } from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/delete.js";
import { CSSProperties } from "react";

export default function DeleteButton({
    style = {},
    onClickFunction
}: {
    style?: CSSProperties;
    onClickFunction: (event?: React.MouseEvent<HTMLElement>) => void;
}) {
    return <Button icon="delete" design="Negative" onClick={onClickFunction} style={style} />;
}

import { ReactNode, CSSProperties } from "react";
import { FlexBox } from "@ui5/webcomponents-react";
import { ThemingParameters } from "@ui5/webcomponents-react-base";

export default function Surface({ style = {}, children }: { style?: CSSProperties; children: ReactNode }) {
    return (
        <FlexBox
            direction="Column"
            style={{
                paddingLeft: 12,
                paddingRight: 12,
                paddingTop: 8,
                paddingBottom: 28,
                borderRadius: 15,
                backgroundColor: ThemingParameters.sapTile_Background,
                // should be identical to the shadow that Card has
                boxSizing: "border-box",
                boxShadow: ThemingParameters.sapContent_Shadow0,
                ...style
            }}
        >
            {children}
        </FlexBox>
    );
}

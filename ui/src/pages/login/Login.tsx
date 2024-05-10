import { Text, FlexBox, Input, Button, Link, Dialog } from "@ui5/webcomponents-react";
import { spacing } from "@ui5/webcomponents-react-base";

import Logo from "../../assets/sap-logo.svg";

export default function Login() {
    return (
        <Dialog
            open={true}
            style={{
                height: "31rem",
                width: "30.8rem"
            }}
        >
            <FlexBox direction="Column" style={{ alignItems: "center" }}>
                <img
                    src={Logo}
                    style={{
                        width: "5.6rem",
                        height: "2.8rem",
                        ...spacing.sapUiLargeMarginTop
                    }}
                />
                <FlexBox direction="Column" style={spacing.sapUiLargeMarginTop}>
                    <Text style={{ textAlign: "left" }}>User Name:</Text>
                    <Input placeholder="Enter your ID or email address" style={{ width: "16rem" }} />
                </FlexBox>
                <FlexBox direction="Column" style={spacing.sapUiSmallMarginTop}>
                    <Text style={{ textAlign: "left" }}>Password:</Text>
                    <Input type="Password" style={{ width: "16rem" }} />
                </FlexBox>
                <FlexBox direction="Row" style={{ ...spacing.sapUiSmallMarginTop, width: "16rem" }}>
                    <Button />
                    <FlexBox style={{ alignItems: "center", ...spacing.sapUiSmallMarginBegin }}>
                        <Text>Keep me signed in</Text>
                    </FlexBox>
                </FlexBox>
                <Link style={{ ...spacing.sapUiSmallMarginTop, width: "16rem" }}>Forgot Password?</Link>
                <Button style={{ width: "16rem", ...spacing.sapUiMediumMarginTop }} design="Emphasized">
                    Sign In
                </Button>
            </FlexBox>
        </Dialog>
    );
}

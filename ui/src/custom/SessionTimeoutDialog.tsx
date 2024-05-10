import { Bar, Button, Dialog, Text } from "@ui5/webcomponents-react";
import { useEffect, useRef, useState } from "react";
import { useI18nBundle } from "@ui5/webcomponents-react-base";

const sessionTime: number = 1000 * 60 * 14;

interface Timeouts {
    inactivityTimeout: null | NodeJS.Timeout;
    minuteCountDownInterval: null | NodeJS.Timeout;
}

export default function SessionTimeoutDialog() {
    const [isSessionTimeoutDialogOpen, setIsSessionTimeoutDialogOpen] = useState(false);
    const [remainingSecondsToSessionTimeout, setRemainingSecondsToSessionTimeout] = useState(60);
    const [dialogClosedWithoutRefreshing, setDialogClosedWithoutRefreshing] = useState(false);

    const timeouts = useRef<Timeouts>({
        inactivityTimeout: null,
        minuteCountDownInterval: null
    });

    const i18n = useI18nBundle("app");

    useEffect(() => {
        // code that runs on component mount
        // overriding the global fetch function to reset the timeout timer on every request
        window.fetch = new Proxy(window.fetch, {
            apply: function (target, thisArg, argArray) {
                if (resetAllTimers) resetAllTimers();
                // @ts-ignore
                return target.apply(thisArg, argArray);
            }
        });

        return () => {
            // code that runs on component unmount
            clearAllTimers();
        };
    }, []);

    function resetAllTimers() {
        clearAllTimers();
        startTimeoutCountdown();
    }

    function clearAllTimers() {
        if (timeouts.current.inactivityTimeout) clearTimeout(timeouts.current.inactivityTimeout);
        if (timeouts.current.minuteCountDownInterval) clearInterval(timeouts.current.minuteCountDownInterval);
    }

    function startTimeoutCountdown() {
        closeDialog();
        timeouts.current.inactivityTimeout = setTimeout(() => {
            openDialog();
            handleCountdownInDialog();
        }, sessionTime);
    }

    function openDialog() {
        setIsSessionTimeoutDialogOpen(true);
    }

    function closeDialog() {
        setIsSessionTimeoutDialogOpen(false);
    }

    function handleCountdownInDialog() {
        timeouts.current.minuteCountDownInterval = setInterval(() => {
            setRemainingSecondsToSessionTimeout((oldValue) => {
                if (oldValue <= 0) {
                    clearInterval(timeouts.current.minuteCountDownInterval!);
                }
                return oldValue - 1;
            });
        }, 1000);
    }

    return (
        <>
            {!dialogClosedWithoutRefreshing && (
                <Dialog
                    className="footerPartNoPadding"
                    footer={
                        <Bar
                            design="Footer"
                            endContent={
                                <>
                                    <Button onClick={() => location.reload()}>
                                        {i18n.getText({ key: "refreshNow", defaultText: "" })}
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setIsSessionTimeoutDialogOpen(false);
                                            setDialogClosedWithoutRefreshing(true);
                                        }}
                                    >
                                        {i18n.getText({ key: "close", defaultText: "" })}
                                    </Button>
                                </>
                            }
                        />
                    }
                    headerText="Session Timeout"
                    open={isSessionTimeoutDialogOpen}
                >
                    {remainingSecondsToSessionTimeout > 0 && (
                        <Text>
                            {i18n.getText(
                                { key: "sessionAboutToTimeOut", defaultText: "" },
                                remainingSecondsToSessionTimeout
                            )}
                            <br />
                            {i18n.getText(
                                { key: "sessionDialogButtonExplaination", defaultText: "" },
                                remainingSecondsToSessionTimeout
                            )}
                        </Text>
                    )}
                    {remainingSecondsToSessionTimeout <= 0 && (
                        <Text>
                            {i18n.getText({ key: "sessionTimedOut", defaultText: "" })}
                            <br />
                            {i18n.getText(
                                { key: "sessionDialogButtonExplaination", defaultText: "" },
                                remainingSecondsToSessionTimeout
                            )}
                        </Text>
                    )}
                </Dialog>
            )}
            {dialogClosedWithoutRefreshing && (
                <div style={{ width: "100%", height: "20px", backgroundColor: "orange", padding: "10px" }}>
                    {remainingSecondsToSessionTimeout > 0 && (
                        <Text>
                            {i18n.getText(
                                { key: "sessionAboutToTimeOut", defaultText: "" },
                                remainingSecondsToSessionTimeout
                            )}
                        </Text>
                    )}
                    {remainingSecondsToSessionTimeout <= 0 && (
                        <Text>{i18n.getText({ key: "sessionTimedOut", defaultText: "" })}</Text>
                    )}
                </div>
            )}
        </>
    );
}

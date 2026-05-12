import React, { useEffect, useState } from "react";

const DeviceBlocker = ({ children }) => {
    const [blocked, setBlocked] = useState(false);

    useEffect(() => {
        const checkDevice = () => {
            const width = window.innerWidth;

            // block tablets + mobiles
            if (width <= 1024) {
                setBlocked(true);
            } else {
                setBlocked(false);
            }
        };

        checkDevice();

        window.addEventListener("resize", checkDevice);

        return () => window.removeEventListener("resize", checkDevice);
    }, []);

    if (blocked) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <h1 style={styles.title}>SAN Beverages Dashboard</h1>

                    <p style={styles.text}>
                        Desktop/Laptop Access Only
                    </p>

                    <p style={styles.subText}>
                        This dashboard is optimized for larger screens.
                        Please open it on a desktop device.
                    </p>
                </div>
            </div>
        );
    }

    return children;
};

const styles = {
    container: {
        width: "100vw",
        height: "100vh",
        background: "#0f172a",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
    },

    card: {
        background: "#1e293b",
        padding: "40px",
        borderRadius: "20px",
        textAlign: "center",
        maxWidth: "500px",
        boxShadow: "0 0 30px rgba(0,0,0,0.4)",
    },

    title: {
        color: "#22c55e",
        marginBottom: "20px",
        fontSize: "32px",
    },

    text: {
        color: "white",
        fontSize: "18px",
        marginBottom: "10px",
    },

    subText: {
        color: "#94a3b8",
        fontSize: "15px",
    },
};

export default DeviceBlocker;
declare global {
    interface Window {
        paypal: {
            HostedButtons: (options: { hostedButtonId: string }) => {
                render: (element: string) => void;
            };
        };
    }
}

export { };

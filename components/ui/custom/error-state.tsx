interface ErrorStateProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    retryLabel?: string;
}

export function ErrorState({ 
    title = "Error",
    message, 
    onRetry,
    retryLabel = "Try Again"
}: ErrorStateProps) {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <h2 className="text-red-800 font-semibold mb-2">{title}</h2>
                <p className="text-red-600">{message}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        {retryLabel}
                    </button>
                )}
            </div>
        </div>
    );
}

interface LoadingStateProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({ 
    message = "Loading...", 
    size = 'md' 
}: LoadingStateProps) {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-8 w-8', 
        lg: 'h-12 w-12'
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-64">
                <div className="text-center">
                    <div className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-blue-600 mx-auto mb-4`}></div>
                    <p className="text-gray-600">{message}</p>
                </div>
            </div>
        </div>
    );
}

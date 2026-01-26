export default function BigInput({ label, id, error, ...props }) {
    return (
        <div className="mb-8">
            {label && (
                <label htmlFor={id} className="granny-label">
                    {label}
                </label>
            )}
            <input
                id={id}
                className={`ios-input ${error ? 'border-danger/50 focus:border-danger bg-red-50/10' : ''}`}
                {...props}
            />
            {error && (
                <p className="mt-4 text-danger font-black ml-2 flex items-center gap-2 animate-bounce">
                    ⚠️ {error}
                </p>
            )}
        </div>
    );
}

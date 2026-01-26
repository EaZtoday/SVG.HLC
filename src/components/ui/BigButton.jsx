export default function BigButton({ children, onClick, variant = 'primary', className = '', ...props }) {
    const baseStyles = "w-full rounded-3xl p-6 font-bold text-xl shadow-xl transition-all duration-150 active:scale-95 flex items-center justify-center gap-3 transform-gpu";

    const variants = {
        primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-primary-500/25",
        secondary: "bg-white text-slate-800 border-white hover:bg-slate-50 shadow-slate-200/50",
        danger: "bg-white text-danger border border-danger/10 hover:bg-red-50 shadow-danger/5",
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

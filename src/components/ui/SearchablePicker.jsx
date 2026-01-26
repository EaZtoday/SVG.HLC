import React, { useState, useMemo } from 'react';
import { Search, X, Check, Plus } from 'lucide-react';

export default function SearchablePicker({
    label,
    value,
    options,
    onChange,
    placeholder = "Select...",
    multiple = false,
    allowCustom = false
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    const filteredOptions = useMemo(() => {
        let opts = options;
        if (search) {
            opts = options.filter(opt => opt.toLowerCase().includes(search.toLowerCase()));
        }
        return opts;
    }, [options, search]);

    const handleSelect = (option) => {
        if (multiple) {
            const current = Array.isArray(value) ? value : [];
            if (current.includes(option)) {
                onChange(current.filter(item => item !== option));
            } else {
                onChange([...current, option]);
            }
        } else {
            onChange(option);
            setIsOpen(false);
            setSearch('');
        }
    };

    const handleCustomAdd = () => {
        if (!allowCustom || !search) return;

        // Prevent adding if case-insensitive match exists
        const existingInfo = options.find(opt => opt.toLowerCase() === search.toLowerCase());
        if (existingInfo) {
            handleSelect(existingInfo);
            return;
        }

        if (multiple) {
            const current = Array.isArray(value) ? value : [];
            onChange([...current, search]);
        } else {
            onChange(search);
            setIsOpen(false);
        }
        setSearch('');
    };

    const displayValue = useMemo(() => {
        if (multiple) {
            if (!Array.isArray(value) || value.length === 0) return placeholder;
            return `${value.length} selected`;
        }
        return value || placeholder;
    }, [value, multiple, placeholder]);

    if (!isOpen) {
        return (
            <div className="mb-6">
                <label className="block text-lg font-semibold text-slate-700 mb-2 ml-1">{label}</label>
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="w-full text-left text-xl p-4 rounded-xl border border-slate-300/80 bg-white hover:border-primary-400 focus:ring-4 focus:ring-primary-100/50 transition-all flex justify-between items-center shadow-sm active:scale-[0.99] group"
                >
                    <span className={value && (Array.isArray(value) ? value.length > 0 : true) ? 'text-slate-900 font-medium' : 'text-slate-400'}>
                        {displayValue}
                    </span>
                    <span className="text-slate-400 group-hover:text-primary-500 transition-colors">▼</span>
                </button>
                {multiple && Array.isArray(value) && value.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {value.map(v => (
                            <span key={v} className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                                {v}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Check if we should show custom add button (case-insensitive check)
    const showCustomAdd = allowCustom && search && !options.some(opt => opt.toLowerCase() === search.toLowerCase());

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white/95 backdrop-blur-2xl w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200 border border-white/20 ring-1 ring-black/5">
                <div className="p-5 border-b border-slate-200/50 flex items-center gap-4 bg-white/50">
                    <Search className="text-slate-400 w-6 h-6" />
                    <input
                        autoFocus
                        type="text"
                        placeholder={allowCustom ? "Search or add custom..." : "Search..."}
                        className="flex-1 text-2xl border-none focus:ring-0 p-0 placeholder:text-slate-300 bg-transparent font-medium"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                    >
                        {multiple ? <span className="text-lg font-bold text-primary-600 px-2">Done</span> : <X size={28} />}
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-4 space-y-2">
                    {showCustomAdd && (
                        <button
                            type="button"
                            onClick={handleCustomAdd}
                            className="w-full text-left p-5 rounded-2xl text-xl font-medium transition-all bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center gap-3 active:scale-[0.98] shadow-sm ml-1 mr-1"
                        >
                            <Plus size={24} />
                            Add "{search}"
                        </button>
                    )}

                    {filteredOptions.length === 0 && !showCustomAdd ? (
                        <div className="text-center py-12 text-slate-400 text-xl font-medium">
                            No matches found
                        </div>
                    ) : (
                        filteredOptions.map(option => {
                            const isSelected = multiple
                                ? Array.isArray(value) && value.includes(option)
                                : value === option;

                            return (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => handleSelect(option)}
                                    className={`w-full text-left p-5 rounded-2xl text-xl font-medium transition-all flex items-center justify-between active:scale-[0.99] mb-1 ${isSelected
                                        ? 'bg-primary-50 text-primary-700 shadow-sm border border-primary-100'
                                        : 'hover:bg-slate-50 text-slate-700 hover:shadow-sm border border-transparent hover:border-slate-100'
                                        }`}
                                >
                                    {option}
                                    {isSelected && <Check size={24} className="text-primary-600" />}
                                </button>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

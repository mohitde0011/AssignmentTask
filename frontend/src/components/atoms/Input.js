import React from 'react'

export default function Input({ title,
    maxChar,
    inputRef,
    value,
    label,
    accept,
    type="text",
    handleChange,
    error,
    className = "",
    id,
    autoFocus,
    disabled,
    readOnly,
    ...props }) {
    return (
        <div className="mb-4 ">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                  {...props}
                id={id}
                className={` disabled:cursor-not-allowed  p-2 rounded-md  ${error ? 'outline-red-500 ' : ''} ${className} `}
                value={value}
                disabled={disabled}
                type={type}
                autoFocus={autoFocus || error}
                onChange={handleChange}
                readOnly={readOnly}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    )
}
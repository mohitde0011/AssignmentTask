import React from 'react'

export default function Button({
    children,
    onClick,
    type = 'button',
    disabled ,
    loading,
    ...props
}) {
    return (
        <button
            className={`px-24 disabled:bg-[#787878] disabled:cursor-not-allowed cursor-pointer rounded-[50px] bg-blue-600 text-white bg-[#253bff] py-2 ${disabled  || loading && "bg-[#253bffbe]"}`}
            onClick={onClick}
            type={type}
            disabled={disabled || loading}
            {...props}
        >
            {loading ?"Loading..."  :children} 
        </button>
    )
}
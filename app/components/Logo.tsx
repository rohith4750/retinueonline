import React from "react";
import Image from "next/image";

interface LogoProps {
    className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
    return (
        <div className={`relative flex-shrink-0 ${className}`} style={{ width: '100px', height: '100px' }}>
            <Image
                src="/logo-badge.png"
                alt="Hotel The Retinue"
                fill
                priority
                className="object-contain"
            />
        </div>
    );
}

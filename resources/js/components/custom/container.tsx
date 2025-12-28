import React from 'react';

export default function Container({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-background mx-auto px-2 sm:px-0 max-w-6xl text-foreground">
            {children}
        </div>
    );
}

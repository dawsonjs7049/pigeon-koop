import React, { useState } from 'react';
import Nav from './Nav';

export default function Layout({ children })
{
    const [darkMode, setDarkMode] = useState(false);

    return (
        <div className={darkMode ? "dark bg-slate-700" : "bg-white"}>
            <div className="mx-auto md:max-w-4xl px-2 md:px-4 min-h-screen">
                <Nav darkMode={darkMode} setDarkMode={setDarkMode}/>
                <main>
                    { children }
                </main>
            </div>
        </div>
    )
}
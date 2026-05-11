import { useEffect, useState } from 'react';

const TEXT = 'Stay Connected with Campus Life';

export const TypewriterHero = () => {
    const [displayText, setDisplayText] = useState('');
    const [index, setIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const speed = isDeleting ? 50 : 100;

        const timeout = setTimeout(() => {
            if (!isDeleting && index < TEXT.length) {
                setDisplayText(TEXT.slice(0, index + 1));
                setIndex(index + 1);
            }
            else if (!isDeleting && index === TEXT.length) {
                setTimeout(() => setIsDeleting(true), 2000); // pause sebelum hapus
            }
            else if (isDeleting && index > 0) {
                setDisplayText(TEXT.slice(0, index - 1));
                setIndex(index - 1);
            }
            else if (isDeleting && index === 0) {
                setIsDeleting(false);
            }
        }, speed);

        return () => clearTimeout(timeout);
    }, [index, isDeleting]);

    return (
        <h1 className="text-4xl md:text-5xl font-bold mb-4 flex justify-center">
            <span className="gradient-hero bg-clip-text text-transparent">
                {displayText}
            </span>

            {/* cursor */}
            <span className="ml-1 text-blue-400 text-3xl md:text-4xl animate-pulse select-none">
                |
            </span>
        </h1>
    );
};

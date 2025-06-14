import Link from 'next/link';

export const Footer = () => {
    const links = [
        {
            href: '',
            label: 'Feedback',
        },
        {
            href: '/terms',
            label: 'Terms',
        },
        {
            href: '/privacy',
            label: 'Privacy',
        },
    ];
    return (
        <div className="flex w-full flex-col items-center gap-4 p-3">
            {/* Inspirational Quote */}
            <div className="text-center">
                <blockquote className="text-muted-foreground text-sm italic leading-relaxed">
                    "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort."
                </blockquote>
                <cite className="text-muted-foreground/70 text-xs mt-1 block">
                    – Paul J. Meyer
                </cite>
            </div>
            
            {/* Footer Links */}
            <div className="flex flex-row items-center justify-center gap-4">
                {links.map(link => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="text-muted-foreground text-xs opacity-50 hover:opacity-100 transition-opacity duration-200"
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </div>
    );
};

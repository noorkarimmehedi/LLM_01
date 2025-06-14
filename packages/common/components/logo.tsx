import * as React from 'react';

export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        fill="currentColor" 
        viewBox="0 0 256 256" 
        role="img" 
        xmlns="http://www.w3.org/2000/svg" 
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        {...props}
    >
        <circle cx="128" cy="128" r="128" fill="#222" />
        <ellipse cx="102" cy="128" rx="18" ry="18" fill="white" className="blink" />
        <ellipse cx="154" cy="128" rx="18" ry="18" fill="white" className="blink" />
    </svg>
);

export const DarkLogo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        fill="currentColor" 
        viewBox="0 0 256 256" 
        role="img" 
        xmlns="http://www.w3.org/2000/svg" 
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        {...props}
    >
        <circle cx="128" cy="128" r="128" fill="currentColor" />
        <ellipse cx="102" cy="128" rx="18" ry="18" fill="white" className="blink" />
        <ellipse cx="154" cy="128" rx="18" ry="18" fill="white" className="blink" />
    </svg>
);

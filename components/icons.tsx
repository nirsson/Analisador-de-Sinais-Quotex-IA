
import React from 'react';

export const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

export const BrainCircuitIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5V3M12 11V9M5 12H3M9 12H7M15 12H13M19 12H17M12 17v-2M12 21v-2"/>
    <path d="M12 9a3 3 0 0 0-3 3H7a5 5 0 0 1 5-5Z"/><path d="M12 15a3 3 0 0 0 3-3h2a5 5 0 0 1-5 5Z"/>
    <path d="M9 12a3 3 0 0 0-3-3V7a5 5 0 0 1 5 5Z"/><path d="M15 12a3 3 0 0 0 3 3v2a5 5 0 0 1-5-5Z"/>
    <path d="M12 9a3 3 0 0 1 3 3h2a5 5 0 0 0-5-5Z"/><path d="M12 15a3 3 0 0 1-3-3H7a5 5 0 0 0 5 5Z"/>
    <path d="M9 12a3 3 0 0 1 3-3V7a5 5 0 0 0-5 5Z"/><path d="M15 12a3 3 0 0 1-3 3v2a5 5 0 0 0 5-5Z"/>
  </svg>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.13 5.13 12 2l2.87 3.13M2 12l3.13-2.87L8 12l-2.87 2.87L2 12Zm10 9.87L9.13 19.13 12 16l2.87 3.13L12 21.87Z"/>
        <path d="M16 8.87 19.13 6 22 8.87 19.13 11.73 16 8.87Z"/>
        <path d="m14 2-1.5 3 2 2-3 1.5-1-3.5L14 2Z"/>
        <path d="m18 12 3 1.5-1.5 2.5-3.5-1-1-3L18 12Z"/>
        <path d="m2 10 1.5-3 2-2 1.5 3-3.5 1-1 3.5L2 10Z"/>
        <path d="m10 22 1.5-3-2-2 3-1.5 1 3.5-1.5 2Z"/>
    </svg>
);

export const ChatIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

export const AnalyzerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

export const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

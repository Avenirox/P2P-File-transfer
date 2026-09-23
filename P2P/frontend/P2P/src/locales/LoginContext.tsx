import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import translations from '../locales/translationsIndex';

interface LanguageContextType {
    language: string;
    setLanguage: React.Dispatch<React.SetStateAction<string>>;
    t: (path: string, variables?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
    const [language, setLanguage] = useState<string>(() => {
        const LSlang = localStorage.getItem('lang');
        return LSlang ? LSlang : 'en';
    });

    useEffect(() => {
        localStorage.setItem('lang', language);
    }, [language]);

    const t = (path: string, variables: Record<string, string | number> = {}): string => {
        const keys = path.split('.');
        
        let value: any = (translations as Record<string, any>)[language] || (translations as Record<string, any>)['en'];
        
        for (const key of keys) {
            value = value?.[key];
        }
        
        if (!value || typeof value !== 'string') {
            return path;
        }
        
        Object.keys(variables).forEach((variable) => {
            value = value.replace(
                `{${variable}}`,
                String(variables[variable])
            );
        });
        
        return value;
    };

    return (
        <LanguageContext.Provider 
            value={{
                language,
                setLanguage,
                t
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage musi być używane wewnątrz LanguageProvider");
    }
    return context;
}

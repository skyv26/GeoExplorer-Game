export interface Currency {
    code: string;
    name: string;
    symbol: string;
}

export interface Language {
    iso639_1: string;
    iso639_2: string;
    name: string;
    nativeName: string;
}

export interface Translation {
    br: string;
    pt: string;
    nl: string;
    hr: string;
    fa: string;
    de: string;
    es: string;
    fr: string;
    ja: string;
    it: string;
    hu: string;
}

export interface RegionalBloc {
    acronym: string;
    name: string;
}

export interface CountryName {
    common: string;
    official: string;
}

export interface Country {
    name: CountryName;
    topLevelDomain: string[];
    alpha2Code: string;
    alpha3Code: string;
    callingCodes: string[];
    capital: string;
    altSpellings: string[];
    subregion: string;
    region: string;
    population: number;
    latlng: [number, number];
    demonym: string;
    area: number;
    timezones: string[];
    borders: string[];
    nativeName: string;
    numericCode: string;
    flags: {
        svg: string;
        png: string;
    };
    currencies: Currency[];
    languages: Language[];
    translations: Translation;
    flag: string;
    regionalBlocs: RegionalBloc[];
    cioc: string;
    independent: boolean;
}

export interface optionsForAnswer {
    id: string;
    text: string;
}

export interface Question {
    question: string;
    options: optionsForAnswer[];
    correctAnswer: string;
    hints: string[];
}

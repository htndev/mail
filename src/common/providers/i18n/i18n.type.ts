type RawI18n = { lang: string; i18n: Record<string, any> };
type I18nValue = string | { [k: string]: I18nValue };
type I18nType = { [k: string]: I18nValue };
type TranslateType = { text: string; isTranslated: boolean };
type TransformArray = (number | string)[];
type TransformObject = { [k: string]: string | number };
type TransformationType = TransformArray | TransformObject;

export { RawI18n, I18nType, I18nValue, TranslateType, TransformationType, TransformArray, TransformObject };

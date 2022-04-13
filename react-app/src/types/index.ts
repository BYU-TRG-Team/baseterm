export type NullableString = string | null;
export type UUID = string;
export type LangCode = string;
export type GenericObject<T = any> = {[key: string]: T}
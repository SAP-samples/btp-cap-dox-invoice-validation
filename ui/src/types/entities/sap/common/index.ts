// This is an automatically generated file. Please do not change its contents manually!
import * as __ from "./../../_";
export type Locale = string;
// the following represents the CDS aspect 'CodeList'
export function _CodeListAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class CodeList extends Base {
        name?: string;
        descr?: string;
    };
}
export class CodeList extends _CodeListAspect(__.Entity) {}
// the following represents the CDS aspect 'TextsAspect'
export function _TextsAspectAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class TextsAspect extends Base {
        /**
         * Type for a language code
         */
        locale?: Locale;
    };
}
export class TextsAspect extends _TextsAspectAspect(__.Entity) {}
/**
 * Code list for languages
 *
 * See https://cap.cloud.sap/docs/cds/common#entity-languages
 */
export function _LanguageAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class Language extends Base {
        /**
         * Type for a language code
         */
        code?: Locale;
    };
}
export class Language extends _CodeListAspect(_LanguageAspect(__.Entity)) {}
export class Languages extends Array<Language> {}

/**
 * Code list for countries
 *
 * See https://cap.cloud.sap/docs/cds/common#entity-countries
 */
export function _CountryAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class Country extends Base {
        code?: string;
    };
}
export class Country extends _CodeListAspect(_CountryAspect(__.Entity)) {}
export class Countries extends Array<Country> {}

/**
 * Code list for currencies
 *
 * See https://cap.cloud.sap/docs/cds/common#entity-currencies
 */
export function _CurrencyAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class Currency extends Base {
        code?: string;
        symbol?: string;
        minorUnit?: number;
    };
}
export class Currency extends _CodeListAspect(_CurrencyAspect(__.Entity)) {}
export class Currencies extends Array<Currency> {}

/**
 * Code list for time zones
 *
 * See https://cap.cloud.sap/docs/cds/common#entity-timezones
 */
export function _TimezoneAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class Timezone extends Base {
        code?: string;
    };
}
export class Timezone extends _CodeListAspect(_TimezoneAspect(__.Entity)) {}
export class Timezones extends Array<Timezone> {}

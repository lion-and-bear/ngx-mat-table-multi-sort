import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import {
  COLUMN_CONFIG_PERSISTENCE_ENABLED,
  SORT_PERSISTENCE_ENABLED,
} from "../../../../src/public-api";

/**
 * Configuration object for the application.
 *
 * @constant
 * @type {ApplicationConfig}
 *
 * @property {Array} providers - An array of providers used in the application.
 * @property {Function} providers[].provideZoneChangeDetection - Configures zone change detection with event coalescing enabled.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: SORT_PERSISTENCE_ENABLED, useValue: false },
    { provide: COLUMN_CONFIG_PERSISTENCE_ENABLED, useValue: false },
  ],
};

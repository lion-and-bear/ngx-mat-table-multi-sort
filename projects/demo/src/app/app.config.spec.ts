import {
  COLUMN_CONFIG_PERSISTENCE_ENABLED,
  SORT_PERSISTENCE_ENABLED,
} from "../../../../src/public-api";
import { appConfig } from "./app.config";

describe("appConfig", () => {
  it("should disable sort and column persistence by default", () => {
    expect(appConfig.providers).toEqual(
      expect.arrayContaining([
        { provide: SORT_PERSISTENCE_ENABLED, useValue: false },
        { provide: COLUMN_CONFIG_PERSISTENCE_ENABLED, useValue: false },
      ])
    );
  });
});

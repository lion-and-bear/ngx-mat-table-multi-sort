import { createMockStorage, generateColumns } from "./test";

describe("test utilities", () => {
  describe("generateColumns", () => {
    it("should return the default column configuration", () => {
      expect(generateColumns()).toEqual([
        { id: "id", label: "ID", visible: false },
        { id: "name", label: "Name", visible: true },
        { id: "value", label: "Value", visible: true },
      ]);
    });
  });

  describe("createMockStorage", () => {
    it("should read and write values", () => {
      const storage = createMockStorage({ foo: "bar" });

      expect(storage.getItem("foo")).toBe("bar");
      expect(storage.getItem("missing")).toBeNull();

      storage.setItem("baz", "qux");
      expect(storage.getItem("baz")).toBe("qux");
      expect(storage.setItem).toHaveBeenCalledWith("baz", "qux");
    });

    it("should expose Storage-like length, key, removeItem, and clear", () => {
      const storage = createMockStorage({ a: "1", b: "2" });

      expect(storage.length).toBe(2);
      expect(storage.key(0)).toBe("a");
      expect(storage.key(1)).toBe("b");
      expect(storage.key(99)).toBeNull();

      storage.removeItem("a");
      expect(storage.getItem("a")).toBeNull();
      expect(storage.length).toBe(1);
      expect(storage.removeItem).toHaveBeenCalledWith("a");

      storage.clear();
      expect(storage.length).toBe(0);
      expect(storage.clear).toHaveBeenCalled();
    });
  });
});

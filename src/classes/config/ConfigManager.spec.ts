import { describe, test, beforeEach, expect } from "vitest";
import ConfigManager from "./ConfigManager";

describe("ConfigManager", () => {
  let configManager: ConfigManager;

  beforeEach(() => {
    // console.log("before each");
    configManager = new ConfigManager("testing_mode");
    configManager.reset();
  });

  test("should save an load simple primatives", () => {
    configManager.saveObject("booltest", false);
    configManager.saveObject("stringtest", "test string");
    configManager.saveObject("inttest", 1);
    configManager.saveObject("floattest", 10.5);

    expect(configManager.getConfig("booltest")).toEqual(false);
    expect(configManager.getConfig("stringtest")).toEqual("test string");
    expect(configManager.getConfig("inttest")).toEqual(1);
    expect(configManager.getConfig("floattest")).toEqual(10.5);
  });

  test("should also delete simple primatives", () => {
    configManager.saveObject("booltest", false);
    expect(configManager.getConfig("booltest")).toEqual(false);
    configManager.deleteObject("booltest");
    expect(configManager.getConfig("booltest")).toEqual(undefined);
  });

  test("should save and load objects", () => {
    let testObject = { test: "test", toJSON: () => '{"test":"tests"}' };
    configManager.saveObject("objecttest", testObject);
    let obj = configManager.getConfig("objecttest");
    expect(obj.test).toEqual("tests");
  });

  test("should save primitives to complex keys", () => {
    configManager.saveObject("primive.int", 1);

    expect(configManager.getConfig("primive.int")).toEqual(1);
    expect(configManager.getConfig("primive")).toEqual({ int: 1 });
  });

  test("should save stuff to array based keys", () => {
    configManager.saveObject("array.0", "abcde");
    configManager.saveObject("array.1", 2);
    configManager.saveObject("array.2", 3);

    expect(configManager.getConfig("array")).toEqual({
      0: "abcde",
      1: 2,
      2: 3,
    });
  });

  test("should save primitives to complex keys", () => {
    configManager.saveObject("primive.int", 1);
    expect(configManager.getConfig("primive.int")).toEqual(1);
    configManager.deleteObject("primive.int");
    expect(configManager.getConfig("primive.int")).toEqual(undefined);
    // TODO: maybe delete the primive object if it's empty?
  });
});

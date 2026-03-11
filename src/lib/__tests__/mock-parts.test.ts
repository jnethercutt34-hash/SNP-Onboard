import {
  PARTS_CATALOG,
  TRADE_STUDIES,
  getPartById,
  getPartsByModule,
  getPartsByCategory,
  getPartsByFootprint,
  getPartsByTermination,
  getTradeStudyById,
  getTradeStudiesForPart,
  getPartsForTradeStudy,
  getBOMSummary,
} from "@/lib/mock-parts";

describe("mock-parts", () => {
  describe("PARTS_CATALOG", () => {
    it("should have 14 parts", () => {
      expect(PARTS_CATALOG).toHaveLength(14);
    });

    it("every part should have required fields", () => {
      for (const part of PARTS_CATALOG) {
        expect(part.id).toBeTruthy();
        expect(part.manufacturerPartNumber).toBeTruthy();
        expect(part.manufacturer).toBeTruthy();
        expect(part.category).toBeTruthy();
        expect(part.footprint).toBeTruthy();
        expect(part.quantity).toBeGreaterThan(0);
        expect(part.usedOnModules.length).toBeGreaterThan(0);
      }
    });

    it("all IDs should be unique", () => {
      const ids = PARTS_CATALOG.map((p) => p.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe("TRADE_STUDIES", () => {
    it("should have 3 trade studies", () => {
      expect(TRADE_STUDIES).toHaveLength(3);
    });

    it("each study should reference existing parts", () => {
      const partIds = new Set(PARTS_CATALOG.map((p) => p.id));
      for (const ts of TRADE_STUDIES) {
        for (const pid of ts.affectedParts) {
          expect(partIds.has(pid)).toBe(true);
        }
      }
    });
  });

  describe("getPartById", () => {
    it("returns correct part", () => {
      const part = getPartById("res-0402-10k");
      expect(part).toBeDefined();
      expect(part!.manufacturer).toBe("Yageo");
    });

    it("returns undefined for unknown ID", () => {
      expect(getPartById("nonexistent")).toBeUndefined();
    });
  });

  describe("getPartsByModule", () => {
    it("returns parts used on GPP", () => {
      const parts = getPartsByModule("gpp-universal");
      expect(parts.length).toBeGreaterThan(0);
      for (const p of parts) {
        expect(p.usedOnModules).toContain("gpp-universal");
      }
    });

    it("returns empty array for unknown module", () => {
      expect(getPartsByModule("nonexistent")).toHaveLength(0);
    });
  });

  describe("getPartsByCategory", () => {
    it("returns resistors", () => {
      const resistors = getPartsByCategory("Resistor");
      expect(resistors.length).toBe(4);
      for (const r of resistors) {
        expect(r.category).toBe("Resistor");
      }
    });
  });

  describe("getPartsByFootprint", () => {
    it("returns 0402 parts", () => {
      const parts = getPartsByFootprint("0402");
      expect(parts.length).toBeGreaterThan(0);
      for (const p of parts) {
        expect(p.footprint).toBe("0402");
      }
    });
  });

  describe("getPartsByTermination", () => {
    it("returns pure tin parts", () => {
      const parts = getPartsByTermination("Pure-Tin");
      expect(parts.length).toBeGreaterThan(0);
      for (const p of parts) {
        expect(p.solderTermination).toBe("Pure-Tin");
      }
    });
  });

  describe("getTradeStudyById", () => {
    it("returns correct study", () => {
      const ts = getTradeStudyById("ts-001");
      expect(ts).toBeDefined();
      expect(ts!.category).toBe("Materials");
    });
  });

  describe("getTradeStudiesForPart", () => {
    it("returns studies for a pure tin resistor", () => {
      const studies = getTradeStudiesForPart("res-0402-10k");
      expect(studies.length).toBeGreaterThan(0);
    });

    it("returns empty for unknown part", () => {
      expect(getTradeStudiesForPart("nonexistent")).toHaveLength(0);
    });
  });

  describe("getPartsForTradeStudy", () => {
    it("returns parts affected by TS-001", () => {
      const parts = getPartsForTradeStudy("ts-001");
      expect(parts.length).toBeGreaterThan(0);
    });
  });

  describe("getBOMSummary", () => {
    it("returns correct totals", () => {
      const summary = getBOMSummary();
      expect(summary.totalUniquePartNumbers).toBe(14);
      expect(summary.totalQuantity).toBeGreaterThan(0);
      expect(summary.pureTimParts).toBeGreaterThan(0);
      expect(summary.pureTimPercentage).toBeGreaterThan(0);
      expect(summary.pureTimPercentage).toBeLessThanOrEqual(100);
    });

    it("category counts add up to total", () => {
      const summary = getBOMSummary();
      const catTotal = Object.values(summary.byCategory).reduce((s, c) => s + c.count, 0);
      expect(catTotal).toBe(summary.totalUniquePartNumbers);
    });

    it("termination counts add up to total", () => {
      const summary = getBOMSummary();
      const termTotal = Object.values(summary.byTermination).reduce((s, c) => s + c.count, 0);
      expect(termTotal).toBe(summary.totalUniquePartNumbers);
    });
  });
});

import {
  BUILDS,
  getBuildById,
  flattenComponents,
  getBuildDifferences,
} from "@/lib/mock-hardware";

describe("mock-hardware", () => {
  describe("BUILDS", () => {
    it("should have 5 builds", () => {
      expect(BUILDS).toHaveLength(5);
    });

    it("should include baseline, ABE, J2, JL, FMS", () => {
      const ids = BUILDS.map((b) => b.id);
      expect(ids).toContain("baseline");
      expect(ids).toContain("customer-a-pleo");
      expect(ids).toContain("customer-b-pleo");
      expect(ids).toContain("customer-c-pleo");
      expect(ids).toContain("fms-irad");
    });

    it("all slot numbers should be 1-indexed (1–7)", () => {
      for (const build of BUILDS) {
        for (const slot of build.slots) {
          expect(slot.slotNumber).toBeGreaterThanOrEqual(1);
          expect(slot.slotNumber).toBeLessThanOrEqual(7);
        }
      }
    });

    it("baseline should have 96W total power", () => {
      const baseline = BUILDS.find((b) => b.id === "baseline")!;
      expect(baseline.totalSystemPower).toBe(96);
    });

    it("J2 should have 103W total power", () => {
      const j2 = BUILDS.find((b) => b.id === "customer-b-pleo")!;
      expect(j2.totalSystemPower).toBe(103);
    });
  });

  describe("getBuildById", () => {
    it("returns the correct build", () => {
      const build = getBuildById("baseline");
      expect(build).toBeDefined();
      expect(build!.customerName).toBe("Baseline");
    });

    it("returns undefined for unknown ID", () => {
      expect(getBuildById("nonexistent")).toBeUndefined();
    });
  });

  describe("flattenComponents", () => {
    it("returns all base cards and mezzanines", () => {
      const baseline = getBuildById("baseline")!;
      const components = flattenComponents(baseline);
      // baseline: 5 base cards + 2 mezzanines = 7
      expect(components.length).toBeGreaterThanOrEqual(5);
    });

    it("includes mezzanine components", () => {
      const baseline = getBuildById("baseline")!;
      const components = flattenComponents(baseline);
      const mezzanines = components.filter(
        (c) => c.type === "Networking_Mezzanine" || c.type === "Mezzanine_XMC"
      );
      expect(mezzanines.length).toBeGreaterThan(0);
    });
  });

  describe("getBuildDifferences", () => {
    it("returns zero differences for baseline vs baseline", () => {
      const diff = getBuildDifferences("baseline", "baseline");
      expect(diff).toBeDefined();
      if (diff) {
        expect(diff.powerDelta).toBe(0);
        expect(diff.weightDelta).toBe(0);
      }
    });

    it("returns differences for baseline vs J2", () => {
      const diff = getBuildDifferences("baseline", "customer-b-pleo");
      expect(diff).toBeDefined();
      if (diff) {
        // J2 is 103W, baseline is 96W → delta = +7
        expect(diff.powerDelta).toBe(7);
      }
    });

    it("throws for invalid build IDs", () => {
      expect(() => getBuildDifferences("baseline", "nonexistent")).toThrow("Build not found");
    });
  });
});

import {
  MODULE_QUALIFICATIONS,
  MISSION_ENVIRONMENTS,
  getModuleQualification,
  getQualStatusCounts,
  getModuleQualSummary,
  getMissionEnvironmentById,
} from "@/lib/mock-qualification";

describe("mock-qualification", () => {
  describe("MODULE_QUALIFICATIONS", () => {
    it("should have 7 module qualifications", () => {
      expect(MODULE_QUALIFICATIONS).toHaveLength(7);
    });

    it("every module should have radiation and thermal profiles", () => {
      for (const mq of MODULE_QUALIFICATIONS) {
        expect(mq.radiation.tidRating).toBeTruthy();
        expect(mq.radiation.selThreshold).toBeTruthy();
        expect(mq.thermal.operatingRange).toBeTruthy();
        expect(mq.thermal.thermalDissipation).toBeTruthy();
        expect(mq.tests.length).toBeGreaterThan(0);
      }
    });
  });

  describe("MISSION_ENVIRONMENTS", () => {
    it("should have 2 environments", () => {
      expect(MISSION_ENVIRONMENTS).toHaveLength(2);
    });

    it("should all be pLEO", () => {
      for (const env of MISSION_ENVIRONMENTS) {
        expect(env.orbit.toLowerCase()).toContain("low earth");
      }
    });
  });

  describe("getModuleQualification", () => {
    it("returns GPP qualification", () => {
      const qual = getModuleQualification("gpp-universal");
      expect(qual).toBeDefined();
      expect(qual!.moduleName).toContain("GPP");
    });

    it("returns undefined for unknown module", () => {
      expect(getModuleQualification("nonexistent")).toBeUndefined();
    });
  });

  describe("getQualStatusCounts", () => {
    it("returns counts that sum to total tests", () => {
      const counts = getQualStatusCounts();
      const total = Object.values(counts).reduce((s, c) => s + c, 0);
      const expectedTotal = MODULE_QUALIFICATIONS.reduce((s, mq) => s + mq.tests.length, 0);
      expect(total).toBe(expectedTotal);
    });

    it("has more qualified than in-progress", () => {
      const counts = getQualStatusCounts();
      expect(counts.Qualified).toBeGreaterThan(counts["In Progress"]);
    });
  });

  describe("getModuleQualSummary", () => {
    it("returns correct summary for GPP", () => {
      const summary = getModuleQualSummary("gpp-universal");
      expect(summary.total).toBeGreaterThan(0);
      expect(summary.qualified).toBeGreaterThan(0);
      expect(summary.qualified).toBeLessThanOrEqual(summary.total);
    });

    it("returns zeros for unknown module", () => {
      const summary = getModuleQualSummary("nonexistent");
      expect(summary.total).toBe(0);
    });
  });

  describe("getMissionEnvironmentById", () => {
    it("returns pLEO 500km environment", () => {
      const env = getMissionEnvironmentById("pleo-500");
      expect(env).toBeDefined();
      expect(env!.altitude).toContain("500");
    });
  });
});

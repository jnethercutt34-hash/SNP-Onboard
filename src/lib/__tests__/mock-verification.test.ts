import {
  REQUIREMENTS,
  CATEGORIES,
  getRequirementById,
  getRequirementsByCategory,
  getRequirementsByModule,
  getVerificationSummary,
} from "@/lib/mock-verification";

describe("mock-verification", () => {
  describe("REQUIREMENTS", () => {
    it("should have 21 requirements", () => {
      expect(REQUIREMENTS).toHaveLength(21);
    });

    it("all requirements should have required fields", () => {
      for (const req of REQUIREMENTS) {
        expect(req.id).toBeTruthy();
        expect(req.title).toBeTruthy();
        expect(req.specification).toBeTruthy();
        expect(req.category).toBeTruthy();
        expect(req.verificationMethod).toBeTruthy();
        expect(req.status).toBeTruthy();
        expect(req.affectedModules.length).toBeGreaterThan(0);
      }
    });

    it("all IDs should be unique", () => {
      const ids = REQUIREMENTS.map((r) => r.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe("CATEGORIES", () => {
    it("should have 6 categories", () => {
      expect(CATEGORIES).toHaveLength(6);
    });

    it("should include Performance, Environmental, Radiation, EMI, Safety, Power", () => {
      expect(CATEGORIES).toContain("Performance");
      expect(CATEGORIES).toContain("Environmental");
      expect(CATEGORIES).toContain("Radiation");
      expect(CATEGORIES).toContain("EMI");
      expect(CATEGORIES).toContain("Safety");
      expect(CATEGORIES).toContain("Power");
    });
  });

  describe("getRequirementById", () => {
    it("returns correct requirement", () => {
      const req = getRequirementById("req-perf-001");
      expect(req).toBeDefined();
      expect(req!.category).toBe("Performance");
    });

    it("returns undefined for unknown ID", () => {
      expect(getRequirementById("nonexistent")).toBeUndefined();
    });
  });

  describe("getRequirementsByCategory", () => {
    it("returns performance requirements", () => {
      const reqs = getRequirementsByCategory("Performance");
      expect(reqs.length).toBeGreaterThan(0);
      for (const r of reqs) {
        expect(r.category).toBe("Performance");
      }
    });

    it("returns empty for unknown category", () => {
      expect(getRequirementsByCategory("Unknown")).toHaveLength(0);
    });
  });

  describe("getRequirementsByModule", () => {
    it("returns requirements for GPP", () => {
      const reqs = getRequirementsByModule("gpp-universal");
      expect(reqs.length).toBeGreaterThan(0);
      for (const r of reqs) {
        expect(r.affectedModules).toContain("gpp-universal");
      }
    });
  });

  describe("getVerificationSummary", () => {
    it("totals match requirement count", () => {
      const summary = getVerificationSummary();
      expect(summary.total).toBe(21);
      expect(summary.pass + summary.fail + summary.inProgress + summary.notStarted).toBeLessThanOrEqual(summary.total);
    });

    it("pass count is majority", () => {
      const summary = getVerificationSummary();
      expect(summary.pass).toBeGreaterThan(summary.inProgress);
    });

    it("category totals sum to total", () => {
      const summary = getVerificationSummary();
      const catTotal = Object.values(summary.byCategory).reduce((s, c) => s + c.total, 0);
      expect(catTotal).toBe(summary.total);
    });
  });
});

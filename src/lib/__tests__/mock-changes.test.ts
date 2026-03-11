import {
  CHANGE_RECORDS,
  getChangeById,
  getChangesByModule,
  getChangesByBuild,
  getChangesByStatus,
  getChangeStatusCounts,
  getModuleName,
  getBuildName,
} from "@/lib/mock-changes";

describe("mock-changes", () => {
  describe("CHANGE_RECORDS", () => {
    it("should have 8 records", () => {
      expect(CHANGE_RECORDS).toHaveLength(8);
    });

    it("all records should have required fields", () => {
      for (const change of CHANGE_RECORDS) {
        expect(change.id).toBeTruthy();
        expect(change.changeNumber).toBeTruthy();
        expect(change.type).toBeTruthy();
        expect(change.title).toBeTruthy();
        expect(change.status).toBeTruthy();
        expect(change.dateSubmitted).toBeTruthy();
        expect(change.affectedModules.length).toBeGreaterThan(0);
        expect(change.affectedBuilds.length).toBeGreaterThan(0);
      }
    });

    it("all IDs should be unique", () => {
      const ids = CHANGE_RECORDS.map((c) => c.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe("getChangeById", () => {
    it("returns correct change", () => {
      const change = getChangeById("eco-2025-042");
      expect(change).toBeDefined();
      expect(change!.title).toContain("MRAM");
    });

    it("returns undefined for unknown ID", () => {
      expect(getChangeById("nonexistent")).toBeUndefined();
    });
  });

  describe("getChangesByModule", () => {
    it("returns changes affecting GPP", () => {
      const changes = getChangesByModule("gpp-universal");
      expect(changes.length).toBeGreaterThan(0);
      for (const c of changes) {
        expect(c.affectedModules).toContain("gpp-universal");
      }
    });
  });

  describe("getChangesByBuild", () => {
    it("returns changes affecting baseline", () => {
      const changes = getChangesByBuild("baseline");
      expect(changes.length).toBeGreaterThan(0);
    });

    it("J2-specific changes exist", () => {
      const changes = getChangesByBuild("customer-b-pleo");
      const j2Only = changes.filter(
        (c) => c.affectedBuilds.length === 1 && c.affectedBuilds[0] === "customer-b-pleo"
      );
      expect(j2Only.length).toBeGreaterThan(0);
    });
  });

  describe("getChangesByStatus", () => {
    it("returns incorporated changes", () => {
      const incorporated = getChangesByStatus("Incorporated");
      expect(incorporated.length).toBeGreaterThan(0);
      for (const c of incorporated) {
        expect(c.status).toBe("Incorporated");
      }
    });
  });

  describe("getChangeStatusCounts", () => {
    it("counts sum to total records", () => {
      const counts = getChangeStatusCounts();
      const total = Object.values(counts).reduce((s, c) => s + c, 0);
      expect(total).toBe(CHANGE_RECORDS.length);
    });
  });

  describe("name helpers", () => {
    it("getModuleName returns readable names", () => {
      expect(getModuleName("gpp-universal")).toContain("GPP");
      expect(getModuleName("unknown")).toBe("unknown");
    });

    it("getBuildName returns readable names", () => {
      expect(getBuildName("baseline")).toBe("Baseline");
      expect(getBuildName("unknown")).toBe("unknown");
    });
  });
});

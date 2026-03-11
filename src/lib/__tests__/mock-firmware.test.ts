import {
  FIRMWARE_RELEASES,
  VERSION_MATRIX,
  getReleaseById,
  getReleasesByTarget,
  getLatestRelease,
  getVersionMatrixForBuild,
} from "@/lib/mock-firmware";

describe("mock-firmware", () => {
  describe("FIRMWARE_RELEASES", () => {
    it("should have 11 releases", () => {
      expect(FIRMWARE_RELEASES).toHaveLength(11);
    });

    it("all releases should have required fields", () => {
      for (const rel of FIRMWARE_RELEASES) {
        expect(rel.id).toBeTruthy();
        expect(rel.target).toBeTruthy();
        expect(rel.version).toBeTruthy();
        expect(rel.releaseDate).toBeTruthy();
        expect(rel.status).toBeTruthy();
        expect(rel.changelog.length).toBeGreaterThan(0);
        expect(rel.compatibleBuilds.length).toBeGreaterThan(0);
      }
    });

    it("all IDs should be unique", () => {
      const ids = FIRMWARE_RELEASES.map((r) => r.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe("VERSION_MATRIX", () => {
    it("should have 5 entries (one per build)", () => {
      expect(VERSION_MATRIX).toHaveLength(5);
    });

    it("every entry should have all 6 targets", () => {
      const targets = ["FPGA", "ARM", "CMC", "Crypto", "Boot", "PHY"] as const;
      for (const vm of VERSION_MATRIX) {
        for (const t of targets) {
          expect(vm.versions[t]).toBeTruthy();
        }
      }
    });
  });

  describe("getReleaseById", () => {
    it("returns correct release", () => {
      const rel = getReleaseById("fpga-3.2.1");
      expect(rel).toBeDefined();
      expect(rel!.target).toBe("FPGA");
      expect(rel!.version).toBe("3.2.1");
    });

    it("returns undefined for unknown ID", () => {
      expect(getReleaseById("nonexistent")).toBeUndefined();
    });
  });

  describe("getReleasesByTarget", () => {
    it("returns FPGA releases sorted by date descending", () => {
      const releases = getReleasesByTarget("FPGA");
      expect(releases.length).toBe(3);
      // Should be sorted newest first
      for (let i = 1; i < releases.length; i++) {
        expect(releases[i - 1].releaseDate >= releases[i].releaseDate).toBe(true);
      }
    });

    it("returns empty for unknown target", () => {
      // @ts-expect-error — testing with invalid target
      expect(getReleasesByTarget("Unknown")).toHaveLength(0);
    });
  });

  describe("getLatestRelease", () => {
    it("returns the latest released FPGA version", () => {
      const latest = getLatestRelease("FPGA");
      expect(latest).toBeDefined();
      expect(latest!.status).toBe("Released");
      expect(latest!.version).toBe("3.2.1");
    });

    it("returns latest released ARM version", () => {
      const latest = getLatestRelease("ARM");
      expect(latest).toBeDefined();
      expect(latest!.version).toBe("2.4.0");
    });
  });

  describe("getVersionMatrixForBuild", () => {
    it("returns baseline matrix", () => {
      const vm = getVersionMatrixForBuild("baseline");
      expect(vm).toBeDefined();
      expect(vm!.buildName).toBe("Baseline");
      expect(vm!.versions.FPGA).toBe("3.2.1");
    });

    it("returns undefined for unknown build", () => {
      expect(getVersionMatrixForBuild("nonexistent")).toBeUndefined();
    });
  });
});

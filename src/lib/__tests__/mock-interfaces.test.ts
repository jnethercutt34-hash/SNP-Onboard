import {
  SIGNAL_PATHS,
  BACKPLANE_INFO,
  DOMAINS,
  getSignalsByDomain,
  getSignalsBySlot,
  getSignalsByModule,
  getSignalsForBuild,
} from "@/lib/mock-interfaces";

describe("mock-interfaces", () => {
  describe("SIGNAL_PATHS", () => {
    it("should have 14 signal paths", () => {
      expect(SIGNAL_PATHS).toHaveLength(14);
    });

    it("all paths should have required fields", () => {
      for (const signal of SIGNAL_PATHS) {
        expect(signal.id).toBeTruthy();
        expect(signal.name).toBeTruthy();
        expect(signal.domain).toBeTruthy();
        expect(signal.protocol).toBeTruthy();
        expect(signal.speed).toBeTruthy();
        expect(signal.direction).toBeTruthy();
        expect(signal.sourceModule).toBeTruthy();
        expect(signal.destModule).toBeTruthy();
      }
    });

    it("all IDs should be unique", () => {
      const ids = SIGNAL_PATHS.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe("BACKPLANE_INFO", () => {
    it("should be VITA 78", () => {
      expect(BACKPLANE_INFO.standard).toContain("VITA 78");
    });

    it("should have 3 planes", () => {
      expect(BACKPLANE_INFO.planes).toHaveLength(3);
    });

    it("should have 7 slots", () => {
      expect(BACKPLANE_INFO.slots).toBe(7);
    });
  });

  describe("DOMAINS", () => {
    it("should have 5 domains", () => {
      expect(DOMAINS).toHaveLength(5);
    });
  });

  describe("getSignalsByDomain", () => {
    it("returns data plane signals", () => {
      const signals = getSignalsByDomain("Data Plane");
      expect(signals.length).toBeGreaterThan(0);
      for (const s of signals) {
        expect(s.domain).toBe("Data Plane");
      }
    });

    it("returns timing signals", () => {
      const signals = getSignalsByDomain("Timing");
      expect(signals.length).toBeGreaterThan(0);
    });
  });

  describe("getSignalsBySlot", () => {
    it("returns signals for slot 4 (GPP Red)", () => {
      const signals = getSignalsBySlot(4);
      expect(signals.length).toBeGreaterThan(0);
    });

    it("returns signals for slot 5 (Crypto)", () => {
      const signals = getSignalsBySlot(5);
      expect(signals.length).toBeGreaterThan(0);
    });
  });

  describe("getSignalsByModule", () => {
    it("returns signals for GPP", () => {
      const signals = getSignalsByModule("gpp-universal");
      expect(signals.length).toBeGreaterThan(0);
    });

    it("returns signals for crypto", () => {
      const signals = getSignalsByModule("crypto-unit");
      expect(signals.length).toBeGreaterThan(0);
    });
  });

  describe("getSignalsForBuild", () => {
    it("baseline gets general + baseline-specific signals", () => {
      const signals = getSignalsForBuild("baseline");
      expect(signals.length).toBeGreaterThan(0);
      // Should not include J2-only timing signals
      const timingSignals = signals.filter((s) => s.domain === "Timing");
      expect(timingSignals).toHaveLength(0);
    });

    it("J2 gets timing signals", () => {
      const signals = getSignalsForBuild("customer-b-pleo");
      const timingSignals = signals.filter((s) => s.domain === "Timing");
      expect(timingSignals.length).toBeGreaterThan(0);
    });
  });
});

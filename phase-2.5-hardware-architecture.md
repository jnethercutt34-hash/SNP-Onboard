# Phase 2.5: Hardware Architecture Context & Data Refactor

## Critical Context for Claude (Read First)
To accurately build this internal engineering tool, you must understand the physical relationship of 3U-VPX hardware. The system is not a flat list of parts; it is a nested, modular physical architecture:

1. **Universal GPP (General Purpose Processor) - The Carrier Board:** This is the primary, heavy-lifting 3U-VPX circuit board. It plugs directly into the standardized backplane. It contains the primary processors (Intel/NXP/ARM), RAM, and FPGA.
2. **Mezzanine Cards (XMC/PMC) - The Modular Add-ons:** These are smaller secondary circuit boards that bolt directly ONTO the GPP carrier board. They do not plug into the backplane; they plug into the GPP. 
3. **The SWaP-C Rule:** When a customer modifies a build (e.g., changing from Optical 10G to Copper), they are usually swapping the Mezzanine card, NOT the GPP base board. Therefore, the total Power and Weight of a single VPX slot is calculated as: `Base GPP + Attached Mezzanine(s)`.

## Task: Refactor `src/lib/mock-hardware.ts`
Based on this context, update our mock data structure to reflect this parent-child physical relationship.

### 1. Update TypeScript Interfaces
Refactor the interfaces to enforce that Mezzanine cards are children of Base cards:

```typescript
export type ComponentType = 'GPP_Base' | 'Mezzanine_XMC' | 'Expansion_Module';

export interface HardwareComponent {
  id: string;
  name: string;
  type: ComponentType;
  powerDrawWatts: number;
  weightLbs: number;
  description: string;
}

export interface VPXSlot {
  slotNumber: number;
  baseCard: HardwareComponent;
  attachedMezzanines: HardwareComponent[]; // Mezzanines bolt onto the base card
}

export interface SystemBuild {
  id: string;
  customerName: string;
  description: string;
  slots: VPXSlot[]; // The overall chassis contains multiple slots
  totalSystemPower: number; // Must be dynamically calculated
  totalSystemWeight: number; // Must be dynamically calculated
}
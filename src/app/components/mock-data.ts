export type WIStatus = "draft" | "published" | "archived";
export type UserRole = "administrator" | "supervisor" | "technician";

export interface Step {
  id: string;
  number: number;
  title: string;
  description: string;
  safetyNotes?: string;
  requiredTools?: string[];
  expectedResult?: string;
  imageUrl?: string;
  completed: boolean;
}

export interface WorkInstruction {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  estimatedTime: number; // minutes
  version: string;
  status: WIStatus;
  author: string;
  createdAt: string;
  lastModified: string;
  steps: Step[];
  completionPercentage: number;
  assignedUsers: string[];
  lastOpenedBy?: string;
  lastCompletedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department: string;
}

export const currentUser: User = {
  id: "u1",
  name: "Marco Rossi",
  email: "m.rossi@factory.com",
  role: "supervisor",
  department: "Assembly Line A",
};

export const mockUsers: User[] = [
  currentUser,
  { id: "u2", name: "Anna Schmidt", email: "a.schmidt@factory.com", role: "technician", department: "Maintenance" },
  { id: "u3", name: "James Porter", email: "j.porter@factory.com", role: "administrator", department: "Operations" },
  { id: "u4", name: "Sofia Müller", email: "s.muller@factory.com", role: "technician", department: "Quality Control" },
];

const makeSteps = (count: number): Step[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `s${i + 1}`,
    number: i + 1,
    title: [
      "Prepare workstation and gather materials",
      "Inspect components for visible defects",
      "Apply torque to fasteners per spec sheet",
      "Connect electrical harness and verify continuity",
      "Install protective cover and align mounting holes",
      "Run diagnostic self-test sequence",
      "Calibrate sensor to reference standard",
      "Apply protective coating and allow cure time",
      "Final visual inspection under UV light",
      "Document completion and sign off",
      "Clean workstation and return tools",
      "Submit quality checklist to supervisor",
    ][i % 12],
    description: [
      "Ensure all required tools are on the cart. Verify part numbers against the BOM. Position the assembly jig per fixture drawing FD-1042.",
      "Check surface finish Ra ≤ 1.6 µm. No burrs, cracks or corrosion permitted. Reject any part not meeting CMM report criteria.",
      "Use calibrated torque wrench TW-220. Apply 35 Nm ± 2 Nm. Follow cross-pattern sequence shown in diagram 3A.",
      "Route harness per layout drawing EL-0088. Secure with provided clips at 150 mm intervals. Test with continuity tester CT-5.",
      "Align cover to within 0.3 mm of reference edge. Insert M6 bolts and hand-tighten before final torque of 12 Nm.",
      "Launch test script TS-441 on the HMI. Confirm all 24 sensors report green. Record test ID and timestamp.",
      "Place unit on calibration stand CS-10. Apply 100 Hz reference signal. Adjust trimmer until output reads 1.000 V ± 0.005 V.",
      "Apply Loctite 243 to all external threads. Coat at ≥ 0.1 mm thickness. Allow 24-hour cure at 20 °C before load test.",
      "Under 365 nm UV lamp, check for micro-cracks using dye penetrant. Mark any indication larger than 2 mm for rejection.",
      "Complete digital form WF-12. Enter serial number, operator ID and test results. Confirm no open NCRs before sign-off.",
      "Return all tools to foam inset. Wipe surfaces with IPA wipe. Ensure waste bin is < 50 % full before leaving station.",
      "Print QC checklist from MES terminal. Sign and date. Place in traveller packet for traceability.",
    ][i % 12],
    safetyNotes: i % 3 === 0 ? "⚠️ Wear ESD wrist strap at all times. Disconnect power before handling PCBs." : undefined,
    requiredTools: [["Torque wrench TW-220", "Allen key set M3-M12"], ["Continuity tester CT-5", "Cable tie gun"], ["Calibration stand CS-10", "Digital multimeter DM-88"]][i % 3],
    expectedResult: "Component passes specification and quality gate is cleared.",
    completed: i < 3,
  }));

export const mockWorkInstructions: WorkInstruction[] = [
  {
    id: "wi-001",
    title: "Hydraulic Pump Assembly — Model H420",
    description: "Complete assembly procedure for the H420 hydraulic pump including pre-checks, torque sequences, and final test.",
    category: "Assembly",
    tags: ["hydraulic", "pump", "critical"],
    estimatedTime: 90,
    version: "3.2",
    status: "published",
    author: "James Porter",
    createdAt: "2025-11-12",
    lastModified: "2026-05-28",
    steps: makeSteps(12),
    completionPercentage: 25,
    assignedUsers: ["Marco Rossi", "Anna Schmidt"],
    lastOpenedBy: "Marco Rossi",
    lastCompletedAt: "2026-06-01",
  },
  {
    id: "wi-002",
    title: "Conveyor Belt Tension Adjustment",
    description: "Step-by-step procedure to adjust and verify belt tension on conveyor lines C1 through C4.",
    category: "Maintenance",
    tags: ["conveyor", "belt", "preventive"],
    estimatedTime: 45,
    version: "1.4",
    status: "published",
    author: "Anna Schmidt",
    createdAt: "2026-01-05",
    lastModified: "2026-06-02",
    steps: makeSteps(8),
    completionPercentage: 100,
    assignedUsers: ["Sofia Müller"],
    lastOpenedBy: "Sofia Müller",
    lastCompletedAt: "2026-06-08",
  },
  {
    id: "wi-003",
    title: "CNC Lathe Daily Start-Up Checklist",
    description: "Morning start-up procedure and safety checks for CNC lathes L1, L2, and L3 before production begins.",
    category: "Operations",
    tags: ["cnc", "lathe", "daily", "safety"],
    estimatedTime: 20,
    version: "2.0",
    status: "published",
    author: "Marco Rossi",
    createdAt: "2025-09-18",
    lastModified: "2026-03-15",
    steps: makeSteps(6),
    completionPercentage: 0,
    assignedUsers: ["Marco Rossi", "James Porter", "Anna Schmidt"],
    lastOpenedBy: "Marco Rossi",
  },
  {
    id: "wi-004",
    title: "PCB Soldering Quality Inspection",
    description: "Visual and electrical quality inspection procedure for through-hole and SMD soldering on PCB assemblies.",
    category: "Quality Control",
    tags: ["pcb", "soldering", "inspection", "smd"],
    estimatedTime: 60,
    version: "1.1",
    status: "draft",
    author: "Sofia Müller",
    createdAt: "2026-05-20",
    lastModified: "2026-06-07",
    steps: makeSteps(10),
    completionPercentage: 0,
    assignedUsers: [],
  },
  {
    id: "wi-005",
    title: "Forklift Pre-Operation Safety Check",
    description: "Mandatory safety checklist to complete before operating any forklift in the warehouse zones W1–W6.",
    category: "Safety",
    tags: ["forklift", "safety", "warehouse"],
    estimatedTime: 15,
    version: "4.0",
    status: "published",
    author: "James Porter",
    createdAt: "2025-06-01",
    lastModified: "2026-02-10",
    steps: makeSteps(7),
    completionPercentage: 57,
    assignedUsers: ["Marco Rossi", "Anna Schmidt", "Sofia Müller"],
    lastOpenedBy: "Anna Schmidt",
    lastCompletedAt: "2026-06-05",
  },
  {
    id: "wi-006",
    title: "Paint Booth Cleaning Procedure",
    description: "Weekly deep-clean procedure for paint booth filters, nozzles, and floor coating in accordance with EHS standards.",
    category: "Maintenance",
    tags: ["paint", "booth", "cleaning", "ehs"],
    estimatedTime: 120,
    version: "2.1",
    status: "archived",
    author: "Anna Schmidt",
    createdAt: "2024-11-30",
    lastModified: "2025-08-14",
    steps: makeSteps(9),
    completionPercentage: 0,
    assignedUsers: [],
  },
];

export const categories = ["Assembly", "Maintenance", "Operations", "Quality Control", "Safety", "Logistics"];

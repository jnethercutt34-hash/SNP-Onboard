# SNP Document Library

Drop files into the relevant subfolder. The app serves everything under
`/documents/` as a static path — link to files as `/documents/<path>/<filename.pdf>`.

```
documents/
│
├── icd/                Interface Control Documents
│   └── ...             SNP-ICD-xxx — external system interfaces
│
├── idd/                Interface Design Documents
│   └── ...             SNP-IDD-xxx — detailed interface design specs
│
├── irs/                Interface Requirements Specifications
│   └── ...             SNP-IRS-xxx — interface requirements (pre-design)
│
├── requirements/
│   ├── system/         System Requirements Specification (SyRS)
│   ├── hardware/       Hardware Requirements Specification (HRS)
│   └── software/       Software Requirements Specification (SRS)
│
├── design/
│   ├── hardware/       Hardware Design Documents (HDD) — schematics, layouts
│   ├── software/       Software Design Documents (SDD) — architecture, modules
│   └── firmware/       Firmware Design Documents (FDD) — FPGA, BSP design
│
├── test/
│   ├── plans/          Test Plans — ATP, environmental, EMI, radiation
│   ├── procedures/     Test Procedures — step-by-step test scripts
│   └── reports/        Test Reports — qualification, acceptance, regression
│
├── certifications/     FIPS 140-2 certificates, MIL-SPEC quals, inspection certs
│
├── standards/          Referenced standards — VITA 78, MIL-STDs, IEEE, FIPS pubs
│
├── user-docs/          User Manuals, Operator Guides, Installation & Maintenance
│
└── customer/
    ├── baseline/       Baseline reference build — proposals, specs, CDRs
    ├── customer-a-pleo/  Customer A pLEO — customer ICDs, SOW, delivery docs
    └── customer-b-geo/   Customer B (legacy folder — see j2-pleo/)
```

## Naming Convention

`SNP-<TYPE>-<SUBSYSTEM>-<NUMBER>_Rev<X>.pdf`

Examples:
- `SNP-ICD-BACKPLANE-001_RevB.pdf`
- `SNP-HRS-GPP-002_RevA.pdf`
- `SNP-ATP-SYS-001_RevC.pdf`

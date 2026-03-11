"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ImportStatus = "idle" | "parsing" | "preview" | "error";

interface ParsedRow {
  manufacturerPartNumber: string;
  manufacturer: string;
  description: string;
  category: string;
  footprint: string;
  value: string;
  quantity: string;
  solderTermination: string;
  qualificationLevel: string;
  [key: string]: string;
}

export default function BOMImportPage() {
  const [status, setStatus] = useState<ImportStatus>("idle");
  const [fileName, setFileName] = useState<string>("");
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setStatus("parsing");
    setError("");

    try {
      if (file.name.endsWith(".csv") || file.name.endsWith(".txt")) {
        const text = await file.text();
        const lines = text.split("\n").filter((l) => l.trim());
        if (lines.length < 2) {
          throw new Error("File must have a header row and at least one data row.");
        }

        const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
        setColumns(headers);

        const rows: ParsedRow[] = [];
        for (let i = 1; i < lines.length; i++) {
          const vals = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
          const row: Record<string, string> = {};
          headers.forEach((h, idx) => {
            row[h] = vals[idx] || "";
          });
          rows.push(row as ParsedRow);
        }
        setParsedRows(rows);
        setStatus("preview");
      } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        // For Excel files, we'd send to the API route
        // For now, show guidance
        setError(
          "Excel import requires the server-side API. Drop your .xlsx file into public/documents/bom/ and it will be parsed on the next server restart. Or export to CSV for client-side preview."
        );
        setStatus("error");
      } else {
        setError("Unsupported file type. Please use .csv or .xlsx format.");
        setStatus("error");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse file.");
      setStatus("error");
    }
  };

  const expectedColumns = [
    { name: "manufacturerPartNumber", description: "Manufacturer part number (e.g., RC0402FR-0710KL)", required: true },
    { name: "manufacturer", description: "Manufacturer name (e.g., Yageo, Murata)", required: true },
    { name: "description", description: "Part description", required: true },
    { name: "category", description: "Resistor, Capacitor, IC, etc.", required: true },
    { name: "footprint", description: "Package footprint (e.g., 0402, 0603, QFN-48)", required: true },
    { name: "value", description: "Component value (e.g., 10kΩ, 100nF)", required: false },
    { name: "tolerance", description: "Value tolerance (e.g., ±1%)", required: false },
    { name: "quantity", description: "Quantity per unit/build", required: true },
    { name: "voltageRating", description: "Rated voltage (e.g., 50V)", required: false },
    { name: "powerRating", description: "Rated power (e.g., 0.063W)", required: false },
    { name: "temperatureRange", description: "Operating temp range", required: false },
    { name: "solderTermination", description: "Pure-Tin, SnPb, Gold, or N/A", required: true },
    { name: "qualificationLevel", description: "QML-Q, QML-V, MIL-PRF, COTS-Plus, COTS, TBD", required: true },
    { name: "usedOnModules", description: "Module IDs separated by semicolons", required: false },
    { name: "notes", description: "Usage notes or comments", required: false },
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* ── Breadcrumb ─────────────────────────────────────────── */}
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/parts" className="hover:text-foreground transition-colors">
          Parts & Materials
        </Link>
        <span className="mx-2">›</span>
        <span className="text-foreground">Import BOM</span>
      </nav>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Import Bill of Materials
        </h1>
        <p className="mt-2 text-muted-foreground">
          Upload a CSV or Excel BOM file to populate the parts database. The import will validate
          columns, preview the data, and merge with the existing catalog.
        </p>
      </div>

      {/* ── Expected Format ────────────────────────────────────── */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-heading text-lg">Expected BOM Format</CardTitle>
          <CardDescription>
            Your file should include these columns. Required columns are marked with *.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">
                    Column
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">
                    Description
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground uppercase">
                    Required
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {expectedColumns.map((col) => (
                  <tr key={col.name}>
                    <td className="px-3 py-2 font-mono text-xs text-foreground">
                      {col.name}
                    </td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">
                      {col.description}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {col.required ? (
                        <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                          Required
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">Optional</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── Upload Area ────────────────────────────────────────── */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-heading text-lg">Upload File</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.xlsx,.xls,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="text-4xl mb-3">📄</div>
            <p className="text-sm text-foreground font-medium mb-1">
              {fileName || "Click to select a BOM file"}
            </p>
            <p className="text-xs text-muted-foreground">
              Supports .csv, .xlsx, .xls — drag & drop coming soon
            </p>
          </div>

          {status === "parsing" && (
            <div className="mt-4 text-sm text-muted-foreground text-center">
              Parsing file…
            </div>
          )}

          {status === "error" && (
            <div className="mt-4 rounded-md bg-red-500/10 border border-red-500/20 p-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Preview ────────────────────────────────────────────── */}
      {status === "preview" && parsedRows.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-heading text-lg">
                  Preview — {parsedRows.length} rows
                </CardTitle>
                <CardDescription>
                  {columns.length} columns detected: {columns.join(", ")}
                </CardDescription>
              </div>
              <Button
                className="shrink-0"
                onClick={() => {
                  // TODO: Send to API for persistence
                  alert(
                    `Import of ${parsedRows.length} parts is ready.\n\nIn the deployed version, this will merge with the parts catalog via the server API.\n\nFor now, add parts directly to src/lib/mock-parts.ts or drop the file in public/documents/bom/ for AI knowledge base ingestion.`
                  );
                }}
              >
                Import {parsedRows.length} Parts
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-card">
                  <tr className="border-b border-border">
                    <th className="px-2 py-2 text-left font-medium text-muted-foreground">
                      #
                    </th>
                    {columns.slice(0, 8).map((col) => (
                      <th
                        key={col}
                        className="px-2 py-2 text-left font-medium text-muted-foreground"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {parsedRows.slice(0, 50).map((row, i) => (
                    <tr key={i} className="hover:bg-card/50">
                      <td className="px-2 py-1.5 text-muted-foreground">
                        {i + 1}
                      </td>
                      {columns.slice(0, 8).map((col) => (
                        <td key={col} className="px-2 py-1.5 text-foreground">
                          {row[col] || "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {parsedRows.length > 50 && (
                <p className="py-2 text-center text-xs text-muted-foreground">
                  Showing first 50 of {parsedRows.length} rows
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Info Card ──────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Import Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">CSV format:</strong> Standard comma-separated
            with header row. Values containing commas should be quoted.
          </p>
          <p>
            <strong className="text-foreground">Excel format:</strong> First sheet will be parsed.
            Header row must be in row 1.
          </p>
          <p>
            <strong className="text-foreground">Module mapping:</strong> The{" "}
            <code className="text-xs bg-secondary px-1 py-0.5 rounded">usedOnModules</code>{" "}
            column should contain module detail IDs separated by semicolons (e.g.,{" "}
            <code className="text-xs bg-secondary px-1 py-0.5 rounded">
              gpp-universal;optical-10g
            </code>
            ).
          </p>
          <p>
            <strong className="text-foreground">Deployment:</strong> When deployed on the
            company server, imported BOMs will persist to the database and be available to the
            AI knowledge base for natural-language queries.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

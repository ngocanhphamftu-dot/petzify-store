import React from "react";
import InfoPage from "@/components/InfoPage";

export const metadata = { title: "Size Chart – Petzify" };

// ── Shirts / Hawaiian Shirts ──────────────────────────────────────────────────
const shirtSizes = [
  { size: "S",   chest: '34–36"', length: '27"', shoulder: '16.5"' },
  { size: "M",   chest: '38–40"', length: '28"', shoulder: '17.5"' },
  { size: "L",   chest: '42–44"', length: '29"', shoulder: '18.5"' },
  { size: "XL",  chest: '46–48"', length: '30"', shoulder: '19.5"' },
  { size: "2XL", chest: '50–52"', length: '31"', shoulder: '20.5"' },
  { size: "3XL", chest: '54–56"', length: '32"', shoulder: '21.5"' },
  { size: "4XL", chest: '58–60"', length: '33"', shoulder: '22.5"' },
  { size: "5XL", chest: '62–64"', length: '34"', shoulder: '23.5"' },
];

// ── Doormat ───────────────────────────────────────────────────────────────────
const doormatSizes = [
  { size: 'Small',  dimensions: '18" × 30"', area: '540 sq in', note: 'Apartment / single door' },
  { size: 'Medium', dimensions: '24" × 36"', area: '864 sq in', note: 'Standard front door' },
  { size: 'Large',  dimensions: '24" × 48"', area: '1,152 sq in', note: 'Double door / wide entry' },
];

// ── Mug ───────────────────────────────────────────────────────────────────────
const mugSizes = [
  { size: '11 oz', height: '3.8"', diameter: '3.2"', note: 'Classic size — most popular' },
  { size: '15 oz', height: '4.5"', diameter: '3.4"', note: 'Large size — great for coffee lovers' },
];

// ── Beach Towel ───────────────────────────────────────────────────────────────
const towelSizes = [
  { size: 'Standard', dimensions: '30" × 60"', weight: '400 gsm', note: 'Single person' },
  { size: 'XL',       dimensions: '35" × 70"', weight: '400 gsm', note: 'Extra coverage' },
  { size: 'XXL',      dimensions: '40" × 80"', weight: '400 gsm', note: 'Oversized / couples' },
];

// ── Graduation Stole ──────────────────────────────────────────────────────────
const stoleSizes = [
  { size: 'Kids (K–5)',    length: '45"', width: '4"', note: 'Pre-K to Grade 5' },
  { size: 'Youth (6–8)',   length: '52"', width: '4"', note: 'Middle school' },
  { size: 'Teen (9–12)',   length: '60"', width: '4"', note: 'High school' },
  { size: 'Adult',        length: '68"', width: '4"', note: 'College / University' },
];

// ── Belt ──────────────────────────────────────────────────────────────────────
const beltSizes = [
  { size: 'S',   waist: '28–30"', length: '40"' },
  { size: 'M',   waist: '32–34"', length: '43"' },
  { size: 'L',   waist: '36–38"', length: '46"' },
  { size: 'XL',  waist: '40–42"', length: '49"' },
  { size: '2XL', waist: '44–46"', length: '52"' },
];

// ── Cutting Board ─────────────────────────────────────────────────────────────
const cuttingBoardSizes = [
  { size: 'Small',  dimensions: '8" × 10"',  thickness: '0.4"', note: 'Snack / prep board' },
  { size: 'Medium', dimensions: '10" × 14"', thickness: '0.4"', note: 'Standard kitchen use' },
  { size: 'Large',  dimensions: '12" × 18"', thickness: '0.5"', note: 'Family size / display piece' },
];

// ── Pocket Hug ────────────────────────────────────────────────────────────────
const pocketHugSizes = [
  { size: 'Standard', dimensions: '2.5" × 3.5"', thickness: '0.15"', note: 'Fits in any pocket or wallet' },
];

// ── Night Light ───────────────────────────────────────────────────────────────
const nightLightSizes = [
  { size: 'Small',  dimensions: '6" × 4"',  note: 'Bedside / desk accent' },
  { size: 'Medium', dimensions: '8" × 6"',  note: 'Shelf display' },
  { size: 'Large',  dimensions: '12" × 8"', note: 'Room centerpiece' },
];

// ── Whiskey Glass ─────────────────────────────────────────────────────────────
const glassData = [
  { size: 'Standard (8 oz)', height: '3.3"', diameter: '3.1"', note: 'Classic rocks glass' },
  { size: 'Large (12 oz)',   height: '3.8"', diameter: '3.5"', note: 'Double rocks glass' },
];

// ── Garden Stake ──────────────────────────────────────────────────────────────
const stakeData = [
  { size: 'Small',  dimensions: '6" × 8"',   stakeLength: '12"', note: 'Small planter / pot' },
  { size: 'Medium', dimensions: '8" × 10"',  stakeLength: '16"', note: 'Garden bed' },
  { size: 'Large',  dimensions: '10" × 12"', stakeLength: '20"', note: 'Yard / lawn display' },
];

// ── Helper: reusable table ────────────────────────────────────────────────────
function SizeTable({ headers, rows }: { headers: string[]; rows: (string | React.ReactNode)[][] }) {
  return (
    <div className="overflow-x-auto not-prose mb-8">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-[#F36621] text-white">
            {headers.map((h, i) => (
              <th
                key={h}
                className={`px-4 py-3 text-left ${i === 0 ? "rounded-tl-xl" : ""} ${i === headers.length - 1 ? "rounded-tr-xl" : ""}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              {row.map((cell, j) => (
                <td key={j} className={`px-4 py-3 ${j === 0 ? "font-semibold text-gray-800" : "text-gray-600"}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SizeChartPage() {
  return (
    <InfoPage title="Size Chart">
      <p>
        Use the size charts below to find your perfect fit. All measurements are in inches unless
        otherwise noted. Body measurements are used — not garment measurements.
      </p>

      <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-sm text-gray-600 not-prose mb-8">
        <strong>💡 Tip:</strong> If you are between sizes, we recommend sizing up for a more comfortable fit.
        Still unsure? Email us at <a href="mailto:support@petzify.co" className="text-[#F36621] underline">support@petzify.co</a> before ordering.
      </div>

      {/* ── SHIRTS ── */}
      <h2 className="text-xl font-bold text-gray-800 mt-6 mb-3">👕 Shirts &amp; Hawaiian Shirts</h2>
      <SizeTable
        headers={["Size", "Chest", "Length", "Shoulder"]}
        rows={shirtSizes.map(r => [r.size, r.chest, r.length, r.shoulder])}
      />

      {/* ── DOORMATS ── */}
      <h2 className="text-xl font-bold text-gray-800 mt-2 mb-3">🚪 Doormats</h2>
      <SizeTable
        headers={["Size", "Dimensions", "Area", "Best For"]}
        rows={doormatSizes.map(r => [r.size, r.dimensions, r.area, r.note])}
      />

      {/* ── MUGS ── */}
      <h2 className="text-xl font-bold text-gray-800 mt-2 mb-3">☕ Mugs</h2>
      <SizeTable
        headers={["Size", "Height", "Diameter", "Notes"]}
        rows={mugSizes.map(r => [r.size, r.height, r.diameter, r.note])}
      />

      {/* ── BEACH TOWELS ── */}
      <h2 className="text-xl font-bold text-gray-800 mt-2 mb-3">🏖️ Beach Towels</h2>
      <SizeTable
        headers={["Size", "Dimensions", "Weight", "Best For"]}
        rows={towelSizes.map(r => [r.size, r.dimensions, r.weight, r.note])}
      />

      {/* ── GRADUATION STOLES ── */}
      <h2 className="text-xl font-bold text-gray-800 mt-2 mb-3">🎓 Graduation Stoles</h2>
      <SizeTable
        headers={["Size", "Length", "Width", "Best For"]}
        rows={stoleSizes.map(r => [r.size, r.length, r.width, r.note])}
      />

      {/* ── BELTS ── */}
      <h2 className="text-xl font-bold text-gray-800 mt-2 mb-3">🪢 Belts</h2>
      <p className="text-sm text-gray-500 not-prose mb-3">
        Measure your natural waist (where you normally wear your belt) for the best fit.
      </p>
      <SizeTable
        headers={["Size", "Waist", "Total Belt Length"]}
        rows={beltSizes.map(r => [r.size, r.waist, r.length])}
      />

      {/* ── CUTTING BOARDS ── */}
      <h2 className="text-xl font-bold text-gray-800 mt-2 mb-3">🪵 Cutting Boards</h2>
      <SizeTable
        headers={["Size", "Dimensions", "Thickness", "Notes"]}
        rows={cuttingBoardSizes.map(r => [r.size, r.dimensions, r.thickness, r.note])}
      />

      {/* ── POCKET HUGS ── */}
      <h2 className="text-xl font-bold text-gray-800 mt-2 mb-3">🤗 Pocket Hugs (Leather Cards)</h2>
      <SizeTable
        headers={["Size", "Dimensions", "Thickness", "Notes"]}
        rows={pocketHugSizes.map(r => [r.size, r.dimensions, r.thickness, r.note])}
      />

      {/* ── NIGHT LIGHTS ── */}
      <h2 className="text-xl font-bold text-gray-800 mt-2 mb-3">🌙 Night Lights</h2>
      <SizeTable
        headers={["Size", "Dimensions", "Best For"]}
        rows={nightLightSizes.map(r => [r.size, r.dimensions, r.note])}
      />

      {/* ── WHISKEY GLASSES ── */}
      <h2 className="text-xl font-bold text-gray-800 mt-2 mb-3">🥃 Whiskey Glasses</h2>
      <SizeTable
        headers={["Size", "Height", "Diameter", "Style"]}
        rows={glassData.map(r => [r.size, r.height, r.diameter, r.note])}
      />

      {/* ── GARDEN STAKES ── */}
      <h2 className="text-xl font-bold text-gray-800 mt-2 mb-3">🌿 Garden Stakes</h2>
      <SizeTable
        headers={["Size", "Sign Dimensions", "Stake Length", "Best For"]}
        rows={stakeData.map(r => [r.size, r.dimensions, r.stakeLength, r.note])}
      />

      {/* ── HOW TO MEASURE ── */}
      <h2 className="text-xl font-bold text-gray-800 mt-6 mb-3">📏 How to Measure</h2>
      <ul>
        <li><strong>Chest (shirts):</strong> Measure around the fullest part of your chest, keeping the tape horizontal.</li>
        <li><strong>Length (shirts):</strong> Measure from the top of your shoulder down to your desired hem length.</li>
        <li><strong>Shoulder (shirts):</strong> Measure from the edge of one shoulder to the other across the back.</li>
        <li><strong>Waist (belts):</strong> Measure around your natural waist where you normally wear a belt.</li>
        <li><strong>Doormat:</strong> Measure the width of your door frame and leave 4–6" on each side.</li>
      </ul>

      <p className="text-sm text-gray-400 mt-6">
        Measurements may vary slightly ± 0.5" between individual products due to the handcrafted nature of our items.
        Questions? Contact us at{" "}
        <a href="mailto:support@petzify.co" className="text-[#F36621] underline">support@petzify.co</a>.
      </p>
    </InfoPage>
  );
}

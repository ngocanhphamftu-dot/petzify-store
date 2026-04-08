import InfoPage from "@/components/InfoPage";

export const metadata = { title: "Size Chart – Petzify" };

const shirtSizes = [
  { size: "S", chest: '34–36"', length: '27"', shoulder: '16.5"' },
  { size: "M", chest: '38–40"', length: '28"', shoulder: '17.5"' },
  { size: "L", chest: '42–44"', length: '29"', shoulder: '18.5"' },
  { size: "XL", chest: '46–48"', length: '30"', shoulder: '19.5"' },
  { size: "2XL", chest: '50–52"', length: '31"', shoulder: '20.5"' },
  { size: "3XL", chest: '54–56"', length: '32"', shoulder: '21.5"' },
  { size: "4XL", chest: '58–60"', length: '33"', shoulder: '22.5"' },
  { size: "5XL", chest: '62–64"', length: '34"', shoulder: '23.5"' },
];

export default function SizeChartPage() {
  return (
    <InfoPage title="Size Chart">
      <p>
        Use the size charts below to find your perfect fit. All measurements are in inches and refer
        to body measurements, not garment measurements.
      </p>

      <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-sm text-gray-600 not-prose mb-6">
        <strong>Tip:</strong> If you are between sizes, we recommend sizing up for a more comfortable fit.
      </div>

      <h2 className="text-xl font-semibold text-gray-800">Hawaiian Shirts</h2>
      <div className="overflow-x-auto not-prose">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#F36621] text-white">
              <th className="px-4 py-3 text-left rounded-tl-xl">Size</th>
              <th className="px-4 py-3 text-left">Chest</th>
              <th className="px-4 py-3 text-left">Length</th>
              <th className="px-4 py-3 text-left rounded-tr-xl">Shoulder</th>
            </tr>
          </thead>
          <tbody>
            {shirtSizes.map((row, i) => (
              <tr key={row.size} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-3 font-semibold text-gray-800">{row.size}</td>
                <td className="px-4 py-3">{row.chest}</td>
                <td className="px-4 py-3">{row.length}</td>
                <td className="px-4 py-3">{row.shoulder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mt-8">How to Measure</h2>
      <ul>
        <li><strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape horizontal.</li>
        <li><strong>Length:</strong> Measure from the top of your shoulder down to your desired hem length.</li>
        <li><strong>Shoulder:</strong> Measure from the edge of one shoulder to the other across the back.</li>
      </ul>

      <p className="text-sm text-gray-400 mt-4">
        Measurements may vary slightly between products. If you have questions, contact us at support@petzify.co.
      </p>
    </InfoPage>
  );
}

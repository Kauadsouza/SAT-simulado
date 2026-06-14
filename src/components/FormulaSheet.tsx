import { MathText } from './MathText';

const formulas = [
  { label: 'Circle', items: ['Area: \\(A = \\pi r^2\\)', 'Circumference: \\(C = 2\\pi r\\)'] },
  { label: 'Rectangle', items: ['Area: \\(A = lw\\)', 'Perimeter: \\(P = 2l + 2w\\)'] },
  { label: 'Triangle', items: ['Area: \\(A = \\frac{1}{2}bh\\)', 'Pythagorean: \\(a^2 + b^2 = c^2\\)'] },
  { label: 'Special Right Triangles', items: ['30-60-90: \\(1, \\sqrt{3}, 2\\)', '45-45-90: \\(1, 1, \\sqrt{2}\\)'] },
  { label: 'Cylinder', items: ['\\(V = \\pi r^2 h\\)'] },
  { label: 'Sphere', items: ['\\(V = \\frac{4}{3}\\pi r^3\\)'] },
  { label: 'Cone', items: ['\\(V = \\frac{1}{3}\\pi r^2 h\\)'] },
  { label: 'Rectangular Prism', items: ['\\(V = lwh\\)'] },
  { label: 'Linear', items: ['Slope: \\(m = \\frac{y_2 - y_1}{x_2 - x_1}\\)', 'Slope-intercept: \\(y = mx + b\\)'] },
  { label: 'Quadratic Formula', items: ['\\(x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\\)'] },
];

interface Props {
  onClose: () => void;
}

export function FormulaSheet({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div
        className="rounded-xl p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[85vh] overflow-y-auto"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
            Reference — Math Formulas
          </h3>
          <button onClick={onClose} className="p-1 rounded hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {formulas.map((group) => (
            <div
              key={group.label}
              className="rounded-lg p-4"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
            >
              <div className="text-xs font-semibold mb-2" style={{ color: 'var(--accent)' }}>
                {group.label}
              </div>
              {group.items.map((item, j) => (
                <div key={j} className="text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                  <MathText text={item} />
                </div>
              ))}
            </div>
          ))}
        </div>

        <p className="text-xs mt-4" style={{ color: 'var(--text-secondary)' }}>
          The number of degrees of arc in a circle is 360. The number of radians of arc in a circle is 2π. The sum of the measures in degrees of the angles of a triangle is 180.
        </p>
      </div>
    </div>
  );
}

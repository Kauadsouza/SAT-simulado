import { ENGLISH_VARIANTS, type EnglishVariant } from '../../lib/learning-hub';
import { useLearningWorkspace } from './Workspace';

const options: EnglishVariant[] = ['british', 'american'];

export function EnglishVariantSwitch() {
  const { state, save, busy } = useLearningWorkspace();
  const selected = state.settings.variant;

  return <section className="learn-variant-switch" aria-labelledby="english-variant-title">
    <div className="learn-variant-copy">
      <strong id="english-variant-title">Quero estudar</strong>
    </div>
    <div className="learn-variant-options" role="group" aria-label="Variedade de inglês">
      {options.map(variant => {
        const meta = ENGLISH_VARIANTS[variant];
        const active = selected === variant;
        return <button
          type="button"
          aria-pressed={active}
          className={active ? 'selected' : ''}
          disabled={busy}
          onClick={() => { if (!active) void save(value => { value.settings.variant = variant; }); }}
          key={variant}
        >
          <span className="learn-variant-code" aria-hidden="true">{variant === 'british' ? 'GB' : 'US'}</span>
          <span><strong>{meta.label}</strong></span>
          {active && <span aria-label="Selecionado">✓</span>}
        </button>;
      })}
    </div>
  </section>;
}

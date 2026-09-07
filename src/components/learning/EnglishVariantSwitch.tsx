import { ENGLISH_VARIANTS, type EnglishVariant } from '../../lib/learning-hub';
import { useLearningWorkspace } from './Workspace';

const options: EnglishVariant[] = ['british', 'american'];

export function EnglishVariantSwitch() {
  const { state, save, busy } = useLearningWorkspace();
  const selected = state.settings.variant;

  return <section className="learn-variant-switch" aria-labelledby="english-variant-title">
    <div className="learn-variant-copy">
      <span className="learn-eyebrow">ESCOLHA A VARIEDADE DESTA TRILHA</span>
      <strong id="english-variant-title">O mesmo método, em dois ingleses.</strong>
      <p>Mudam a voz, o vocabulário, os exemplos, as práticas e o curso principal. Seu nível, seu ritmo e suas anotações continuam juntos.</p>
    </div>
    <div className="learn-variant-options" role="radiogroup" aria-label="Variedade de inglês">
      {options.map(variant => {
        const meta = ENGLISH_VARIANTS[variant];
        const active = selected === variant;
        return <button
          type="button"
          role="radio"
          aria-checked={active}
          className={active ? 'selected' : ''}
          disabled={busy}
          onClick={() => { if (!active) void save(value => { value.settings.variant = variant; }); }}
          key={variant}
        >
          <span className="learn-variant-code" aria-hidden="true">{variant === 'british' ? 'GB' : 'US'}</span>
          <span><strong>{meta.label}</strong><small>{meta.context}</small></span>
          {active && <span className="learn-variant-active">trilha atual</span>}
        </button>;
      })}
    </div>
  </section>;
}

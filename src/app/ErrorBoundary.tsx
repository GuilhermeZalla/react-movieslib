import { t } from '../i18n/translate';
import { Component, type ReactNode } from 'react';
interface State {
  failed: boolean;
}
export default class ErrorBoundary extends Component<
  { children: ReactNode },
  State
> {
  state: State = { failed: false };
  static getDerivedStateFromError(): State {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <main className="empty-panel min-h-screen bg-preview-canvas text-preview-ink">
          <h1 className="section-title">{t('A sessão foi interrompida')}</h1>
          <p>
            {t(
              'Recarregue a página para começar de novo. Sua lista continua neste navegador.',
            )}
          </p>
          <button
            type="button"
            className="button-primary"
            onClick={() => window.location.reload()}
          >
            {t('Recarregar página')}
          </button>
        </main>
      );
    return this.props.children;
  }
}

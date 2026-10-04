/**
 * Notification / Toast System for User Feedback and Consensus Alerts.
 * Accessible, non-blocking, with auto-dismiss and close buttons.
 */

class NotificationManager {
  constructor() {
    this._container = null;
  }

  _getContainer() {
    if (!this._container) {
      this._container = document.getElementById('toast-container');
      if (!this._container) {
        this._container = document.createElement('div');
        this._container.id = 'toast-container';
        this._container.className = 'toast-container';
        this._container.setAttribute('aria-live', 'polite');
        this._container.setAttribute('role', 'region');
        this._container.setAttribute('aria-label', 'Notificações da aplicação');
        document.body.appendChild(this._container);
      }
    }
    return this._container;
  }

  /**
   * Display a toast notification
   * @param {string} message
   * @param {'info'|'success'|'warning'|'error'} [type='info']
   * @param {string} [title='']
   * @param {number} [duration=3800]
   */
  show(message, type = 'info', title = '', duration = 3800) {
    const container = this._getContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'status');

    const icons = {
      success: '✅',
      info: 'ℹ️',
      warning: '⚠️',
      error: '🚨'
    };

    const defaultTitles = {
      success: 'Concluído',
      info: 'Informação',
      warning: 'Atenção',
      error: 'Alerta de Consenso'
    };

    const toastIcon = icons[type] || 'ℹ️';
    const toastTitle = title || defaultTitles[type] || 'Notificação';

    toast.innerHTML = `
      <span class="toast-icon" aria-hidden="true">${toastIcon}</span>
      <div class="toast-content">
        <span class="toast-title">${toastTitle}</span>
        <span class="toast-message">${message}</span>
      </div>
      <button class="toast-close-btn" aria-label="Fechar notificação">&times;</button>
    `;

    const closeBtn = toast.querySelector('.toast-close-btn');
    const dismiss = () => {
      toast.classList.add('toast-fadeout');
      setTimeout(() => {
        if (toast.parentElement) {
          toast.parentElement.removeChild(toast);
        }
      }, 260);
    };

    closeBtn.addEventListener('click', dismiss);

    if (duration > 0) {
      setTimeout(dismiss, duration);
    }

    container.appendChild(toast);
    return toast;
  }

  success(msg, title = 'Sucesso') {
    return this.show(msg, 'success', title);
  }

  info(msg, title = 'Informação') {
    return this.show(msg, 'info', title);
  }

  warning(msg, title = 'Aviso') {
    return this.show(msg, 'warning', title);
  }

  error(msg, title = 'Erro') {
    return this.show(msg, 'error', title, 5000);
  }
}

export const notifications = new NotificationManager();
export default notifications;

(() => {
    const storageKey = 'nsl-theme';
    const root = document.documentElement;
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)');
    let savedTheme = null;

    try {
        savedTheme = localStorage.getItem(storageKey);
    } catch {
        savedTheme = null;
    }

    let currentTheme = savedTheme === 'dark' || savedTheme === 'light'
        ? savedTheme
        : systemPreference.matches ? 'dark' : 'light';

    const updateButtons = () => {
        const isDark = currentTheme === 'dark';

        document.querySelectorAll('.theme-toggle').forEach((button) => {
            const label = button.querySelector('.theme-label');
            const action = isDark ? 'Ativar modo claro' : 'Ativar modo escuro';

            button.setAttribute('aria-pressed', String(isDark));
            button.setAttribute('aria-label', action);
            button.title = action;

            if (label) {
                label.textContent = isDark ? 'Modo claro' : 'Modo escuro';
            }
        });
    };

    const applyTheme = (theme, persist = false) => {
        currentTheme = theme;
        root.dataset.theme = theme;
        root.style.colorScheme = theme;

        if (persist) {
            savedTheme = theme;
            try {
                localStorage.setItem(storageKey, theme);
            } catch {
                // O tema continua funcionando mesmo se o armazenamento estiver bloqueado.
            }
        }

        updateButtons();
    };

    applyTheme(currentTheme);

    document.addEventListener('DOMContentLoaded', () => {
        updateButtons();

        document.querySelectorAll('.theme-toggle').forEach((button) => {
            button.addEventListener('click', () => {
                applyTheme(currentTheme === 'dark' ? 'light' : 'dark', true);
            });
        });
    });

    const followSystemTheme = (event) => {
        if (savedTheme !== 'dark' && savedTheme !== 'light') {
            applyTheme(event.matches ? 'dark' : 'light');
        }
    };

    if (typeof systemPreference.addEventListener === 'function') {
        systemPreference.addEventListener('change', followSystemTheme);
    }
})();

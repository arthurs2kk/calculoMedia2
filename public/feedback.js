(() => {
    const widget = document.createElement('div');
    widget.className = 'feedback-widget';
    widget.innerHTML = `
        <button class="feedback-launcher" type="button" aria-expanded="false" aria-controls="feedback-panel">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 8h10M7 12h7M6 19l-3 2v-5.5A8 8 0 0 1 3 13V8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v5a5 5 0 0 1-5 5H8.5L6 19Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Avaliar</span>
        </button>
        <section class="feedback-panel" id="feedback-panel" hidden aria-labelledby="feedback-title">
            <div class="feedback-heading">
                <div>
                    <span class="feedback-kicker">Sua opinião</span>
                    <h2 id="feedback-title">Como foi usar a calculadora?</h2>
                </div>
                <button class="feedback-close" type="button" aria-label="Fechar avaliação">×</button>
            </div>
            <form class="feedback-form">
                <fieldset class="feedback-rating">
                    <legend>Dê uma nota</legend>
                    <div class="feedback-stars" role="radiogroup" aria-label="Nota de 1 a 5">
                        ${[1, 2, 3, 4, 5].map((value) => `
                            <input type="radio" name="rating" id="feedback-star-${value}" value="${value}" required>
                            <label for="feedback-star-${value}" title="${value} de 5"><span aria-hidden="true">★</span><span class="sr-only">${value} de 5</span></label>
                        `).join('')}
                    </div>
                </fieldset>
                <label class="feedback-message">
                    <span>Sugestão de melhoria <small>(opcional)</small></span>
                    <textarea name="message" maxlength="600" rows="4" placeholder="O que podemos melhorar?"></textarea>
                </label>
                <button class="feedback-submit" type="submit">Enviar avaliação</button>
                <p class="feedback-status" aria-live="polite"></p>
            </form>
        </section>
    `;

    document.body.appendChild(widget);

    const launcher = widget.querySelector('.feedback-launcher');
    const panel = widget.querySelector('.feedback-panel');
    const closeButton = widget.querySelector('.feedback-close');
    const form = widget.querySelector('.feedback-form');
    const status = widget.querySelector('.feedback-status');
    const submitButton = widget.querySelector('.feedback-submit');
    const ratingInputs = [...widget.querySelectorAll('input[name="rating"]')];
    const ratingLabels = [...widget.querySelectorAll('.feedback-stars label')];

    ratingInputs.forEach((input) => {
        input.addEventListener('change', () => {
            const selectedRating = Number(input.value);
            ratingLabels.forEach((label, index) => {
                label.classList.toggle('is-selected', index < selectedRating);
            });
        });
    });

    const setOpen = (open) => {
        panel.hidden = !open;
        launcher.setAttribute('aria-expanded', String(open));
        widget.classList.toggle('is-open', open);

        if (open) {
            panel.querySelector('input, textarea, button')?.focus();
        } else {
            launcher.focus();
        }
    };

    launcher.addEventListener('click', () => setOpen(panel.hidden));
    closeButton.addEventListener('click', () => setOpen(false));

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !panel.hidden) setOpen(false);
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const data = new FormData(form);
        const rating = Number(data.get('rating'));

        if (!rating) {
            status.textContent = 'Escolha uma nota de 1 a 5.';
            return;
        }

        submitButton.disabled = true;
        status.textContent = 'Enviando...';

        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rating,
                    message: String(data.get('message') || ''),
                    page: window.location.pathname,
                }),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Falha no envio');

            form.reset();
            ratingLabels.forEach((label) => label.classList.remove('is-selected'));
            status.textContent = 'Obrigado! Sua avaliação foi enviada.';
        } catch {
            status.textContent = 'Não foi possível enviar agora. Tente novamente.';
        } finally {
            submitButton.disabled = false;
        }
    });
})();

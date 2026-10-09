const pianoKeys = document.querySelectorAll('.piano-keys .key');
const volumeSlider = document.querySelector('#volume');
const keysCheckbox = document.querySelector('#show-keys');

const availableKeys = new Set(
    [...pianoKeys].map((key) => key.dataset.key)
);
const activeAudios = new Set();

function playTune(keyValue) {
    const key = String(keyValue).toLowerCase();
    if (!availableKeys.has(key)) return;

    const audio = new Audio(`assets/notes/${key}.wav`);
    audio.volume = Number(volumeSlider.value);
    activeAudios.add(audio);

    audio.addEventListener('ended', () => activeAudios.delete(audio), { once: true });
    audio.addEventListener('error', () => activeAudios.delete(audio), { once: true });

    const pressedKey = document.querySelector(`[data-key="${key}"]`);
    pressedKey.classList.add('active');

    window.setTimeout(() => pressedKey.classList.remove('active'), 140);

    audio.play().catch((error) => {
        console.error(`Não foi possível reproduzir a nota ${key}:`, error);
    });
}

pianoKeys.forEach((key) => {
    key.addEventListener('click', () => playTune(key.dataset.key));

    key.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            playTune(key.dataset.key);
        }
    });
});

document.addEventListener('keydown', (event) => {
    if (event.repeat || event.ctrlKey || event.altKey || event.metaKey) return;

    const key = event.key.toLowerCase();
    if (availableKeys.has(key) && !event.target.matches('textarea, input[type="text"]')) {
        event.preventDefault();
        playTune(key);
    }
});

volumeSlider.addEventListener('input', () => {
    const volume = Number(volumeSlider.value);
    activeAudios.forEach((audio) => {
        audio.volume = volume;
    });
});

keysCheckbox.addEventListener('change', () => {
    pianoKeys.forEach((key) => key.classList.toggle('hide', !keysCheckbox.checked));
});

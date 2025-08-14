export const Utilitise = {
  playIt: (whatToPlay, lang = 'fr-FR', onEndCb = null) => {
    const synth = new SpeechSynthesisUtterance(whatToPlay);
    const voices = speechSynthesis
        .getVoices()
        .filter(voice => voice.lang === lang);

    synth.lang = lang;
    synth.rate = lang === 'fr-FR' ? 0.9 : 1;
    synth.volume = 1;
    synth.voice = lang === 'fr-FR' ? voices[10] : voices.find(v => v.name === "Samantha");
    speechSynthesis.speak(synth);

    if (onEndCb) {
      synth.onend = onEndCb;
    }
  }
}

export function snakeCase(str) {
  console.log(`Converting to snake_case: ${str}`);
  return str
    .split('/')
    .map(part => part
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/\s+/g, '_')
      .replace(/-/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '')
      .replace(/^_+/, '') // Remove excessive initial underscores
      .toLowerCase()
    )
    .join('/');
}
/**
 * Ambient loops are synthesized procedurally via Web Audio: no external
 * audio files, so no licensing/sourcing concerns and nothing to download.
 */
export type AmbientTrack = "garage" | "rain";

interface ActiveAmbient {
  gain: GainNode;
  stop: () => void;
}

let ctx: AudioContext | null = null;
let active: ActiveAmbient | null = null;

function getContext(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function buildGarageHum(context: AudioContext, gain: GainNode): () => void {
  const osc1 = context.createOscillator();
  osc1.type = "sawtooth";
  osc1.frequency.value = 55;

  const osc2 = context.createOscillator();
  osc2.type = "sine";
  osc2.frequency.value = 82.5;

  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 320;

  const lfo = context.createOscillator();
  lfo.frequency.value = 0.15;
  const lfoGain = context.createGain();
  lfoGain.gain.value = 0.04;
  lfo.connect(lfoGain);
  lfoGain.connect(gain.gain);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);

  osc1.start();
  osc2.start();
  lfo.start();

  return () => {
    osc1.stop();
    osc2.stop();
    lfo.stop();
  };
}

function buildRain(context: AudioContext, gain: GainNode): () => void {
  const bufferSize = context.sampleRate * 2;
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = context.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;

  const highpass = context.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 900;

  const bandpass = context.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.value = 3200;
  bandpass.Q.value = 0.6;

  noise.connect(highpass);
  highpass.connect(bandpass);
  bandpass.connect(gain);

  noise.start();

  return () => noise.stop();
}

export function startAmbient(track: AmbientTrack, volume: number) {
  stopAmbient();
  const context = getContext();
  if (context.state === "suspended") void context.resume();

  const gain = context.createGain();
  gain.gain.value = volume;
  gain.connect(context.destination);

  const stopFn = track === "garage" ? buildGarageHum(context, gain) : buildRain(context, gain);

  active = {
    gain,
    stop: () => {
      stopFn();
      gain.disconnect();
    },
  };
}

export function stopAmbient() {
  active?.stop();
  active = null;
}

export function setAmbientVolume(volume: number) {
  if (active) active.gain.gain.value = volume;
}

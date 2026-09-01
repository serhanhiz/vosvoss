/**
 * Web Audio API based Sound Engine for Air-Cooled Boxer Engine & Vintage Klakson Horn
 */

class VosvosAudioEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private engineGain: GainNode | null = null;
  private engineOsc1: OscillatorNode | null = null;
  private engineOsc2: OscillatorNode | null = null;
  private engineFilter: BiquadFilterNode | null = null;
  private noiseNode: AudioNode | null = null;
  private noiseGain: GainNode | null = null;
  private currentRpm: number = 850;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Dual-tone vintage VW Beetle horn ("bip-biiip" / "meep-meep")
   */
  public playHorn(durationMs: number = 400) {
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const gain = this.ctx.createGain();
    gain.connect(this.ctx.destination);

    // Vintage dual tone frequencies (approx 370Hz and 440Hz with harmonics)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const oscHarmonic = this.ctx.createOscillator();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(370, now);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(440, now);

    oscHarmonic.type = 'sine';
    oscHarmonic.frequency.setValueAtTime(740, now);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);

    osc1.connect(filter);
    osc2.connect(filter);
    oscHarmonic.connect(filter);
    filter.connect(gain);

    // Envelope
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.03);
    gain.gain.setValueAtTime(0.35, now + (durationMs / 1000) - 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (durationMs / 1000));

    osc1.start(now);
    osc2.start(now);
    oscHarmonic.start(now);

    const stopTime = now + (durationMs / 1000) + 0.05;
    osc1.stop(stopTime);
    osc2.stop(stopTime);
    oscHarmonic.stop(stopTime);
  }

  /**
   * Click sound for switches (headlights, wipers, keys)
   */
  public playClick(pitch: number = 800) {
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(pitch, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  /**
   * Vintage starter motor crank sound
   */
  public playStarterCrank(callback?: () => void) {
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const duration = 0.8;

    // Cranking modulation
    const crankOsc = this.ctx.createOscillator();
    crankOsc.type = 'sawtooth';
    crankOsc.frequency.setValueAtTime(45, now);
    crankOsc.frequency.linearRampToValueAtTime(70, now + duration);

    const crankGain = this.ctx.createGain();
    crankGain.gain.setValueAtTime(0.15, now);
    crankGain.gain.linearRampToValueAtTime(0.3, now + duration - 0.1);
    crankGain.gain.linearRampToValueAtTime(0, now + duration);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, now);

    crankOsc.connect(filter);
    filter.connect(crankGain);
    crankGain.connect(this.ctx.destination);

    crankOsc.start(now);
    crankOsc.stop(now + duration);

    setTimeout(() => {
      if (callback) callback();
    }, duration * 1000);
  }

  /**
   * Start the continuous air-cooled boxer engine idle sound
   */
  public startEngine(initialRpm: number = 850) {
    this.initContext();
    if (!this.ctx || this.isRunning) return;

    this.isRunning = true;
    this.currentRpm = initialRpm;
    const now = this.ctx.currentTime;

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.01, now);
    masterGain.gain.linearRampToValueAtTime(0.25, now + 0.3);
    masterGain.connect(this.ctx.destination);
    this.engineGain = masterGain;

    // Filter to simulate muffled boxer exhaust
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, now);
    filter.connect(masterGain);
    this.engineFilter = filter;

    // Cylinder firing base frequency (RPM / 60 * cylinders/2)
    // At 900 RPM: 900/60 * 2 = 30 Hz fundamental
    const baseFreq = (initialRpm / 60) * 2;

    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(baseFreq, now);

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(baseFreq * 0.5, now); // deep sub pulse

    osc1.connect(filter);
    osc2.connect(filter);

    osc1.start(now);
    osc2.start(now);

    this.engineOsc1 = osc1;
    this.engineOsc2 = osc2;

    // Add slight air-cooling fan noise buffer
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(450, now);
      noiseFilter.Q.setValueAtTime(3.0, now);

      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.04, now);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(nGain);
      nGain.connect(masterGain);

      whiteNoise.start(now);
      this.noiseNode = whiteNoise;
      this.noiseGain = nGain;
    } catch {
      // safe fallback if buffer fails
    }
  }

  /**
   * Set engine RPM (800 - 4500 RPM)
   */
  public setRpm(rpm: number) {
    this.currentRpm = Math.max(800, Math.min(4800, rpm));
    if (!this.ctx || !this.isRunning || !this.engineOsc1 || !this.engineOsc2) return;

    const now = this.ctx.currentTime;
    const baseFreq = (this.currentRpm / 60) * 2;
    const filterFreq = 260 + (this.currentRpm - 800) * 0.45;

    this.engineOsc1.frequency.setTargetAtTime(baseFreq, now, 0.08);
    this.engineOsc2.frequency.setTargetAtTime(baseFreq * 0.5, now, 0.08);

    if (this.engineFilter) {
      this.engineFilter.frequency.setTargetAtTime(filterFreq, now, 0.08);
    }
    if (this.noiseGain) {
      const fanGain = 0.03 + ((this.currentRpm - 800) / 4000) * 0.08;
      this.noiseGain.gain.setTargetAtTime(fanGain, now, 0.08);
    }
  }

  /**
   * Stop the engine
   */
  public stopEngine() {
    if (!this.ctx || !this.isRunning) return;

    const now = this.ctx.currentTime;
    if (this.engineGain) {
      this.engineGain.gain.linearRampToValueAtTime(0.001, now + 0.4);
    }

    setTimeout(() => {
      try {
        this.engineOsc1?.stop();
        this.engineOsc2?.stop();
        if (this.noiseNode && 'stop' in this.noiseNode) {
          (this.noiseNode as AudioBufferSourceNode).stop();
        }
      } catch {
        // already stopped
      }
      this.isRunning = false;
      this.engineGain = null;
      this.engineOsc1 = null;
      this.engineOsc2 = null;
      this.engineFilter = null;
    }, 450);
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }

  public getCurrentRpm(): number {
    return this.currentRpm;
  }
}

export const audioEngine = new VosvosAudioEngine();

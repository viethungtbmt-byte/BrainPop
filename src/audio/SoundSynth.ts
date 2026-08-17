interface JingleNote {
  note: number;
  start: number;
  dur: number;
}

const MELODY_NOTES: JingleNote[] = [
  // Phrase 1
  { note: 76, start: 0, dur: 1 },  // E5
  { note: 76, start: 1, dur: 1 },  // E5
  { note: 76, start: 2, dur: 2 },  // E5
  { note: 76, start: 4, dur: 1 },  // E5
  { note: 76, start: 5, dur: 1 },  // E5
  { note: 76, start: 6, dur: 2 },  // E5
  { note: 76, start: 8, dur: 1 },  // E5
  { note: 79, start: 9, dur: 1 },  // G5
  { note: 72, start: 10, dur: 1.5 }, // C5
  { note: 74, start: 11.5, dur: 0.5 }, // D5
  { note: 76, start: 12, dur: 4 },  // E5

  // Phrase 2
  { note: 77, start: 16, dur: 1 },  // F5
  { note: 77, start: 17, dur: 1 },  // F5
  { note: 77, start: 18, dur: 1.5 }, // F5
  { note: 77, start: 19.5, dur: 0.5 }, // F5
  { note: 77, start: 20, dur: 1 },  // F5
  { note: 76, start: 21, dur: 1 },  // E5
  { note: 76, start: 22, dur: 1.5 }, // E5
  { note: 76, start: 23.5, dur: 0.5 }, // E5
  { note: 76, start: 24, dur: 1 },  // E5
  { note: 74, start: 25, dur: 1 },  // D5
  { note: 74, start: 26, dur: 1 },  // D5
  { note: 76, start: 27, dur: 1 },  // E5
  { note: 74, start: 28, dur: 2 },  // D5
  { note: 79, start: 30, dur: 2 },  // G5

  // Phrase 3
  { note: 76, start: 32, dur: 1 },  // E5
  { note: 76, start: 33, dur: 1 },  // E5
  { note: 76, start: 34, dur: 2 },  // E5
  { note: 76, start: 36, dur: 1 },  // E5
  { note: 76, start: 37, dur: 1 },  // E5
  { note: 76, start: 38, dur: 2 },  // E5
  { note: 76, start: 40, dur: 1 },  // E5
  { note: 79, start: 41, dur: 1 },  // G5
  { note: 72, start: 42, dur: 1.5 }, // C5
  { note: 74, start: 43.5, dur: 0.5 }, // D5
  { note: 76, start: 44, dur: 4 },  // E5

  // Phrase 4
  { note: 77, start: 48, dur: 1 },  // F5
  { note: 77, start: 49, dur: 1 },  // F5
  { note: 77, start: 50, dur: 1.5 }, // F5
  { note: 77, start: 51.5, dur: 0.5 }, // F5
  { note: 77, start: 52, dur: 1 },  // F5
  { note: 76, start: 53, dur: 1 },  // E5
  { note: 76, start: 54, dur: 1.5 }, // E5
  { note: 76, start: 55.5, dur: 0.5 }, // E5
  { note: 79, start: 56, dur: 1 },  // G5
  { note: 79, start: 57, dur: 1 },  // G5
  { note: 77, start: 58, dur: 1 },  // F5
  { note: 74, start: 59, dur: 1 },  // D5
  { note: 72, start: 60, dur: 4 }   // C5
];

const ACCOMPANIMENT_NOTES: JingleNote[] = [
  // Measure 1
  { note: 48, start: 0, dur: 2 },  // C3
  { note: 55, start: 2, dur: 2 },  // G3
  // Measure 2
  { note: 48, start: 4, dur: 2 },  // C3
  { note: 55, start: 6, dur: 2 },  // G3
  // Measure 3
  { note: 48, start: 8, dur: 2 },  // C3
  { note: 52, start: 10, dur: 2 }, // E3
  // Measure 4
  { note: 55, start: 12, dur: 4 }, // G3

  // Measure 5
  { note: 41, start: 16, dur: 2 }, // F3
  { note: 48, start: 18, dur: 2 }, // C3
  // Measure 6
  { note: 48, start: 20, dur: 2 }, // C3
  { note: 43, start: 22, dur: 2 }, // G2
  // Measure 7
  { note: 50, start: 24, dur: 2 }, // D3
  { note: 54, start: 26, dur: 2 }, // F#3
  // Measure 8
  { note: 55, start: 28, dur: 4 }, // G3

  // Measure 9
  { note: 48, start: 32, dur: 2 }, // C3
  { note: 55, start: 34, dur: 2 }, // G3
  // Measure 10
  { note: 48, start: 36, dur: 2 }, // C3
  { note: 55, start: 38, dur: 2 }, // G3
  // Measure 11
  { note: 48, start: 40, dur: 2 }, // C3
  { note: 52, start: 42, dur: 2 }, // E3
  // Measure 12
  { note: 55, start: 44, dur: 4 }, // G3

  // Measure 13
  { note: 41, start: 48, dur: 2 }, // F3
  { note: 48, start: 50, dur: 2 }, // C3
  // Measure 14
  { note: 48, start: 52, dur: 2 }, // C3
  { note: 43, start: 54, dur: 2 }, // G2
  // Measure 15
  { note: 55, start: 56, dur: 2 }, // G3
  { note: 59, start: 58, dur: 2 }, // B3
  // Measure 16
  { note: 48, start: 60, dur: 4 }  // C3
];

const WELLERMAN_MELODY: JingleNote[] = [
  // Verse Phrase 1: "There once was a ship that put to sea"
  { note: 69, start: 0, dur: 0.8 },   // A4
  { note: 69, start: 1, dur: 0.8 },   // A4
  { note: 69, start: 2, dur: 0.8 },   // A4
  { note: 72, start: 3, dur: 0.8 },   // C5
  { note: 76, start: 4, dur: 0.8 },   // E5
  { note: 76, start: 5, dur: 0.8 },   // E5
  { note: 76, start: 6, dur: 1.6 },   // E5

  // Verse Phrase 2: "And the name of the ship was the Billy of Tea"
  { note: 76, start: 8, dur: 0.8 },   // E5
  { note: 74, start: 9, dur: 0.8 },   // D5
  { note: 72, start: 10, dur: 0.8 },  // C5
  { note: 71, start: 11, dur: 0.8 },  // B4
  { note: 69, start: 12, dur: 0.8 },  // A4
  { note: 69, start: 13, dur: 0.8 },  // A4
  { note: 67, start: 14, dur: 0.8 },  // G4
  { note: 69, start: 15, dur: 1.6 },  // A4

  // Verse Phrase 3: "The winds blew up, her bow dipped down"
  { note: 69, start: 16, dur: 0.8 },  // A4
  { note: 69, start: 17, dur: 0.8 },  // A4
  { note: 69, start: 18, dur: 0.8 },  // A4
  { note: 72, start: 19, dur: 0.8 },  // C5
  { note: 76, start: 20, dur: 0.8 },  // E5
  { note: 76, start: 21, dur: 0.8 },  // E5
  { note: 76, start: 22, dur: 1.6 },  // E5

  // Verse Phrase 4: "O blow, my bully boys, blow"
  { note: 76, start: 24, dur: 0.8 },  // E5
  { note: 74, start: 25, dur: 0.8 },  // D5
  { note: 72, start: 26, dur: 0.8 },  // C5
  { note: 71, start: 27, dur: 0.8 },  // B4
  { note: 69, start: 28, dur: 3.2 },  // A4

  // Chorus Phrase 1: "Soon may the Wellerman come"
  { note: 77, start: 32, dur: 0.8 },  // F5
  { note: 77, start: 33, dur: 0.8 },  // F5
  { note: 76, start: 34, dur: 0.8 },  // E5
  { note: 74, start: 35, dur: 0.8 },  // D5
  { note: 76, start: 36, dur: 0.8 },  // E5
  { note: 76, start: 37, dur: 0.8 },  // E5
  { note: 72, start: 38, dur: 1.6 },  // C5

  // Chorus Phrase 2: "To bring us sugar and tea and rum"
  { note: 76, start: 40, dur: 0.8 },  // E5
  { note: 74, start: 41, dur: 0.8 },  // D5
  { note: 72, start: 42, dur: 0.8 },  // C5
  { note: 71, start: 43, dur: 0.8 },  // B4
  { note: 69, start: 44, dur: 0.8 },  // A4
  { note: 69, start: 45, dur: 0.8 },  // A4
  { note: 67, start: 46, dur: 0.8 },  // G4
  { note: 69, start: 47, dur: 1.6 },  // A4

  // Chorus Phrase 3: "One day, when the tonguing is done"
  { note: 77, start: 48, dur: 0.8 },  // F5
  { note: 77, start: 49, dur: 0.8 },  // F5
  { note: 76, start: 50, dur: 0.8 },  // E5
  { note: 74, start: 51, dur: 0.8 },  // D5
  { note: 76, start: 52, dur: 0.8 },  // E5
  { note: 76, start: 53, dur: 0.8 },  // E5
  { note: 72, start: 54, dur: 1.6 },  // C5

  // Chorus Phrase 4: "We'll take our leave and go"
  { note: 76, start: 56, dur: 0.8 },  // E5
  { note: 74, start: 57, dur: 0.8 },  // D5
  { note: 72, start: 58, dur: 0.8 },  // C5
  { note: 71, start: 59, dur: 0.8 },  // B4
  { note: 69, start: 60, dur: 3.6 }   // A4
];

const WELLERMAN_BASS: JingleNote[] = [
  // Verse Phrase 1 (Am)
  { note: 45, start: 0, dur: 1.8 },   // A2
  { note: 57, start: 2, dur: 1.8 },   // A3
  { note: 45, start: 4, dur: 1.8 },   // A2
  { note: 57, start: 6, dur: 1.8 },   // A3

  // Verse Phrase 2 (Em - Am)
  { note: 52, start: 8, dur: 1.8 },   // E3
  { note: 47, start: 10, dur: 1.8 },  // B2
  { note: 45, start: 12, dur: 1.8 },  // A2
  { note: 57, start: 14, dur: 1.8 },  // A3

  // Verse Phrase 3 (Am)
  { note: 45, start: 16, dur: 1.8 },  // A2
  { note: 57, start: 18, dur: 1.8 },  // A3
  { note: 45, start: 20, dur: 1.8 },  // A2
  { note: 57, start: 22, dur: 1.8 },  // A3

  // Verse Phrase 4 (Em - Am)
  { note: 52, start: 24, dur: 1.8 },  // E3
  { note: 47, start: 26, dur: 1.8 },  // B2
  { note: 45, start: 28, dur: 3.6 },  // A2

  // Chorus Phrase 1 (F - C - Am)
  { note: 41, start: 32, dur: 1.8 },  // F2
  { note: 48, start: 34, dur: 1.8 },  // C3
  { note: 45, start: 36, dur: 1.8 },  // A2
  { note: 52, start: 38, dur: 1.8 },  // E3

  // Chorus Phrase 2 (Em - Am)
  { note: 52, start: 40, dur: 1.8 },  // E3
  { note: 47, start: 42, dur: 1.8 },  // B2
  { note: 45, start: 44, dur: 1.8 },  // A2
  { note: 57, start: 46, dur: 1.8 },  // A3

  // Chorus Phrase 3 (F - C - Am)
  { note: 41, start: 48, dur: 1.8 },  // F2
  { note: 48, start: 50, dur: 1.8 },  // C3
  { note: 45, start: 52, dur: 1.8 },  // A2
  { note: 52, start: 54, dur: 1.8 },  // E3

  // Chorus Phrase 4 (Em - Am)
  { note: 52, start: 56, dur: 1.8 },  // E3
  { note: 47, start: 58, dur: 1.8 },  // B2
  { note: 45, start: 60, dur: 3.6 }   // A2
];

export class SoundSynth {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  private musicInterval: any = null;
  private currentMusicId: string | null = null;
  private activeMusicNodes: any[] = [];
  private preAdEnabledState: boolean = true;

  constructor() {}

  /**
   * Mute all game audio immediately during commercial / rewarded ad breaks
   */
  muteForAd(): void {
    this.preAdEnabledState = this.enabled;
    this.enabled = false;
    if (this.ctx && this.ctx.state === "running") {
      this.ctx.suspend().catch(() => {});
    }
  }

  /**
   * Restore game audio state after commercial / rewarded ad finishes or fails
   */
  unmuteAfterAd(): void {
    this.enabled = this.preAdEnabledState;
    if (this.enabled && this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  // Background Ambient Music Generator
  playMusic(trackId: string) {
    if (!this.enabled) {
      this.stopMusic();
      return;
    }
    
    this.init();
    if (!this.ctx) return;
    
    // If already playing this track, don't restart it
    if (this.currentMusicId === trackId) return;
    
    this.stopMusic();
    this.currentMusicId = trackId;

    if (trackId === 'music_none') {
      return;
    }

    const now = this.ctx.currentTime;

    // Set up continuous ambient synthesizer paths
    if (trackId === 'music_ocean_breeze') {
      try {
        const bufferSize = this.ctx.sampleRate * 4;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noiseSource = this.ctx.createBufferSource();
        noiseSource.buffer = buffer;
        noiseSource.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(350, now);
        filter.Q.setValueAtTime(1.5, now);

        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(0.025, now);

        noiseSource.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        noiseSource.start(now);
        this.activeMusicNodes.push(noiseSource);

        // Slow wave cycle LFO
        const lfo = this.ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.08, now); // ~12s wave period
        lfo.type = "sine";

        const lfoFilterGain = this.ctx.createGain();
        lfoFilterGain.gain.setValueAtTime(220, now);
        lfo.connect(lfoFilterGain);
        lfoFilterGain.connect(filter.frequency);

        const lfoVolumeGain = this.ctx.createGain();
        lfoVolumeGain.gain.setValueAtTime(0.015, now);
        lfo.connect(lfoVolumeGain);
        lfoVolumeGain.connect(gainNode.gain);

        lfo.start(now);
        this.activeMusicNodes.push(lfo);
      } catch (err) {
        console.error("Ocean Breeze init error", err);
      }
    } else if (trackId === 'music_cozy_rain') {
      try {
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noiseSource = this.ctx.createBufferSource();
        noiseSource.buffer = buffer;
        noiseSource.loop = true;

        const rainFilter = this.ctx.createBiquadFilter();
        rainFilter.type = "bandpass";
        rainFilter.frequency.setValueAtTime(1200, now);
        rainFilter.Q.setValueAtTime(0.8, now);

        const rainGain = this.ctx.createGain();
        rainGain.gain.setValueAtTime(0.012, now);

        noiseSource.connect(rainFilter);
        rainFilter.connect(rainGain);
        rainGain.connect(this.ctx.destination);

        noiseSource.start(now);
        this.activeMusicNodes.push(noiseSource);

        const rainLfo = this.ctx.createOscillator();
        rainLfo.frequency.setValueAtTime(0.15, now);
        rainLfo.type = "sine";

        const rainLfoGain = this.ctx.createGain();
        rainLfoGain.gain.setValueAtTime(0.003, now);

        rainLfo.connect(rainLfoGain);
        rainLfoGain.connect(rainGain.gain);

        rainLfo.start(now);
        this.activeMusicNodes.push(rainLfo);
      } catch (err) {
        console.error("Cozy Rain init error", err);
      }
    } else if (trackId === 'music_wellerman') {
      try {
        const bufferSize = this.ctx.sampleRate * 4;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noiseSource = this.ctx.createBufferSource();
        noiseSource.buffer = buffer;
        noiseSource.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(250, now);
        filter.Q.setValueAtTime(1.0, now);

        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(0.008, now);

        noiseSource.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        noiseSource.start(now);
        this.activeMusicNodes.push(noiseSource);
      } catch (err) {
        console.error("Wellerman ocean background error", err);
      }
    }
    
    let step = 0;
    let songStartTime: number | null = null;
    let lastScheduledBeat = -1;
    
    const tick = () => {
      if (!this.enabled || !this.ctx || this.currentMusicId !== trackId) {
        this.stopMusic();
        return;
      }
      
      // Prevent scheduling notes if audio context is suspended
      if (this.ctx.state === 'suspended') return;
      
      const now = this.ctx.currentTime;
      
      try {
        switch (trackId) {
          case 'music_relaxing_piano': {
            if (songStartTime === null) {
              songStartTime = now;
            }

            const beatDuration = 0.45; // seconds per beat (~133 BPM)
            const totalBeats = 64;
            
            let windowStartBeat = lastScheduledBeat;
            if (windowStartBeat < 0) {
              windowStartBeat = (now - songStartTime) / beatDuration;
            }
            const windowEndBeat = (now + 1.55 - songStartTime) / beatDuration;

            const playPianoNote = (midi: number, startTime: number, noteDuration: number, maxVol: number) => {
              if (!this.ctx) return;
              const freq = 440 * Math.pow(2, (midi - 69) / 12);
              
              const osc1 = this.ctx.createOscillator();
              const osc2 = this.ctx.createOscillator();
              const gain = this.ctx.createGain();
              
              osc1.type = "sine";
              osc1.frequency.setValueAtTime(freq, startTime);
              
              osc2.type = "triangle";
              osc2.frequency.setValueAtTime(freq * 2, startTime);
              
              // Piano envelope: rapid attack, gentle exponential decay
              gain.gain.setValueAtTime(0, startTime);
              gain.gain.linearRampToValueAtTime(maxVol, startTime + 0.03);
              gain.gain.exponentialRampToValueAtTime(0.0001, startTime + noteDuration);
              
              // Mix: 80% fundamental, 20% second harmonic
              const osc1Gain = this.ctx.createGain();
              osc1Gain.gain.setValueAtTime(0.8, startTime);
              const osc2Gain = this.ctx.createGain();
              osc2Gain.gain.setValueAtTime(0.2, startTime);
              
              osc1.connect(osc1Gain);
              osc1Gain.connect(gain);
              
              osc2.connect(osc2Gain);
              osc2Gain.connect(gain);
              
              gain.connect(this.ctx.destination);
              
              osc1.start(startTime);
              osc2.start(startTime);
              
              osc1.stop(startTime + noteDuration + 0.1);
              osc2.stop(startTime + noteDuration + 0.1);
            };

            const startLoop = Math.floor(windowStartBeat / totalBeats);
            const endLoop = Math.floor(windowEndBeat / totalBeats);

            for (let loop = startLoop; loop <= endLoop; loop++) {
              // Melody Notes
              for (const n of MELODY_NOTES) {
                const absStartBeat = loop * totalBeats + n.start;
                if (absStartBeat >= windowStartBeat && absStartBeat < windowEndBeat) {
                  const noteTime = songStartTime + absStartBeat * beatDuration;
                  const noteDuration = n.dur * beatDuration;
                  playPianoNote(n.note, noteTime, noteDuration, 0.012); // soft melody volume
                }
              }
              // Accompaniment Notes
              for (const n of ACCOMPANIMENT_NOTES) {
                const absStartBeat = loop * totalBeats + n.start;
                if (absStartBeat >= windowStartBeat && absStartBeat < windowEndBeat) {
                  const noteTime = songStartTime + absStartBeat * beatDuration;
                  const noteDuration = n.dur * beatDuration;
                  playPianoNote(n.note, noteTime, noteDuration, 0.005); // softer accompaniment volume
                }
              }
            }

            lastScheduledBeat = windowEndBeat;
            break;
          }

          case 'music_cozy_rain': {
            // Schedule individual raindrop taps on top of the backdrop rain noise
            const scheduleRaindrop = (t: number) => {
              if (!this.ctx) return;
              const osc = this.ctx.createOscillator();
              const gain = this.ctx.createGain();
              
              const freq = 1500 + Math.random() * 2000;
              osc.type = "sine";
              osc.frequency.setValueAtTime(freq, t);
              
              gain.gain.setValueAtTime(0, t);
              gain.gain.linearRampToValueAtTime(0.005 + Math.random() * 0.01, t + 0.002);
              gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03 + Math.random() * 0.04);
              
              osc.connect(gain);
              gain.connect(this.ctx.destination);
              
              osc.start(t);
              osc.stop(t + 0.1);
            };

            const count = 15 + Math.floor(Math.random() * 10);
            for (let i = 0; i < count; i++) {
              const raindropTime = now + Math.random() * 1.5;
              scheduleRaindrop(raindropTime);
            }
            break;
          }

          case 'music_wellerman': {
            if (songStartTime === null) {
              songStartTime = now;
            }

            const beatDuration = 0.38; // ~158 BPM lively sea shanty tempo
            const totalBeats = 64;

            let windowStartBeat = lastScheduledBeat;
            if (windowStartBeat < 0) {
              windowStartBeat = (now - songStartTime) / beatDuration;
            }
            const windowEndBeat = (now + 1.55 - songStartTime) / beatDuration;

            const playAccordionNote = (midi: number, startTime: number, noteDuration: number, maxVol: number) => {
              if (!this.ctx) return;
              const freq = 440 * Math.pow(2, (midi - 69) / 12);

              const osc1 = this.ctx.createOscillator();
              const osc2 = this.ctx.createOscillator();
              const filter = this.ctx.createBiquadFilter();
              const gain = this.ctx.createGain();

              osc1.type = "sawtooth";
              osc1.frequency.setValueAtTime(freq, startTime);

              osc2.type = "triangle";
              osc2.frequency.setValueAtTime(freq * 1.002, startTime); // detuned for accordion effect

              filter.type = "lowpass";
              filter.frequency.setValueAtTime(1400, startTime);

              const osc1Gain = this.ctx.createGain();
              osc1Gain.gain.setValueAtTime(0.7, startTime);
              const osc2Gain = this.ctx.createGain();
              osc2Gain.gain.setValueAtTime(0.3, startTime);

              osc1.connect(osc1Gain);
              osc1Gain.connect(filter);
              osc2.connect(osc2Gain);
              osc2Gain.connect(filter);

              filter.connect(gain);
              gain.connect(this.ctx.destination);

              gain.gain.setValueAtTime(0, startTime);
              gain.gain.linearRampToValueAtTime(maxVol, startTime + 0.02);
              gain.gain.setValueAtTime(maxVol * 0.8, startTime + Math.max(0.03, noteDuration - 0.03));
              gain.gain.exponentialRampToValueAtTime(0.0001, startTime + noteDuration + 0.08);

              osc1.start(startTime);
              osc2.start(startTime);

              osc1.stop(startTime + noteDuration + 0.1);
              osc2.stop(startTime + noteDuration + 0.1);
            };

            const playSeaStomp = (startTime: number) => {
              if (!this.ctx) return;
              const osc = this.ctx.createOscillator();
              const gain = this.ctx.createGain();

              osc.type = "sine";
              osc.frequency.setValueAtTime(110, startTime);
              osc.frequency.exponentialRampToValueAtTime(30, startTime + 0.08);

              gain.gain.setValueAtTime(0.01, startTime);
              gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.09);

              osc.connect(gain);
              gain.connect(this.ctx.destination);

              osc.start(startTime);
              osc.stop(startTime + 0.1);
            };

            const startLoop = Math.floor(windowStartBeat / totalBeats);
            const endLoop = Math.floor(windowEndBeat / totalBeats);

            for (let loop = startLoop; loop <= endLoop; loop++) {
              // Melody Notes
              for (const n of WELLERMAN_MELODY) {
                const absStartBeat = loop * totalBeats + n.start;
                if (absStartBeat >= windowStartBeat && absStartBeat < windowEndBeat) {
                  const noteTime = songStartTime + absStartBeat * beatDuration;
                  const noteDuration = n.dur * beatDuration;
                  playAccordionNote(n.note, noteTime, noteDuration, 0.015);
                }
              }
              // Bass Notes
              for (const n of WELLERMAN_BASS) {
                const absStartBeat = loop * totalBeats + n.start;
                if (absStartBeat >= windowStartBeat && absStartBeat < windowEndBeat) {
                  const noteTime = songStartTime + absStartBeat * beatDuration;
                  const noteDuration = n.dur * beatDuration;
                  playAccordionNote(n.note, noteTime, noteDuration, 0.008);
                }
              }
              // Stomp on even beats
              for (let b = 0; b < totalBeats; b += 2) {
                const absStartBeat = loop * totalBeats + b;
                if (absStartBeat >= windowStartBeat && absStartBeat < windowEndBeat) {
                  const noteTime = songStartTime + absStartBeat * beatDuration;
                  playSeaStomp(noteTime);
                }
              }
            }

            lastScheduledBeat = windowEndBeat;
            break;
          }
        }
      } catch (err) {
        console.error("Music generation error", err);
      }
      
      step++;
    };
    
    this.musicInterval = setInterval(tick, 1500);
    tick();
  }

  stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.activeMusicNodes) {
      this.activeMusicNodes.forEach(node => {
        try {
          node.stop();
        } catch (e) {}
        try {
          node.disconnect();
        } catch (e) {}
      });
      this.activeMusicNodes = [];
    }
    this.currentMusicId = null;
  }

  private init() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
    } catch (e) {
      console.warn("SoundSynth init error:", e);
    }
  }

  // Soft tactile card click / flip sound
  playSelect() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      
      osc.type = "triangle"; // warmer/softer than pure sine or harsh square
      osc.frequency.setValueAtTime(220, this.ctx.currentTime); // Low sweet note
      osc.frequency.exponentialRampToValueAtTime(330, this.ctx.currentTime + 0.05); // Slight rise
      
      // Softer attack (not 0 instantly) and quick decay
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06); // 40-70ms duration
      
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, this.ctx.currentTime); // filter out high clicks/harshness
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.065);
    } catch (e) {
      console.warn("playSelect error:", e);
    }
  }

  playConnect() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
    osc.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.08); // E5

    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  // Brighter and more rewarding successful match sound
  playSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    // Harmonious major ascending chord (G5, C6, E6, G6) played closely
    const notes = [783.99, 1046.50, 1318.51, 1567.98];
    const delayStep = 0.035;

    notes.forEach((freq, index) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();
      const startTime = this.ctx!.currentTime + index * delayStep;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      // Sweet and clean amplitude envelope (~180-250ms)
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.06, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2000, startTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.13);
    });
  }

  // Short descending tone, softer, non-annoying mismatch sound (~120ms)
  playFailure() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(260, this.ctx.currentTime); 
    osc.frequency.linearRampToValueAtTime(150, this.ctx.currentTime + 0.12); // Smooth descending slide

    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(600, this.ctx.currentTime);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.13);
  }

  // Combo Sound System
  playCombo(level: number) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    if (level === 2) {
      // Combo x2 - Bright ping
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, this.ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(1760, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } 
    else if (level === 3) {
      // Combo x3 - Slightly higher pitch ping
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1046.50, this.ctx.currentTime); // C6
      osc.frequency.exponentialRampToValueAtTime(2093.00, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.14, this.ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.22);
    } 
    else if (level === 4) {
      // Combo x4 - Richer harmony (C6, E6, G6, C7 arpeggio)
      const notes = [1046.50, 1318.51, 1567.98, 2093.00];
      notes.forEach((freq, index) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const startTime = this.ctx!.currentTime + index * 0.025;

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.07, startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.16);
      });
    } 
    else {
      // Combo x5+ - Small excited fanfare (C5 to G6 run)
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
      notes.forEach((freq, index) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const startTime = this.ctx!.currentTime + index * 0.03;

        osc.type = index === notes.length - 1 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.06, startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.2);
      });
    }
  }

  // High Score Celebration Sound (~400-600ms happy ascending melody)
  playHighScore() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const melody = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00]; // C5 to C7
      melody.forEach((freq, index) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const startTime = this.ctx!.currentTime + index * 0.055;

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);
        
        if (index === melody.length - 1) {
          // Vibrato & long sustain for the peak milestone note
          osc.frequency.linearRampToValueAtTime(freq + 15, startTime + 0.22);
          gain.gain.setValueAtTime(0.001, startTime);
          gain.gain.linearRampToValueAtTime(0.12, startTime + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.38);
        } else {
          gain.gain.setValueAtTime(0.001, startTime);
          gain.gain.linearRampToValueAtTime(0.08, startTime + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);
        }

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.4);
      });
    } catch (e) {
      console.warn("playHighScore error:", e);
    }
  }

  // Heroic, simple, short brassy fanfare (~500ms)
  playRankUp() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const notes = [392.00, 523.25, 659.25, 783.99, 1046.50]; // G4, C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const filter = this.ctx!.createBiquadFilter();
        const startTime = this.ctx!.currentTime + index * 0.07;

        osc.type = "triangle"; // brass/heroic character
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.1, startTime + 0.015);
        
        if (index === notes.length - 1) {
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
        } else {
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);
        }

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1200, startTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + (index === notes.length - 1 ? 0.35 : 0.18));
      });
    } catch (e) {
      console.warn("playRankUp error:", e);
    }
  }

  // Optimistic Victory Jingle (~700-900ms)
  playVictory() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const melody = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50]; // C5 to C6
    const step = 0.085;

    melody.forEach((freq, index) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const startTime = this.ctx!.currentTime + index * step;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.08, startTime + 0.01);
      
      if (index === melody.length - 1) {
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);
      } else {
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);
      }

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + (index === melody.length - 1 ? 0.5 : 0.22));
    });

    // Rich sustained major third/fifth on final note
    const chord = [1318.51, 1567.98]; // E6, G6
    const chordStartTime = this.ctx.currentTime + (melody.length - 1) * step;
    chord.forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, chordStartTime);

      gain.gain.setValueAtTime(0.001, chordStartTime);
      gain.gain.linearRampToValueAtTime(0.05, chordStartTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, chordStartTime + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(chordStartTime);
      osc.stop(chordStartTime + 0.5);
    });
  }

  // Soft click downward for Pausing
  playPause() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(350, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.11);
  }

  // Soft click upward for Resuming
  playResume() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(350, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.11);
  }

  // Primary buttons (Solid resonant UI click)
  playPrimary() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(783.99, this.ctx.currentTime + 0.06); // rise to G5

    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1500, this.ctx.currentTime);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  // Secondary buttons (Shorter, softer, lower click)
  playSecondary() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(329.63, this.ctx.currentTime); // E4
    osc.frequency.exponentialRampToValueAtTime(440.00, this.ctx.currentTime + 0.05); // rise to A4

    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // Close dialog (Quick descending double-tap click)
  playClose() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const times = [0, 0.04];
    const notes = [659.25, 523.25]; // E5, then C5

    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const startTime = this.ctx!.currentTime + times[idx];

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.07, startTime + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.06);
    });
  }

  // Confirm dialog (Cheerful quick rising dual-tone chime)
  playConfirm() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const notes = [783.99, 1046.50]; // G5 to C6
      notes.forEach((freq, index) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const startTime = this.ctx!.currentTime + index * 0.04;

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.1, startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.14);
      });
    } catch (e) {
      console.warn("playConfirm error:", e);
    }
  }
}

export const synth = new SoundSynth();

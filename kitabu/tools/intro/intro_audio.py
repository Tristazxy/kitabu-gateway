"""Sound for the intro (demo-out/intro-audio.wav, 8 s, 48 kHz stereo): three snores, a bubble pop, a yawn,
a soft chime under the title. Timed to tools/intro/intro.html.

With ELEVENLABS_API_KEY the effects come from the ElevenLabs sound-effects API; otherwise they are
synthesised here (numpy), which sounds cartoonish but keeps the pipeline self-contained.
"""
import io
import json
import os
import subprocess
import sys
import urllib.request
import wave

import numpy as np

SR = 48000
DURATION = 8.0
SNORES = [0.3, 1.7, 3.1]
POP = 4.5
YAWN = 4.9
CHIME = 6.6
OUT = os.path.join('demo-out', 'intro-audio.wav')


def env(n, a=0.02, r=0.1):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] = np.linspace(1, 0, nr)
    return e


def lowpass(x, cutoff):
    # one-pole IIR, applied twice
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.zeros_like(x)
    for _ in range(2):
        acc = 0.0
        for i in range(len(x)):
            acc = (1 - a) * x[i] + a * acc
            y[i] = acc
        x = y.copy()
    return y


def synth_snore(rng):
    """1.25 s: a rough inhale rumble (pulse train + noise) then a soft exhale hiss."""
    n_in, n_out = int(0.75 * SR), int(0.5 * SR)
    t = np.arange(n_in) / SR
    f0 = 62 + 18 * np.sin(np.pi * t / 0.75)
    phase = np.cumsum(f0) / SR
    pulses = (np.sin(2 * np.pi * phase) > 0.97).astype(float)
    rumble = lowpass(pulses * 4 + rng.standard_normal(n_in) * 0.35, 900)
    inhale = rumble * env(n_in, 0.08, 0.12) * (0.6 + 0.4 * np.sin(2 * np.pi * 27 * t) ** 2)
    hiss = lowpass(rng.standard_normal(n_out), 1800) * env(n_out, 0.05, 0.25) * 0.18
    return np.concatenate([inhale * 0.9, hiss])


def synth_pop(rng):
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    sweep = np.sin(2 * np.pi * (900 * np.exp(-t * 40)) * t) * np.exp(-t * 55)
    click = lowpass(rng.standard_normal(n), 4000) * np.exp(-t * 90) * 0.8
    return (sweep + click) * 0.9


def synth_yawn():
    """1.5 s 'aaah': a gliding harmonic voice through two formant-like resonances."""
    n = int(1.5 * SR)
    t = np.arange(n) / SR
    f0 = 170 - 60 * t / 1.5 + 12 * np.sin(2 * np.pi * 5.5 * t)
    phase = np.cumsum(f0) / SR
    voice = sum(np.sin(2 * np.pi * k * phase) / k for k in range(1, 12))
    # crude formants: emphasise 650 Hz and 1100 Hz bands by mixing lowpassed copies
    f1 = lowpass(voice, 800) - lowpass(voice, 500)
    f2 = lowpass(voice, 1300) - lowpass(voice, 950)
    out = (f1 * 1.6 + f2 * 0.9 + voice * 0.15)
    e = env(n, 0.25, 0.45) * (0.75 + 0.25 * np.sin(np.pi * t / 1.5))
    return out / (np.max(np.abs(out)) + 1e-9) * e * 0.7


def synth_chime():
    n = int(1.4 * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for i, f in enumerate([523.25, 659.25, 783.99]):
        start = int(i * 0.12 * SR)
        tt = t[: n - start]
        out[start:] += np.sin(2 * np.pi * f * tt) * np.exp(-tt * 2.2) * 0.35
    return out


def elevenlabs_sfx(prompt, seconds):
    key = os.environ.get('ELEVENLABS_API_KEY', '').strip()
    if not key:
        return None
    req = urllib.request.Request(
        'https://api.elevenlabs.io/v1/sound-generation',
        data=json.dumps({'text': prompt, 'duration_seconds': seconds, 'prompt_influence': 0.5}).encode(),
        headers={'xi-api-key': key, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg'})
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            mp3 = r.read()
        # decode to float mono 48 kHz through ffmpeg
        pcm = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', 'pipe:0', '-f', 'f32le', '-ac', '1', '-ar', str(SR), 'pipe:1'],
                             input=mp3, capture_output=True, check=True).stdout
        return np.frombuffer(pcm, dtype=np.float32).astype(float)
    except Exception as err:
        print(f'ElevenLabs sound effect failed ({err}); using synthesised sound', file=sys.stderr)
        return None


def place(track, clip, at, gain=1.0):
    i = int(at * SR)
    j = min(len(track), i + len(clip))
    track[i:j] += clip[: j - i] * gain


def main():
    rng = np.random.default_rng(7)
    track = np.zeros(int(DURATION * SR))
    source = 'synthesised'
    snore = elevenlabs_sfx('a cute cartoon koala snoring softly, one single snore, inhale and exhale', 1.3)
    pop = elevenlabs_sfx('a small soap bubble popping, short cartoon pop', 0.5)
    yawn = elevenlabs_sfx('a cute cartoon character yawning, a long sleepy yawn', 1.6)
    chime = elevenlabs_sfx('a soft warm three-note chime, gentle, friendly', 1.5)
    if all(x is not None for x in (snore, pop, yawn, chime)):
        source = 'elevenlabs sound effects'
    snore = snore if snore is not None else synth_snore(rng)
    pop = pop if pop is not None else synth_pop(rng)
    yawn = yawn if yawn is not None else synth_yawn()
    chime = chime if chime is not None else synth_chime()
    for s in SNORES:
        place(track, snore, s, 0.8)
    place(track, pop, POP, 1.0)
    place(track, yawn, YAWN, 0.9)
    place(track, chime, CHIME, 0.6)
    # fade out with the picture
    n_fade = int(0.5 * SR)
    track[-n_fade:] *= np.linspace(1, 0, n_fade)
    track = np.clip(track / (np.max(np.abs(track)) + 1e-9) * 0.85, -1, 1)
    stereo = np.stack([track, track], axis=1)
    os.makedirs('demo-out', exist_ok=True)
    with wave.open(OUT, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((stereo * 32767).astype(np.int16).tobytes())
    print(f'{OUT} ready ({source})')


if __name__ == '__main__':
    main()

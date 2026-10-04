"""Makes the two made-up test inputs for the demo recording (tools/record-demo.mjs):

  demo-assets/note-de.png   a printed German note on lined paper, for the photo reader (OCR)
  demo-assets/voice-fr.wav  a short French voice message, for the voice model (Whisper)

The French voice comes from ElevenLabs when ELEVENLABS_API_KEY is set, otherwise from espeak-ng.
`--stub-voice` writes a plain tone instead (only for offline dry runs with a stubbed voice model).
"""
import json
import math
import os
import random
import shutil
import struct
import subprocess
import sys
import urllib.request
import wave

from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT = 'demo-assets'
NOTE = ['Das Rösten und Mahlen der', 'Kaffeebohnen hat uns sehr', 'gefallen. Das Mittagessen', 'war lecker!']
VOICE = 'Le café était délicieux et la famille très accueillante. Mais le chemin était glissant après la pluie.'
FONTS = [
    '/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf',
    '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
    '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf',
]


def font(size):
    for path in FONTS:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    raise SystemExit('No font found; install fonts-noto-core or fonts-dejavu-core')


def make_note(path):
    random.seed(4)
    paper = Image.new('RGB', (1300, 640), (250, 247, 238))
    d = ImageDraw.Draw(paper)
    for y in range(110, 640, 120):
        d.line([(40, y + 18), (1260, y + 18)], fill=(176, 196, 222), width=3)
    f = font(66)
    for i, line in enumerate(NOTE):
        d.text((70 + random.randint(-6, 6), 36 + i * 120), line, font=f, fill=(28, 44, 104))
    # Lay the paper on a table, tilt it a little and soften it like a phone photo.
    table = Image.new('RGB', (1440, 800), (122, 94, 70))
    shadow = Image.new('L', table.size, 0)
    ImageDraw.Draw(shadow).rectangle([84, 96, 84 + 1300, 96 + 640], fill=110)
    table.paste((60, 44, 32), mask=shadow.filter(ImageFilter.GaussianBlur(14)))
    table.paste(paper, (70, 80))
    img = table.rotate(-1.4, resample=Image.BICUBIC, fillcolor=(122, 94, 70)).filter(ImageFilter.GaussianBlur(0.7))
    px = img.load()
    for _ in range(60000):
        x, y = random.randrange(img.width), random.randrange(img.height)
        r, g, b = px[x, y]
        n = random.randint(-12, 12)
        px[x, y] = (max(0, min(255, r + n)), max(0, min(255, g + n)), max(0, min(255, b + n)))
    img.save(path)


def elevenlabs_voice(mp3_path):
    key = os.environ.get('ELEVENLABS_API_KEY', '').strip()
    if not key:
        return False
    voice = os.environ.get('ELEVENLABS_VOICE_ID') or 'EXAVITQu4vr4xnSDxMaL'
    req = urllib.request.Request(
        f'https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=mp3_44100_128',
        data=json.dumps({'text': VOICE, 'model_id': 'eleven_multilingual_v2'}).encode(),
        headers={'xi-api-key': key, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg'},
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as r, open(mp3_path, 'wb') as f:
            f.write(r.read())
        return True
    except Exception as err:  # fall back to espeak-ng
        print(f'ElevenLabs voice failed ({err}); using espeak-ng', file=sys.stderr)
        return False


def make_voice(path, stub=False):
    if stub:
        with wave.open(path, 'wb') as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(16000)
            w.writeframes(b''.join(struct.pack('<h', int(4000 * math.sin(i / 16000 * 2 * math.pi * 220))) for i in range(16000 * 3)))
        return 'stub tone'
    mp3 = os.path.join(OUT, 'voice-fr.mp3')
    if elevenlabs_voice(mp3):
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', mp3, '-ac', '1', '-ar', '16000', path], check=True)
        os.remove(mp3)
        return 'ElevenLabs (eleven_multilingual_v2)'
    if not shutil.which('espeak-ng'):
        raise SystemExit('No voice source: set ELEVENLABS_API_KEY or install espeak-ng')
    subprocess.run(['espeak-ng', '-v', 'fr', '-s', '135', '-w', path, VOICE], check=True)
    return 'espeak-ng'


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    make_note(os.path.join(OUT, 'note-de.png'))
    source = make_voice(os.path.join(OUT, 'voice-fr.wav'), stub='--stub-voice' in sys.argv)
    with open(os.path.join(OUT, 'sources.json'), 'w') as f:
        json.dump({'note': ' '.join(NOTE), 'voice': VOICE, 'voice_source': source}, f, ensure_ascii=False, indent=2)
    print(f'demo assets ready (voice: {source})')

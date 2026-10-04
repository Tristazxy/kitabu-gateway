"""Voices the demo narration (tools/story.json), one clip per item, into demo-out/narration/.

With ELEVENLABS_API_KEY: a stock ElevenLabs voice (never a cloned one). Without it: espeak-ng (an MBROLA
English voice if installed), so the pipeline still runs. `--silent` writes silence of the estimated
length instead (for testing the video composition offline).

Writes demo-out/narration/index.json: [{index, kind, title|scene, file, seconds, source}].
"""
import hashlib
import json
import os
import shutil
import subprocess
import sys
import time
import urllib.request

OUT = os.path.join('demo-out', 'narration')
SPEC = json.load(open(os.path.join('tools', 'story.json'), encoding='utf-8'))


def seconds_of(path):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path],
                       capture_output=True, text=True)
    return float(r.stdout.strip() or 0)


def elevenlabs(text, mp3):
    key = os.environ.get('ELEVENLABS_API_KEY', '').strip()
    if not key:
        return False
    voice = os.environ.get('NARRATION_VOICE_ID') or SPEC['voice']
    body = {
        'text': text, 'model_id': SPEC.get('model', 'eleven_multilingual_v2'),
        'voice_settings': {'stability': 0.5, 'similarity_boost': 0.8, 'style': 0.3, 'use_speaker_boost': True, 'speed': SPEC.get('speed', 1.0)},
    }
    req = urllib.request.Request(
        f'https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=mp3_44100_128',
        data=json.dumps(body).encode(), headers={'xi-api-key': key, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg'})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=120) as r, open(mp3, 'wb') as f:
                f.write(r.read())
            return True
        except Exception as err:
            print(f'ElevenLabs failed (attempt {attempt + 1}: {err})', file=sys.stderr)
            time.sleep(4 * (attempt + 1))
    print('ElevenLabs failed three times; falling back', file=sys.stderr)
    return False


def espeak(text, wav):
    if not shutil.which('espeak-ng'):
        return False
    voices = subprocess.run(['espeak-ng', '--voices=mb'], capture_output=True, text=True).stdout
    for voice in [v for v in ('mb-us1', 'mb-en1', 'mb-us2') if v in voices] + ['en-us']:
        r = subprocess.run(['espeak-ng', '-v', voice, '-s', '150', '-w', wav, text], capture_output=True, text=True)
        if r.returncode == 0 and os.path.exists(wav) and os.path.getsize(wav) > 1000:
            return True
    return False


def silence(seconds, wav):
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono',
                    '-t', f'{seconds:.2f}', wav], check=True)


def main():
    os.makedirs(OUT, exist_ok=True)
    silent = '--silent' in sys.argv
    index = []
    for i, line in enumerate(SPEC['items']):
        text = line['text'].strip()
        stem = f'{i:02d}-{hashlib.sha1(text.encode()).hexdigest()[:8]}'
        final = os.path.join(OUT, stem + '.m4a')
        source = 'silence'
        if silent:
            raw = os.path.join(OUT, stem + '.wav')
            silence(len(text.split()) / 2.6, raw)
        else:
            raw = os.path.join(OUT, stem + '.mp3')
            if elevenlabs(text, raw):
                source = 'elevenlabs:' + SPEC.get('voice_name', SPEC['voice'])
            else:
                raw = os.path.join(OUT, stem + '.wav')
                if espeak(text, raw):
                    source = 'espeak-ng'
                else:
                    silence(len(text.split()) / 2.6, raw)
        # normalise to 48 kHz stereo AAC with a short lead-in so the first word is never clipped
        try:
            subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', raw, '-af', 'adelay=300|300,loudnorm=I=-16:TP=-1.5',
                            '-ac', '2', '-ar', '48000', '-c:a', 'aac', '-b:a', '160k', final], check=True)
        except subprocess.CalledProcessError as err:
            print(f'{i:02d}: could not encode ({err}); using silence', file=sys.stderr)
            silence(len(text.split()) / 2.6, raw)
            subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', raw, '-ac', '2', '-ar', '48000', '-c:a', 'aac', final], check=True)
            source = 'silence'
        os.remove(raw)
        label = line.get('title') or line.get('scene')
        index.append({'index': i, 'kind': line['kind'], 'title': line.get('title'), 'scene': line.get('scene'), 'file': final, 'seconds': round(seconds_of(final), 2), 'source': source})
        print(f'{i:02d} {index[-1]["seconds"]:5.1f}s {source:28s} {label}')
    json.dump(index, open(os.path.join(OUT, 'index.json'), 'w'), indent=1)
    total = sum(x['seconds'] for x in index)
    print(f'narration: {len(index)} clips, {total:.0f} s total')


if __name__ == '__main__':
    main()

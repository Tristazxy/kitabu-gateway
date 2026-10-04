"""Turns the phone recording into two videos (needs ffmpeg and Pillow):

  demo-out/kitabu-demo-16x9.mp4   1920x1080: the phone on the right, a caption for each step on the left.
                                  Spans where the app was busy (OCR, translation, analysis) play 4x faster
                                  and are labelled "sped up" on screen.
  demo-out/kitabu-demo-phone.mp4  the phone screen only, real time, no captions (for your own editing).

Input: demo-out/kitabu-demo.webm and demo-out/chapters.json from tools/record-demo.mjs.
"""
import json
import os
import subprocess

from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT = 'demo-out'
SRC = os.path.join(OUT, 'kitabu-demo.webm')
W, H = 1920, 1080
SPEED = 4
MIN_BUSY = 2.0          # shorter busy spans stay at normal speed
PHONE_W, PHONE_H = 462, 1000
PX, PY = 1250, 40       # where the phone screen goes
BEZEL, RADIUS = 12, 34
TEXT_X, TEXT_W = 130, 880
HOLD_END = 2.5

BG = (31, 69, 53)
CREAM = (243, 242, 236)
SOFT = (205, 222, 212)
MUTED = (150, 180, 165)
GOLD = (233, 184, 114)

FONT_DIRS = ['/usr/share/fonts/opentype/inter', '/usr/share/fonts/truetype/noto', '/usr/share/fonts/truetype/dejavu']
FONT_FILES = {
    'bold': ['Inter-Bold.otf', 'NotoSans-Bold.ttf', 'DejaVuSans-Bold.ttf'],
    'semi': ['Inter-SemiBold.otf', 'NotoSans-SemiBold.ttf', 'NotoSans-Bold.ttf', 'DejaVuSans-Bold.ttf'],
    'regular': ['Inter-Regular.otf', 'NotoSans-Regular.ttf', 'DejaVuSans.ttf'],
}


def font(kind, size):
    for name in FONT_FILES[kind]:
        for d in FONT_DIRS:
            p = os.path.join(d, name)
            if os.path.exists(p):
                return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def wrap(draw, text, f, width):
    lines = []
    for para in text.split('\n'):
        words, line = para.split(), ''
        for w in words:
            test = f'{line} {w}'.strip()
            if draw.textlength(test, font=f) <= width:
                line = test
            else:
                if line:
                    lines.append(line)
                line = w
        lines.append(line)
    return lines


def background(chapter, index, total, sped):
    img = Image.new('RGB', (W, H), BG)
    # soft shadow behind the phone
    sh = Image.new('L', (W, H), 0)
    ImageDraw.Draw(sh).rounded_rectangle(
        [PX - BEZEL + 14, PY - BEZEL + 22, PX + PHONE_W + BEZEL + 14, PY + PHONE_H + BEZEL + 22], RADIUS + BEZEL, fill=150)
    img.paste((14, 32, 25), mask=sh.filter(ImageFilter.GaussianBlur(26)))
    d = ImageDraw.Draw(img)
    d.text((TEXT_X, 118), 'KARIBU  ·  MVP DEMO', font=font('semi', 26), fill=GOLD)
    if 0 < index < total - 1:
        d.text((TEXT_X, 160), f'{index} / {total - 2}', font=font('regular', 24), fill=MUTED)
    y = 220
    tf = font('bold', 64)
    for line in wrap(d, chapter['title'], tf, TEXT_W):
        d.text((TEXT_X, y), line, font=tf, fill=CREAM)
        y += 80
    y += 26
    bf = font('regular', 36)
    for line in wrap(d, chapter['body'], bf, TEXT_W):
        d.text((TEXT_X, y), line, font=bf, fill=SOFT)
        y += 52
    if sped:
        pf = font('semi', 28)
        label = f'Sped up {SPEED}× while the phone works'
        tw = d.textlength(label, font=pf)
        d.rounded_rectangle([TEXT_X, 830, TEXT_X + tw + 48, 884], 27, fill=GOLD)
        d.text((TEXT_X + 24, 840), label, font=pf, fill=(40, 34, 20))
    nf = font('regular', 23)
    note = ('Real app and real on-device models, recorded in a phone-sized browser. The guests are invented. '
            'The models were downloaded once before recording.')
    yy = 950
    for line in wrap(d, note, nf, TEXT_W):
        d.text((TEXT_X, yy), line, font=nf, fill=MUTED)
        yy += 32
    return img


def bezel(path):
    # Drawn at 4x and scaled down so the rounded corners are smooth.
    k = 4
    w, h = (PHONE_W + 2 * BEZEL) * k, (PHONE_H + 2 * BEZEL) * k
    alpha = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(alpha)
    d.rounded_rectangle([0, 0, w - 1, h - 1], (RADIUS + BEZEL) * k, fill=255)
    d.rounded_rectangle([BEZEL * k, BEZEL * k, (BEZEL + PHONE_W) * k - 1, (BEZEL + PHONE_H) * k - 1], RADIUS * k, fill=0)
    img = Image.new('RGBA', (w, h), (16, 18, 17, 255))
    img.putalpha(alpha)
    img.resize((w // k, h // k), Image.LANCZOS).save(path)


def main():
    meta = json.load(open(os.path.join(OUT, 'chapters.json')))
    chapters, end = meta['chapters'], meta['end']
    start = chapters[0]['t']
    busy = [(max(a, start), min(b, end)) for a, b in meta['busy'] if b - a >= MIN_BUSY]
    cuts = sorted({start, end, *[c['t'] for c in chapters], *[x for span in busy for x in span]})
    cuts = [c for c in cuts if start <= c <= end]
    segs = []
    for a, b in zip(cuts, cuts[1:]):
        if b - a < 0.05:
            continue
        mid = (a + b) / 2
        sped = any(x <= mid <= y for x, y in busy)
        ci = max(i for i, c in enumerate(chapters) if c['t'] <= mid)
        segs.append({'a': a, 'b': b, 'speed': SPEED if sped else 1, 'chapter': ci})

    tmp = os.path.join(OUT, 'compose')
    os.makedirs(tmp, exist_ok=True)
    bezel(os.path.join(tmp, 'bezel.png'))
    lines, made = ['ffconcat version 1.0'], {}
    for i, s in enumerate(segs):
        key = (s['chapter'], s['speed'] > 1)
        if key not in made:
            made[key] = os.path.join(tmp, f'bg-{key[0]:02d}-{int(key[1])}.png')
            background(chapters[key[0]], key[0], len(chapters), key[1]).save(made[key])
        dur = (s['b'] - s['a']) / s['speed'] + (HOLD_END if i == len(segs) - 1 else 0)
        lines += [f"file '{os.path.basename(made[key])}'", f'duration {dur:.3f}']
    lines.append(f"file '{os.path.basename(made[(segs[-1]['chapter'], segs[-1]['speed'] > 1)])}'")
    with open(os.path.join(tmp, 'bg.ffconcat'), 'w') as f:
        f.write('\n'.join(lines) + '\n')

    n = len(segs)
    parts = [f'[0:v]split={n}' + ''.join(f'[i{i}]' for i in range(n))]
    for i, s in enumerate(segs):
        parts.append(f"[i{i}]trim=start={s['a']:.3f}:end={s['b']:.3f},setpts=(PTS-STARTPTS)/{s['speed']}[s{i}]")
    parts.append(''.join(f'[s{i}]' for i in range(n)) + f'concat=n={n}:v=1:a=0,fps=30,'
                 f'scale={PHONE_W}:{PHONE_H}:flags=lanczos,tpad=stop_mode=clone:stop_duration={HOLD_END}[phone]')
    parts.append('[1:v]fps=30,format=rgb24[bg]')
    parts.append(f'[bg][phone]overlay=x={PX}:y={PY}:shortest=1[v1]')
    parts.append(f'[v1][2:v]overlay=x={PX - BEZEL}:y={PY - BEZEL}:shortest=1,format=yuv420p[out]')
    out16 = os.path.join(OUT, 'kitabu-demo-16x9.mp4')
    subprocess.run([
        'ffmpeg', '-y', '-loglevel', 'error', '-i', SRC,
        '-f', 'concat', '-safe', '0', '-i', os.path.join(tmp, 'bg.ffconcat'),
        '-loop', '1', '-i', os.path.join(tmp, 'bezel.png'),
        '-filter_complex', ';'.join(parts), '-map', '[out]',
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '21', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out16,
    ], check=True)

    out_phone = os.path.join(OUT, 'kitabu-demo-phone.mp4')
    subprocess.run([
        'ffmpeg', '-y', '-loglevel', 'error', '-ss', f'{start:.3f}', '-i', SRC,
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '22', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out_phone,
    ], check=True)

    total16 = sum((s['b'] - s['a']) / s['speed'] for s in segs) + HOLD_END
    with open(os.path.join(OUT, 'timeline.txt'), 'w') as f:
        t = 0.0
        for i, s in enumerate(segs):
            if i == 0 or s['chapter'] != segs[i - 1]['chapter']:
                f.write(f"{int(t // 60)}:{t % 60:04.1f}  {chapters[s['chapter']]['title']}\n")
            t += (s['b'] - s['a']) / s['speed']
        f.write(f'{int(total16 // 60)}:{total16 % 60:04.1f}  end\n')
    print(f'16:9 video {total16:.0f} s, phone video {end - start:.0f} s')


if __name__ == '__main__':
    main()

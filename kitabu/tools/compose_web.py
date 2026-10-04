"""Assembles a story (tools/story-*.json) as a full-frame 1920x1080 video of the website, with the
narration burned in as subtitles (needs ffmpeg with libass, and the per-chapter recordings from
tools/record-demo.mjs run with DEMO_DESKTOP=1).

  kind 'app'  : the chapter's own recording, played at item['rate'] (busy spans faster), held until the
                narration ends; a one-line title appears top-left for the first seconds.
  kind 'card' : demo-out/cards/<card>.png held for the narration.
Output: demo-out/<story.output>, kept within story.max_seconds by a gentle speed-up.
"""
import json
import os
import re
import subprocess
import sys

OUT = 'demo-out'
STORY_FILE = os.environ.get('STORY', os.path.join('tools', 'story-web.json'))
STORY = json.load(open(STORY_FILE, encoding='utf-8'))
NAME = STORY.get('name', 'web')
TMP = os.path.join(OUT, 'web-' + NAME)
NARR_DIR = os.path.join(OUT, 'narration-' + NAME)
FINAL_NAME = STORY.get('output', f'wekaribu-{NAME}.mp4')
BUSY_SPEED = STORY.get('busy_speed', 10)
MIN_BUSY = 2.0
W, H = 1920, 1080
ENC = ['-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', '30',
       '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-ac', '2']
ASS_HEAD = """[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Sub,DejaVu Sans,44,&H00FFFFFF,&H00FFFFFF,&H00000000,&H7A000000,0,0,0,0,100,100,0,0,4,2,0,2,160,160,48,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""


def seconds_of(path):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path], capture_output=True, text=True)
    return float(r.stdout.strip() or 0)


def run(args):
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', *args], check=True)


def chunks(text, limit=70):
    """Split narration into subtitle lines at sentence/clause boundaries."""
    parts = re.split(r'(?<=[.!?;:])\s+', text.strip())
    out = []
    for p in parts:
        while len(p) > limit:
            cut = p.rfind(',', 0, limit)
            if cut < 40:
                cut = p.rfind(' ', 0, limit)
            out.append(p[:cut + 1].strip())
            p = p[cut + 1:].strip()
        if p:
            out.append(p)
    return out


def ass_time(t):
    cs = int(round(t * 100))
    return f'{cs // 360000}:{cs // 6000 % 60:02d}:{cs // 100 % 60:02d}.{cs % 100:02d}'


def narration_text(item):
    if item.get('dialogue'):
        return ' '.join(f"{t.get('who', '')}: {t['text']}" if t.get('who') else t['text'] for t in item['dialogue'])
    return item.get('text', '')


def subtitles(items_timed, path):
    """items_timed: [(start, narr_seconds, text)] -> ASS with lines timed by word share, bottom-centred."""
    lines = []
    for start, secs, text in items_timed:
        cs = chunks(text)
        if not cs or secs <= 0:
            continue
        words = [max(1, len(c.split())) for c in cs]
        total = sum(words)
        t = start + 0.25
        for c, w in zip(cs, words):
            d = (secs - 0.3) * w / total
            lines.append(f'Dialogue: 0,{ass_time(t)},{ass_time(t + d - 0.05)},Sub,,0,0,0,,{c}')
            t += d
    with open(path, 'w', encoding='utf-8') as f:
        f.write(ASS_HEAD + '\n'.join(lines) + '\n')


def title_filter(title):
    """A small title in the top-left corner for the first 3.5 s of a chapter."""
    safe = title.replace("'", "’").replace(':', '\\:')
    return (f"drawtext=text='{safe}':fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:fontsize=34:"
            f"fontcolor=white:box=1:boxcolor=0x0E241A@0.72:boxborderw=14:x=48:y=104:enable='between(t,0.2,3.8)'")


def app_clip(ch, narr, rate, k, title):
    src = os.path.join(OUT, os.path.basename(ch['file']))
    a, b = ch['t'], min(ch['end'], seconds_of(src) or ch['end'])
    busy = [(p, q) for p, q in ch.get('busy', []) if q - p >= MIN_BUSY]
    cuts = sorted({a, b, *[x for span in busy for x in span if a < x < b]})
    segs = []
    for x, y in zip(cuts, cuts[1:]):
        if y - x < 0.05:
            continue
        mid = (x + y) / 2
        sped = any(p <= mid <= q for p, q in busy)
        segs.append((x, y, max(BUSY_SPEED, rate) if sped else rate))
    dur = sum((y - x) / sp for x, y, sp in segs)
    want = (narr['seconds'] + 0.5) if narr else dur
    hold = max(0.0, want - dur)
    final = dur + hold
    n = len(segs)
    parts = [f'[0:v]split={n}' + ''.join(f'[i{i}]' for i in range(n))]
    for i, (x, y, sp) in enumerate(segs):
        parts.append(f'[i{i}]trim=start={x:.3f}:end={y:.3f},setpts=(PTS-STARTPTS)/{sp}[s{i}]')
    chain = ''.join(f'[s{i}]' for i in range(n)) + f'concat=n={n}:v=1:a=0,fps=30,scale={W}:{H}:flags=lanczos:force_original_aspect_ratio=decrease,pad={W}:{H}:(ow-iw)/2:(oh-ih)/2:color=0x0E241A'
    if hold > 0.04:
        chain += f',tpad=stop_mode=clone:stop_duration={hold:.3f}'
    chain += ',' + title_filter(title) + ',format=yuv420p'
    parts.append(chain + '[v]')
    inputs = ['-i', src]
    if narr:
        inputs += ['-i', narr['file']]
        parts.append(f'[1:a]aresample=48000,aformat=channel_layouts=stereo,apad=whole_dur={final:.3f},atrim=0:{final:.3f},asetpts=PTS-STARTPTS[a]')
    else:
        parts.append(f'anullsrc=r=48000:cl=stereo,atrim=0:{final:.3f},asetpts=PTS-STARTPTS[a]')
    out = os.path.join(TMP, f'clip-{k:02d}.mp4')
    run([*inputs, '-filter_complex', ';'.join(parts), '-map', '[v]', '-map', '[a]', '-t', f'{final:.3f}', *ENC, out])
    return out, final


def card_clip(card, narr, k):
    src = os.path.join(OUT, 'cards', f'{card}.png')
    final = (narr['seconds'] + 0.35) if narr else 4.0
    frames = int(final * 30) + 1
    vf = (f"scale=2112:1188,zoompan=z='1+0.0006*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={frames}:s={W}x{H}:fps=30,"
          f'fade=t=in:st=0:d=0.4,fade=t=out:st={max(0.0, final - 0.4):.3f}:d=0.4,format=yuv420p')
    inputs = ['-loop', '1', '-i', src]
    if narr:
        inputs += ['-i', narr['file']]
        af = f'[1:a]aresample=48000,aformat=channel_layouts=stereo,apad=whole_dur={final:.3f},atrim=0:{final:.3f},asetpts=PTS-STARTPTS[a]'
    else:
        af = f'anullsrc=r=48000:cl=stereo,atrim=0:{final:.3f},asetpts=PTS-STARTPTS[a]'
    out = os.path.join(TMP, f'clip-{k:02d}.mp4')
    run([*inputs, '-filter_complex', f'[0:v]{vf}[v];{af}', '-map', '[v]', '-map', '[a]', '-t', f'{final:.3f}', *ENC, out])
    return out, final


def main():
    meta = json.load(open(os.path.join(OUT, 'chapters.json')))
    by_title = {c['title']: c for c in meta['chapters']}
    narr_file = os.path.join(NARR_DIR, 'index.json')
    narration = {n['index']: n for n in json.load(open(narr_file))} if os.path.exists(narr_file) else {}
    os.makedirs(TMP, exist_ok=True)
    clips, timed, t = [], [], 0.0
    for k, item in enumerate(STORY['items']):
        narr = narration.get(k)
        if item['kind'] == 'card':
            clip, d = card_clip(item['card'], narr, k)
            label = f"Card: {item['card']}"
        else:
            if item['title'] not in by_title:
                print(f"skip: chapter '{item['title']}' was not recorded")
                continue
            clip, d = app_clip(by_title[item['title']], narr, float(item.get('rate', 1.0)), k, item.get('label', item['title']))
            label = item['title']
        clips.append(clip)
        if narr:
            timed.append((t, narr['seconds'], narration_text(item)))
        print(f'{label}: {d:.1f} s')
        t += d
    with open(os.path.join(TMP, 'all.ffconcat'), 'w') as f:
        f.write('ffconcat version 1.0\n' + ''.join(f"file '{os.path.abspath(c)}'\n" for c in clips))
    joined = os.path.join(TMP, 'joined.mp4')
    run(['-f', 'concat', '-safe', '0', '-i', os.path.join(TMP, 'all.ffconcat'), '-c', 'copy', joined])
    limit = STORY.get('max_seconds')
    f = 1.0
    if limit and t > limit + 0.05:
        f = t / (limit - 0.2)
        if f > 1.08:
            print(f'WARNING: {FINAL_NAME} would be {t:.1f} s even sped up; cutting the tail')
    # subtitles are written in the final (possibly sped-up) timeline
    ass = os.path.join(TMP, 'subs.ass')
    subtitles([(s / f, d / f, text) for s, d, text in timed], ass)
    final = os.path.join(OUT, FINAL_NAME)
    vf = f'setpts=PTS/{f:.4f},' if f > 1.0 else ''
    vf += f'ass={ass}'
    af = f'atempo={f:.4f}' if f > 1.0 else 'anull'
    cut = ['-t', f'{limit:.3f}'] if limit and f > 1.08 else []
    run(['-i', joined, '-vf', vf, '-af', af, *cut, *ENC, '-movflags', '+faststart', final])
    print(f'{FINAL_NAME}: {seconds_of(final):.1f} s ({len(clips)} clips, x{f:.3f})')
    with open(os.path.join(OUT, f'timeline-{NAME}.txt'), 'w') as fh:
        tt = 0.0
        for (s, d, text) in timed:
            fh.write(f'{int(s / f // 60)}:{(s / f) % 60:04.1f}  {text[:70]}\n')
        fh.write(f'{int(t / f // 60)}:{(t / f) % 60:04.1f}  end\n')


if __name__ == '__main__':
    main()

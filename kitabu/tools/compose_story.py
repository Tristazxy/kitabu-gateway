"""Assembles the story video (needs ffmpeg and Pillow):

  demo-out/kitabu-demo-final.mp4   intro (Korla) + the items of tools/story.json in order: cartoon scenes full
                                   frame, recorded app chapters as the phone with a caption, each with Brian's
                                   narration (demo-out/narration/) and held on screen until the line ends.
  demo-out/kitabu-demo-phone.mp4   the phone recording only, real time, silent.

Inputs: demo-out/kitabu-demo.webm + chapters.json (record-demo.mjs), demo-out/scenes/<id>.mp4
(render_scenes.mjs), demo-out/intro.mp4 (render_intro.mjs), demo-out/narration/index.json (narrate.py).
Spans where the app was busy play 4x faster and are labelled on screen.
"""
import json
import os
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from compose_demo import (BEZEL, HOLD_END, MIN_BUSY, OUT, PHONE_H, PHONE_W, PX, PY, SPEED, SRC, background, bezel)

STORY_FILE = os.environ.get('STORY', os.path.join('tools', 'story.json'))
STORY = json.load(open(STORY_FILE, encoding='utf-8'))
NAME = STORY.get('name', '')
TMP = os.path.join(OUT, 'story' + ('-' + NAME if NAME else ''))
NARR_DIR = os.path.join(OUT, 'narration' + ('-' + NAME if NAME else ''))
FINAL_NAME = STORY.get('output', 'kitabu-demo-final.mp4')
BUSY_SPEED = STORY.get('busy_speed', 8)
ENC = ['-c:v', 'libx264', '-preset', 'medium', '-crf', '21', '-pix_fmt', 'yuv420p', '-r', '30',
       '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-ac', '2']


def seconds_of(path):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path], capture_output=True, text=True)
    return float(r.stdout.strip() or 0)


def run(args):
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', *args], check=True)


def app_clip(ci, chapter, nxt, busy, narr, index, total, k, rate=1.0):
    """One recorded chapter: phone footage (busy spans sped up) + caption background + narration."""
    a, b = chapter['t'], nxt
    cuts = sorted({a, b, *[x for span in busy for x in span if a < x < b]})
    segs = []
    for x, y in zip(cuts, cuts[1:]):
        if y - x < 0.05:
            continue
        mid = (x + y) / 2
        sped = any(p <= mid <= q for p, q in busy)
        segs.append({'a': x, 'b': y, 'speed': max(BUSY_SPEED, rate) if sped else rate})
    dur = sum((s['b'] - s['a']) / s['speed'] for s in segs)
    hold = max(0.0, (narr['seconds'] + 0.7 if narr else 0) - dur)
    final = dur + hold

    n = len(segs)
    parts = [f'[0:v]split={n}' + ''.join(f'[i{i}]' for i in range(n))]
    for i, s in enumerate(segs):
        parts.append(f"[i{i}]trim=start={s['a']:.3f}:end={s['b']:.3f},setpts=(PTS-STARTPTS)/{s['speed']}[s{i}]")
    chain = ''.join(f'[s{i}]' for i in range(n)) + f'concat=n={n}:v=1:a=0,fps=30,scale={PHONE_W}:{PHONE_H}:flags=lanczos'
    if hold > 0.04:
        chain += f',tpad=stop_mode=clone:stop_duration={hold:.3f}'
    parts.append(chain + '[phone]')
    # background: one still per (chapter, sped) — the sped-up label follows the busy segments
    lines, made = ['ffconcat version 1.0'], {}
    for i, s in enumerate(segs):
        key = s['speed'] > 1
        if key not in made:
            made[key] = os.path.join(TMP, f'bg-{ci:02d}-{int(key)}.png')
            background(chapter, index, total, key).save(made[key])
        d = (s['b'] - s['a']) / s['speed'] + (hold if i == n - 1 else 0)
        lines += [f"file '{os.path.basename(made[key])}'", f'duration {d:.3f}']
    lines.append(f"file '{os.path.basename(made[segs[-1]['speed'] > 1])}'")
    concat_file = os.path.join(TMP, f'bg-{ci:02d}.ffconcat')
    with open(concat_file, 'w') as f:
        f.write('\n'.join(lines) + '\n')
    parts.append('[1:v]fps=30,format=rgb24[bg]')
    parts.append(f'[bg][phone]overlay=x={PX}:y={PY}:shortest=1[v1]')
    parts.append(f'[v1][2:v]overlay=x={PX - BEZEL}:y={PY - BEZEL}:shortest=1,format=yuv420p[v]')
    inputs = ['-i', SRC, '-f', 'concat', '-safe', '0', '-i', concat_file, '-loop', '1', '-i', os.path.join(TMP, 'bezel.png')]
    if narr:
        inputs += ['-i', narr['file']]
        parts.append(f'[3:a]aresample=48000,aformat=channel_layouts=stereo,apad=whole_dur={final:.3f},atrim=0:{final:.3f},asetpts=PTS-STARTPTS[a]')
    else:
        parts.append(f'anullsrc=r=48000:cl=stereo,atrim=0:{final:.3f},asetpts=PTS-STARTPTS[a]')
    out = os.path.join(TMP, f'clip-{k:02d}.mp4')
    run([*inputs, '-filter_complex', ';'.join(parts), '-map', '[v]', '-map', '[a]', '-t', f'{final:.3f}', *ENC, out])
    return out, final


def card_clip(card, narr, index):
    """A full-frame text card (demo-out/cards/<card>.png), held for the narration with a slow push-in."""
    src = os.path.join(OUT, 'cards', f'{card}.png')
    final = (narr['seconds'] + 0.6) if narr else 4.0
    frames = int(final * 30) + 1
    vf = (f'scale=2112:1188,zoompan=z=\'1+0.0006*on\':x=\'iw/2-(iw/zoom/2)\':y=\'ih/2-(ih/zoom/2)\':d={frames}:s=1920x1080:fps=30,'
          f'fade=t=in:st=0:d=0.4,fade=t=out:st={max(0.0, final - 0.4):.3f}:d=0.4,format=yuv420p')
    inputs = ['-loop', '1', '-i', src]
    if narr:
        inputs += ['-i', narr['file']]
        af = f'[1:a]aresample=48000,aformat=channel_layouts=stereo,apad=whole_dur={final:.3f},atrim=0:{final:.3f},asetpts=PTS-STARTPTS[a]'
    else:
        af = f'anullsrc=r=48000:cl=stereo,atrim=0:{final:.3f},asetpts=PTS-STARTPTS[a]'
    out = os.path.join(TMP, f'clip-{index:02d}.mp4')
    run([*inputs, '-filter_complex', f'[0:v]{vf}[v];{af}', '-map', '[v]', '-map', '[a]', '-t', f'{final:.3f}', *ENC, out])
    return out, final


def scene_clip(scene, narr, index):
    src = os.path.join(OUT, 'scenes', f'{scene}.mp4')
    dur = seconds_of(src)
    final = max(dur, (narr['seconds'] + 0.5) if narr else 0)
    hold = final - dur
    vf = f'fps=30,scale=1920:1080' + (f',tpad=stop_mode=clone:stop_duration={hold:.3f}' if hold > 0.04 else '')
    inputs = ['-i', src]
    if narr:
        inputs += ['-i', narr['file']]
        af = f'[1:a]aresample=48000,aformat=channel_layouts=stereo,apad=whole_dur={final:.3f},atrim=0:{final:.3f},asetpts=PTS-STARTPTS[a]'
    else:
        af = f'anullsrc=r=48000:cl=stereo,atrim=0:{final:.3f},asetpts=PTS-STARTPTS[a]'
    out = os.path.join(TMP, f'clip-{index:02d}.mp4')
    run([*inputs, '-filter_complex', f'[0:v]{vf}[v];{af}', '-map', '[v]', '-map', '[a]', '-t', f'{final:.3f}', *ENC, out])
    return out, final


def main():
    story = STORY
    meta = json.load(open(os.path.join(OUT, 'chapters.json')))
    chapters, end = meta['chapters'], meta['end']
    busy = [(a, b) for a, b in meta['busy'] if b - a >= MIN_BUSY]
    narr_file = os.path.join(NARR_DIR, 'index.json')
    narration = json.load(open(narr_file)) if os.path.exists(narr_file) else []
    narr_by_index = {n['index']: n for n in narration}
    by_title = {c['title']: i for i, c in enumerate(chapters)}
    os.makedirs(TMP, exist_ok=True)
    bezel(os.path.join(TMP, 'bezel.png'))

    clips, timeline, t = [], [], 0.0
    intro = os.path.join(OUT, 'intro.mp4')
    if story.get('intro', True) and os.path.exists(intro):
        clips.append(intro)
        timeline.append((0.0, 'Intro: Korla wakes up'))
        t += seconds_of(intro)
    app_items = [it for it in story['items'] if it['kind'] == 'app']
    for k, item in enumerate(story['items']):
        narr = narr_by_index.get(k)
        if item['kind'] == 'scene':
            clip, d = scene_clip(item['scene'], narr, k)
            label = f"Scene: {item['scene']}"
        elif item['kind'] == 'card':
            clip, d = card_clip(item['card'], narr, k)
            label = f"Card: {item['card']}"
        else:
            if item['title'] not in by_title:
                print(f"skip: chapter '{item['title']}' was not recorded")
                continue
            ci = by_title[item['title']]
            nxt = chapters[ci + 1]['t'] if ci + 1 < len(chapters) else end
            clip, d = app_clip(ci, chapters[ci], nxt, busy, narr, app_items.index(item) + 1, len(app_items) + 2, k, float(item.get('rate', 1.0)))
            label = item['title']
        clips.append(clip)
        timeline.append((t, label))
        t += d
        print(f'{label}: {d:.1f} s')

    with open(os.path.join(TMP, 'all.ffconcat'), 'w') as f:
        f.write('ffconcat version 1.0\n' + ''.join(f"file '{os.path.abspath(c)}'\n" for c in clips))
    final = os.path.join(OUT, FINAL_NAME)
    run(['-f', 'concat', '-safe', '0', '-i', os.path.join(TMP, 'all.ffconcat'), *ENC, '-movflags', '+faststart', final])
    limit = story.get('max_seconds')
    if limit and t > limit + 0.05:
        print(f'WARNING: {FINAL_NAME} is {t:.1f} s, over the {limit} s limit; trimming the tail')
        run(['-i', final, '-t', f'{limit:.3f}', '-af', f'afade=t=out:st={limit - 0.6:.3f}:d=0.6', *ENC, '-movflags', '+faststart', final + '.cut.mp4'])
        os.replace(final + '.cut.mp4', final)
        t = limit

    if not NAME:
        start = chapters[0]['t'] if chapters else 0
        run(['-ss', f'{start:.3f}', '-i', SRC, '-c:v', 'libx264', '-preset', 'medium', '-crf', '22', '-pix_fmt', 'yuv420p', '-an',
             '-movflags', '+faststart', os.path.join(OUT, 'kitabu-demo-phone.mp4')])

    with open(os.path.join(OUT, f'timeline{"-" + NAME if NAME else ""}.txt'), 'w') as f:
        for at, label in timeline:
            f.write(f'{int(at // 60)}:{at % 60:04.1f}  {label}\n')
        f.write(f'{int(t // 60)}:{t % 60:04.1f}  end\n')
    print(f'{FINAL_NAME}: {t:.1f} s ({len(clips)} clips)')


if __name__ == '__main__':
    main()

# Floor plans as SVG. Drawn, not generated: room labels, areas and dimension
# chains have to be legible, and image models bake in garbled lettering.
from xml.sax.saxutils import escape as xesc

M = 46.0            # px per metre
PAD = 86            # room for dimension chains and title block
PAPER   = "#F2EEE5"
INK     = "#1A1814"
HAIR    = "#C9C2B2"
DIM     = "#6B6559"
FILL_A  = "#E8E3D6"
FILL_B  = "#E2DCCD"
WET     = "#DCD9CF"
OUT     = "#EFEBE0"

def plan(name, config, rooms, doors, w, h, note):
    W = int(w*M) + PAD*2
    H = int(h*M) + PAD*2 + 54
    px = lambda v: round(v*M, 1)
    s = []
    # Explicit width/height as well as viewBox: an SVG with only a viewBox has
    # no intrinsic size, so <img> reports naturalWidth 0 and renders nothing.
    s.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" '
             f'viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid meet" '
             f'role="img" aria-label="{xesc(name)} floor plan">')
    s.append(f'<rect width="{W}" height="{H}" fill="{PAPER}"/>')
    s.append(f'<g transform="translate({PAD},{PAD})">')

    # rooms
    for i,(rx,ry,rw,rh,label,kind) in enumerate(rooms):
        fill = OUT if kind=="out" else (WET if kind=="wet" else (FILL_A if i%2==0 else FILL_B))
        s.append(f'<rect x="{px(rx)}" y="{px(ry)}" width="{px(rw)}" height="{px(rh)}" fill="{fill}" stroke="{INK}" stroke-width="2.2"/>')

    # outer wall, poché
    s.append(f'<rect x="0" y="0" width="{px(w)}" height="{px(h)}" fill="none" stroke="{INK}" stroke-width="7"/>')

    # door openings punched through the walls
    for (dx,dy,dw,dh) in doors:
        s.append(f'<rect x="{px(dx)}" y="{px(dy)}" width="{px(dw)}" height="{px(dh)}" fill="{PAPER}"/>')

    # labels
    for (rx,ry,rw,rh,label,kind) in rooms:
        cx, cy = px(rx+rw/2), px(ry+rh/2)
        area = rw*rh
        small = rw < 2.9 or rh < 2.4
        fs = 11.5 if small else 13.5
        s.append(f'<text x="{cx}" y="{cy-3}" text-anchor="middle" font-family="Jost, Helvetica, Arial, sans-serif" '
                 f'font-size="{fs}" letter-spacing="1.6" fill="{INK}">{xesc(label.upper())}</text>')
        s.append(f'<text x="{cx}" y="{cy+14}" text-anchor="middle" font-family="Jost, Helvetica, Arial, sans-serif" '
                 f'font-size="10" letter-spacing="0.8" fill="{DIM}">{rw:.1f} × {rh:.1f} m</text>')

    # dimension chain, top
    s.append(f'<line x1="0" y1="-34" x2="{px(w)}" y2="-34" stroke="{DIM}" stroke-width="1"/>')
    for t in (0, w):
        s.append(f'<line x1="{px(t)}" y1="-40" x2="{px(t)}" y2="-28" stroke="{DIM}" stroke-width="1"/>')
    s.append(f'<text x="{px(w/2)}" y="-42" text-anchor="middle" font-family="Jost, Helvetica, Arial, sans-serif" '
             f'font-size="11" letter-spacing="1.2" fill="{DIM}">{w:.1f} m</text>')
    # dimension chain, left
    s.append(f'<line x1="-34" y1="0" x2="-34" y2="{px(h)}" stroke="{DIM}" stroke-width="1"/>')
    for t in (0, h):
        s.append(f'<line x1="-40" y1="{px(t)}" x2="-28" y2="{px(t)}" stroke="{DIM}" stroke-width="1"/>')
    s.append(f'<text x="-42" y="{px(h/2)}" text-anchor="middle" font-family="Jost, Helvetica, Arial, sans-serif" '
             f'font-size="11" letter-spacing="1.2" fill="{DIM}" transform="rotate(-90,-42,{px(h/2)})">{h:.1f} m</text>')

    # north arrow
    nx, ny = px(w)+34, 10
    s.append(f'<g transform="translate({nx},{ny})"><path d="M0,26 L0,0 M0,0 L-5,9 M0,0 L5,9" stroke="{INK}" stroke-width="1.4" fill="none"/>'
             f'<text x="0" y="40" text-anchor="middle" font-family="Jost, Helvetica, Arial, sans-serif" font-size="10" letter-spacing="1.4" fill="{DIM}">N</text></g>')

    s.append('</g>')

    # title block
    by = H - 34
    s.append(f'<line x1="{PAD}" y1="{by-22}" x2="{W-PAD}" y2="{by-22}" stroke="{HAIR}" stroke-width="1"/>')
    s.append(f'<text x="{PAD}" y="{by}" font-family="Jost, Helvetica, Arial, sans-serif" font-size="12.5" '
             f'letter-spacing="2.6" fill="{INK}">{xesc(config.upper())}</text>')
    s.append(f'<text x="{W-PAD}" y="{by}" text-anchor="end" font-family="Jost, Helvetica, Arial, sans-serif" '
             f'font-size="11" letter-spacing="1.2" fill="{DIM}">{xesc(note)}</text>')
    s.append('</svg>')
    return "\n".join(s)

PLANS = {
 "plan-1bhk": dict(
   name="One bedroom", config="1 BHK", w=9.2, h=7.6,
   note="Indicative layout · not to scale",
   rooms=[(0,0,5.4,4.6,"Living & Dining","dry"),(5.4,0,3.8,2.6,"Kitchen","dry"),
          (5.4,2.6,3.8,2.0,"Bath","wet"),(0,4.6,5.4,3.0,"Bedroom","dry"),
          (5.4,4.6,3.8,3.0,"Balcony","out")],
   doors=[(5.4,1.0,0.06,0.9),(5.4,3.2,0.06,0.8),(1.6,4.6,1.0,0.06),(6.4,4.6,1.0,0.06)]),

 "plan-2bhk": dict(
   name="Two bedroom", config="2 BHK", w=11.6, h=9.4,
   note="Indicative layout · not to scale",
   rooms=[(0,0,6.2,1.6,"Balcony","out"),(0,1.6,6.2,4.4,"Living & Dining","dry"),
          (6.2,0,5.4,3.2,"Kitchen","dry"),(6.2,3.2,2.6,2.8,"Bath 1","wet"),
          (8.8,3.2,2.8,2.8,"Utility","wet"),(0,6.0,6.0,3.4,"Master Bedroom","dry"),
          (6.0,6.0,3.4,3.4,"Bedroom 2","dry"),(9.4,6.0,2.2,3.4,"Bath 2","wet")],
   doors=[(2.2,1.6,1.1,0.06),(6.2,1.8,0.06,0.9),(6.2,4.0,0.06,0.8),(1.8,6.0,1.0,0.06),(7.0,6.0,1.0,0.06),(9.4,7.2,0.06,0.8)]),

 "plan-3bhk": dict(
   name="Three bedroom", config="3 BHK", w=14.6, h=10.8,
   note="Indicative layout · not to scale",
   rooms=[(0,0,7.6,1.8,"Balcony","out"),(0,1.8,7.6,5.2,"Living & Dining","dry"),
          (7.6,0,7.0,3.6,"Kitchen","dry"),(7.6,3.6,3.4,1.5,"Utility","wet"),
          (7.6,5.1,3.4,1.9,"Bath 2","wet"),
          (11.0,3.6,3.6,3.4,"Study","dry"),(0,7.0,5.0,3.8,"Master Bedroom","dry"),
          (5.0,7.0,2.4,3.8,"Master Bath","wet"),(7.4,7.0,3.6,3.8,"Bedroom 2","dry"),
          (11.0,7.0,3.6,3.8,"Bedroom 3","dry")],
   doors=[(3.0,1.8,1.2,0.06),(7.6,2.0,0.06,1.0),(7.6,3.9,0.06,0.8),(7.6,5.5,0.06,0.8),(11.0,4.6,0.06,0.9),
          (1.6,7.0,1.0,0.06),(8.6,7.0,1.0,0.06),(12.2,7.0,1.0,0.06),(5.0,8.4,0.06,0.8)]),

 "plan-4bhk": dict(
   name="Four bedroom", config="4 BHK", w=17.2, h=12.6,
   note="Indicative layout · not to scale",
   rooms=[(0,0,8.4,2.0,"Balcony","out"),(0,2.0,8.4,5.8,"Living & Dining","dry"),
          (8.4,0,8.8,3.8,"Kitchen","dry"),(8.4,3.8,4.0,2.1,"Utility","wet"),
          (8.4,5.9,4.0,1.9,"Bath 2","wet"),
          (12.4,3.8,3.0,4.0,"Family Room","dry"),(15.4,3.8,1.8,4.0,"Bath 3","wet"),
          (0,7.8,5.6,4.8,"Master Bedroom","dry"),(5.6,7.8,2.6,4.8,"Master Bath","wet"),
          (8.2,7.8,3.2,4.8,"Bedroom 2","dry"),(11.4,7.8,3.2,4.8,"Bedroom 3","dry"),
          (14.6,7.8,2.6,4.8,"Bedroom 4","dry")],
   doors=[(3.4,2.0,1.3,0.06),(8.4,2.2,0.06,1.0),(8.4,4.3,0.06,0.9),(8.4,6.3,0.06,0.9),(12.4,5.2,0.06,0.9),
          (1.8,7.8,1.1,0.06),(9.4,7.8,1.0,0.06),(12.6,7.8,1.0,0.06),(15.4,7.8,1.0,0.06),(5.6,9.4,0.06,0.9)]),
}

import os
os.makedirs("plans", exist_ok=True)
for key, p in PLANS.items():
    svg = plan(p["name"], p["config"], p["rooms"], p["doors"], p["w"], p["h"], p["note"])
    open(f"plans/{key}.svg","w").write(svg)
    gross = p["w"]*p["h"]
    carpet = sum(r[2]*r[3] for r in p["rooms"] if r[5]!="out")
    print(f'  {key:<12} {p["config"]:<6} {p["w"]:.1f}x{p["h"]:.1f}m  built-up {gross:.0f} m2 ({gross*10.7639:.0f} sq ft)  internal {carpet:.0f} m2  rooms {len(p["rooms"])}  {len(svg)} bytes')

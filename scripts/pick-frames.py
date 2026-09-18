import subprocess, statistics, json
W,H=160,90
out = subprocess.run(["ffmpeg","-v","error","-i","raw/hero.mp4","-vf",f"scale={W}:{H}","-f","rawvideo","-pix_fmt","gray","-"],capture_output=True).stdout
size=W*H
fr=[out[i*size:(i+1)*size] for i in range(len(out)//size)]
N=len(fr)
# per-frame visual delta
d=[0.0]
for a,b in zip(fr,fr[1:]):
    d.append(sum(abs(x-y) for x,y in zip(a,b))/size)
# cumulative visual distance
cum=[0.0]
for x in d[1:]: cum.append(cum[-1]+x)
total=cum[-1]
print(f"source frames {N}, total visual distance {total:.1f}")

def select(k):
    """Pick k source frames spaced at equal cumulative visual distance."""
    picks=[]; j=0
    for i in range(k):
        target=total*i/(k-1)
        while j<N-1 and cum[j]<target: j+=1
        picks.append(j)
    # de-duplicate while preserving order (near-static runs collapse)
    seen=set(); uniq=[]
    for p in picks:
        if p not in seen: seen.add(p); uniq.append(p)
    return uniq

for k in (120,160,200,240):
    u=select(k)
    # residual non-uniformity after selection
    step=[cum[b]-cum[a] for a,b in zip(u,u[1:])]
    cv=statistics.pstdev(step)/statistics.mean(step)*100
    print(f"  request {k:>3} -> {len(u):>3} unique frames, residual CV {cv:5.1f}%")

K=200
sel=select(K)
json.dump(sel, open("frames_desktop.json","w"))
selm=select(100)
json.dump(selm, open("frames_mobile.json","w"))
print(f"\ndesktop set: {len(sel)} frames, source idx {sel[0]}..{sel[-1]}")
print(f"mobile set : {len(selm)} frames")
# show how uniform the NEW sequence is, in the same 10 buckets as before
step=[cum[b]-cum[a] for a,b in zip(sel,sel[1:])]
n=len(step); b10=[statistics.mean(step[i*n//10:(i+1)*n//10]) for i in range(10)]
print("\nAFTER equal-distance sampling:")
print(f"  peak-to-trough ratio : {max(b10)/min(b10):.2f}x   (was 9.22x)")
print(f"  coefficient of variation: {statistics.pstdev(b10)/statistics.mean(b10)*100:.1f}%   (was 50.4%)")

# Usage:
#   python3 scripts/pick-frames.py
# Writes frames_desktop.json / frames_mobile.json: the source frame indices to
# encode, spaced at equal cumulative visual distance rather than equal time.

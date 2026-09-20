#!/usr/bin/env bash
# Encode the hero frame sequence.
#
# Run from the repo root with the source film at $SRC (default ../work2/hero2.mp4)
# and the frame manifests produced by scripts/pick-frames.py.
#
# WHY THE SHARPEN PASS EXISTS
#
# The film is 1280x720. The hero canvas is sized at devicePixelRatio (capped at
# 2), so on a 1600px-wide desktop it paints into 3200 device pixels: a 2.5x
# upscale on a source that has no more detail to give. Measured, in-canvas,
# against the same source frame resampled to 3200 with lanczos as the ceiling:
#
#   what shipped before   avifenc -q 50, no sharpen      73.5%   18.5 KB
#   unsharp 0.35, q 56                                  103.4%   27.7 KB
#   unsharp 0.35, q 60                                 ~106%    ~33 KB
#   unsharp 0.35, q 52    (this script)                ~101%    ~25 KB
#   unsharp 0.35, q 66                                  112.9%   43.5 KB
#
# q50 alone was throwing away 39% of the source's high-frequency detail before
# the upscale even started. A small unsharp at native width costs far less than
# buying the same apparent detail with quality alone, and introduces no
# clipping: blown and crushed pixel counts stay at 0.000% at every amount up
# to 0.85, measured.
#
# Mobile is sharpened less (0.22) because its band only upscales about 1.22x.
#
# q60 made the desktop tier 7.2 MB. The sequence streams while you scroll, and
# at that weight only a quarter of it existed a minute in — which is what made
# the frame-substitution bug so visible. q52 is a quarter lighter and still far
# above the 73.5% of detail the original q50-without-sharpening shipped.
set -euo pipefail

SRC="${SRC:-/home/user/work2/hero2.mp4}"
OUT="${OUT:-public/hero}"
WORK="${WORK:-/tmp/hero-encode}"
JOBS="${JOBS:-4}"

GRADE="eq=contrast=1.07:saturation=0.88:gamma=0.97,colorbalance=rs=0.025:bs=-0.035:rm=0.02:bm=-0.025:rh=0.01:bh=-0.02"
SHARP_D="unsharp=5:5:0.35:5:5:0.0"
SHARP_M="unsharp=5:5:0.22:5:5:0.0"
QA=52; QA_M=50; QW=74; QW_M=72

rm -rf "$WORK"; mkdir -p "$WORK/d" "$WORK/m"
echo "decoding + grading + sharpening source frames..."
ffmpeg -v error -y -i "$SRC" -vf "$GRADE,$SHARP_D"                       -vsync 0 "$WORK/d/%03d.png"
ffmpeg -v error -y -i "$SRC" -vf "scale=854:-2:flags=lanczos,$GRADE,$SHARP_M" -vsync 0 "$WORK/m/%03d.png"

encode () {                       # $1 src dir  $2 manifest  $3 avif out  $4 webp out  $5 avif q  $6 webp q
  local src=$1 manifest=$2 oa=$3 ow=$4 qa=$5 qw=$6 i=0
  mkdir -p "$oa" "$ow"; rm -f "$oa"/*.avif "$ow"/*.webp
  for idx in $(python3 -c "import json;print(' '.join(map(str,json.load(open('$manifest')))))"); do
    i=$((i+1)); n=$(printf "%03d" $((idx+1))); o=$(printf "f%03d" $i)
    avifenc -q "$qa" -s 6 --jobs 1 "$src/$n.png" "$oa/$o.avif" >/dev/null 2>&1 &
    ffmpeg -v error -y -i "$src/$n.png" -c:v libwebp -q:v "$qw" -compression_level 5 "$ow/$o.webp" &
    if [ $((i % JOBS)) -eq 0 ]; then wait; fi
  done
  wait
  echo "  $(ls "$oa" | wc -l) avif, $(ls "$ow" | wc -l) webp -> $oa"
}

echo "encoding desktop tier..."
encode "$WORK/d" scripts/frames/desktop.json "$OUT/avif/desktop" "$OUT/webp/desktop" $QA  $QW
echo "encoding mobile tier..."
encode "$WORK/m" scripts/frames/mobile.json  "$OUT/avif/mobile"  "$OUT/webp/mobile"  $QA_M $QW_M

echo "poster..."
LAST=$(python3 -c "import json;print(json.load(open('scripts/frames/desktop.json'))[-1]+1)")
ffmpeg -v error -y -i "$WORK/d/$(printf '%03d' $LAST).png" -c:v libwebp -q:v 86 "$OUT/poster.webp"

du -sh "$OUT"/avif/* "$OUT"/webp/*

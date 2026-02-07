#!/bin/bash

magick mogrify -path optimized -resize "2560x2560>" -define webp:lossless=false -quality 85 -format webp *.*
echo "Done"

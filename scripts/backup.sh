#!/bin/bash

SRC="$1"
DEST="$2"
TS=$(date +%Y%m%d%H%M%S)

mkdir -p "$DEST"

ARCHIVE="$DEST/backup_$TS.tar.gz"
ENCRYPTED="$ARCHIVE.enc"

tar -czf "$ARCHIVE" "$SRC"

openssl enc -aes-256-cbc -salt -in "$ARCHIVE" -out "$ENCRYPTED" -k "mysecretkey"

sha256sum "$ENCRYPTED" > "$ENCRYPTED.sha256"

rm "$ARCHIVE"

# 🔐 Secure permissions
chmod 600 "$ENCRYPTED"
chmod 600 "$ENCRYPTED.sha256"

echo "$ENCRYPTED"

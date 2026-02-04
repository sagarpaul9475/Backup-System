#!/bin/bash

BACKUP_FILE="$1"
RESTORE_DIR="$2"

mkdir -p "$RESTORE_DIR"

DECRYPTED="$BACKUP_FILE.dec.tar.gz"

openssl enc -d -aes-256-cbc -in "$BACKUP_FILE" -out "$DECRYPTED" -k "mysecretkey"

tar -xzf "$DECRYPTED" -C "$RESTORE_DIR"

rm "$DECRYPTED"

echo "RESTORE_DONE"

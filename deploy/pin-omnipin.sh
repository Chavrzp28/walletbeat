#!/bin/bash

set -euo pipefail
set +x

if [[ -n "${DEBUG:-}" ]]; then
	set -x
fi

if [[ -z "${DEPLOY_DIRECTORY:-}" ]]; then
	echo 'Missing DEPLOY_DIRECTORY' >&2
	exit 1
fi

DIRECTORY_CID="$(pnpm --silent ipfs add -Qr --only-hash --cid-version 1 "$DEPLOY_DIRECTORY")"
pnpm omnipin pin --strict "${DIRECTORY_CID}"

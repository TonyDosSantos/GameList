#!/usr/bin/env bash
#
# Écrit js/version.js avec le commit et l'heure du déploiement, puis committe
# et pousse si le contenu a changé.
#
# Appelé depuis deux endroits, parce qu'il y a deux façons d'arriver sur main :
#   - version.yml       : quelqu'un pousse ou fusionne à la main ;
#   - auto-merge.yml    : le bot fusionne une PR.
#
# Le second cas impose ce partage : GitHub ne déclenche aucun workflow sur un
# push effectué avec GITHUB_TOKEN. Une fusion faite par le bot ne réveille donc
# pas version.yml, et l'estampille resterait figée sur un ancien commit. C'est
# à l'auto-merge d'estampiller lui-même juste après avoir fusionné.

set -euo pipefail

COMMIT=$(git rev-parse --short HEAD)
DATE=$(date -u +%Y-%m-%dT%H:%M:%SZ)

cat > js/version.js <<FIN
// Estampille de version du site.
//
// ⚠️ Ce fichier est réécrit automatiquement par
// .github/scripts/estampiller-version.sh à chaque mise à jour de \`main\`. Ne
// l'éditez pas à la main : votre modification serait écrasée au déploiement
// suivant.
//
// Les valeurs vides ci-dessous sont celles d'une copie locale : le site
// affiche alors « version locale » au lieu d'une date de déploiement.

const VERSION = {
  "commit": "$COMMIT",
  "builtAt": "$DATE"
};
FIN

if git diff --quiet js/version.js; then
  echo "Version inchangée, rien à commiter."
  exit 0
fi

git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
git add js/version.js
git commit -m "Version du site : $COMMIT ($DATE)"

# Si une autre fusion est passée entre-temps, on se replace derrière elle
# plutôt que d'échouer.
git push || {
  echo "Push refusé, main a bougé : rebase puis nouvelle tentative."
  git pull --rebase
  git push
}

echo "Estampillé : $COMMIT ($DATE)"

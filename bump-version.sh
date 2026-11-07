#!/bin/sh
# Ajoute/actualise un numéro de version (?v=...) sur les fichiers CSS/JS
# pour que les téléphones chargent immédiatement la nouvelle version
# au lieu de la garder en cache. À lancer avant chaque commit.
V=$(date +%Y%m%d%H%M%S)
cd "$(dirname "$0")"
sed -i -E "s#(css/style\.css|js/app\.js|vendor/qrcode\.js)(\?v=[0-9]+)?#\1?v=$V#g" index.html
sed -i -E "s#from '(\./[a-z]+\.js)(\?v=[0-9]+)?'#from '\1?v=$V'#g" js/*.js
echo "version $V"

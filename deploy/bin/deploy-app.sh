cd "$( dirname "${BASH_SOURCE[0]}" )"/../

sh ./app/bin/prepare-images.sh

sh ./app/bin/deploy-app.sh

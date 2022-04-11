#!/usr/bin/env bash
set -e
shopt -s dotglob

deploy_dir="deploy-setup"
deploy_repo="https://github.com/paralect/ship-deploy"

api_koa_dir="api"
api_koa_repo="https://github.com/paralect/koa-api-starter"

web_next_dir="web"
web_next_repo="https://github.com/paralect/next-starter"

project_name="$1"
platform_dir="$2"
cli_dir="$3"

filesToRemove=(
  "docker-compose.yml"
  ".husky"
)

function installService() {
  repo="$1"
  dir="$2"

  mkdir "$dir"
  cd "$dir"
  git clone --quiet "$repo" .
  rm -rf .git "${filesToRemove[@]}"
  cd ../
}

mkdir "$project_name"
cd "$project_name"
cp -a "$cli_dir"/template/. .
echo "# $project_name" > README.md
touch .gitignore
echo ".idea" >> .gitignore
echo "node-modules" >> .gitignore
echo ".DS_Store" >> .gitignore

for i in docker-compose*; do
  perl -i -pe"s/ship/$project_name/g" $i
done

installService "$api_koa_repo" "$api_koa_dir"
installService "$web_next_repo" "$web_next_dir"
installService "$deploy_repo" "$deploy_dir"

mv ./"$deploy_dir"/"$platform_dir" ./deploy
mv ./"$deploy_dir"/.gitignore ./deploy
mv ./"$deploy_dir"/README.md ./deploy
mv ./deploy/.github .
mv  workflows/chromatic.yml .github/workflows

rm -rf "$deploy_dir"
rm -rf web/.github
rm -rf workflows

npm install
git init
git add .
git commit -m "initial commit"
git branch -M main
npx husky install

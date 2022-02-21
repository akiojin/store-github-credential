#!/bin/sh

# 環境変数
# $GIT_CREDENTIAL_USERNAME = GitHub のアカウント名（またはメールアドレス）
# $GIT_CREDENTIAL_PASSWORD = GitHub の PAT (repo, workflow, admin:repo_hook)

# ログインキーチェインを利用するように変更
security list-keychain -d user -s ~/Library/Keychains/login.keychain-db

# GitHub の認証情報の追加
git credential-manager-core store << EOS
protocol=https
host=github.com
username=$GIT_CREDENTIAL_USERNAME
password=$GIT_CREDENTIAL_PASSWORD
EOS

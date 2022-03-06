# store-git-credential-github-action
![Test][0]

This action saves the GitHub credentials to the specified keychain.
The GitHub credentials are deleted at the end of the workflow.

## Requirement
You will need to install [git-credential-manager-core][1]

### Installation
See [Installation][2]

```sh
brew tap microsoft/git
brew install --cask git-credential-manager-core
```
```sh
brew upgrade git-credential-manager-core
```

## Usage
### Simple usage
```yml
# Use default login.keychain-db
- uses: store-git-credential-github-action
  with:
    github-username: ${{ secrets.GIT_CREDENTIAL_USERNAME }}
    github-password: ${{ secrets.GIT_CREDENTIAL_PASSWORD }}
```

### Custom keychain usage
```yml
# Creating a temporary keychain
- uses: akiojin/setup-temporary-keychain-github-action@v1.0
  id: setup-temporary-keychain

- uses: store-git-credential-github-action
  with:
    github-username: ${{ secrets.GIT_CREDENTIAL_USERNAME }}
    github-password: ${{ secrets.GIT_CREDENTIAL_PASSWORD }}
    keychain: ${{ steps.setup-temporary-keychain.outputs.keychain }}
    keychain-password: ${{ steps.setup-temporary-keychain.outputs.keychain-password }}
```

## Additional Arguments
See [action.yml][3] for more details.

- `github-username`
  - **Requied**: true
  - **Type**: string
  - **Description**: GitHub username
- `github-password`
  - **Requied**: true
  - **Type**: string
  - **Description**: A personal access token with access to the GitHub repository
- `keychain`
  - **Requied**: false
  - **Type**: string
  - **Description**: Path of the keychain to use. If omitted, the default login keychain is used.
  - **Default**: '$HOME/Library/Keychains/loging.keychain-db'
- `keychain-password`
  - **Requied**: false
  - **Type**: string
  - **Description**: Password for the keychain if specified in the keychain parameter; default login keychain password if the kerchain parameter is omitted.
  - **Default**: ''

GitHub personal access tokens can be obtained at `Settings > Developer settings > Personal access tokens`.
Access rights require `repo` permissions.

## License
Any contributions made under this project will be governed by the [MIT License][4].

[0]: https://github.com/akiojin/store-git-credential-github-action/actions/workflows/Test.yml/badge.svg
[1]: https://github.com/GitCredentialManager/git-credential-manager
[2]: https://github.com/GitCredentialManager/git-credential-manager#download-and-install
[3]: https://github.com/akiojin/store-git-credential-github-action/blob/main/action.yml
[4]: https://github.com/akiojin/store-git-credential-github-action/blob/main/LICENSE
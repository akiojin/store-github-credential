# store-git-credential-github-action
![Test][0]

This action internally creates a new keychain and stores the GitHub credentials in that keychain.
The saved keychain is destroyed upon exit.

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
- uses: store-git-credential-github-action
  with:
    username: ${{ secrets.GIT_CREDENTIAL_USERNAME }}
    password: ${{ secrets.GIT_CREDENTIAL_PASSWORD }}
```

## Additional Arguments
See [action.yml][3] for more details.

- `username`
  - **Requied**: true
  - **Type**: string
  - **Description**: GitHub username
- `password`
  - **Requied**: true
  - **Type**: string
  - **Description**: A personal access token with access to the GitHub repository
- `keychain-password`
  - **Requied**: false
  - **Type**: string
  - **Description**: Internally generated keychain passwords
  - **Default**: UUID

GitHub personal access tokens can be obtained at `Settings > Developer settings > Personal access tokens`.
Access rights require `repo` permissions.

## License
Any contributions made under this project will be governed by the [MIT License][4].

[0]: https://github.com/akiojin/store-git-credential-github-action/actions/workflows/Test.yml/badge.svg
[1]: https://github.com/GitCredentialManager/git-credential-manager
[2]: https://github.com/GitCredentialManager/git-credential-manager#download-and-install
[3]: https://github.com/akiojin/store-git-credential-github-action/blob/main/action.yml
[4]: https://github.com/akiojin/store-git-credential-github-action/blob/main/LICENSE
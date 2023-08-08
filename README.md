# store-git-credential-github-action

![BuildAndTest][0]

This action saves the GitHub credentials to the specified keychain.
The GitHub credentials are deleted at the end of the workflow.

**NOTE:**

`git-credential-manager-core` has been replaced by `git-credential-manager`.
Therefore, please upgrade your pre-installed version to v2.3.0 or higher.

## Requirement

You will need to install [Homebrew](https://brew.sh/)

This action uses git-credential-manager.
git-credential-manager is installed automatically in the action.

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

| Name                | Required | Type      | Default          | Description                                                                                                                             |
| ------------------- | -------- | --------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `github-username`   | `true`   | `boolean` |                  | GitHub username.                                                                                                                        |
| `github-password`   | `true`   | `boolean` |                  | A personal access token with access to the GitHub repository.                                                                           |
| `keychain`          | `false`  | `string`  | Default keychain | Path of the keychain to use. If omitted, the default login keychain is used.                                                            |
| `keychain-password` | `false`  | `string`  | ""               | Password for the keychain if specified in the keychain parameter; default login keychain password if the kerchain parameter is omitted. |

GitHub personal access tokens can be obtained at `Settings > Developer settings > Personal access tokens`.
Access rights require `repo` permissions.

## License

Any contributions made under this project will be governed by the [MIT License][4].

[0]: https://github.com/akiojin/store-git-credential-github-action/actions/workflows/BuildAndTest.yml/badge.svg
[3]: https://github.com/akiojin/store-git-credential-github-action/blob/main/action.yml
[4]: https://github.com/akiojin/store-git-credential-github-action/blob/main/LICENSE

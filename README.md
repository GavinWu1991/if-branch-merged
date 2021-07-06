# if-branch-merged GitHub Action

A GitHub action to check if a pull request head branch has been merged to another branch

## Uses:

create GitHub ci pipeline `yml` with:

```
name: Check if branch is merged to integeration branch
on:
  pull_request
  
jobs:
  if-branch-merged:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v1
    - uses: GavinWu1991/if-branch-merged@v1
        - expected: int-*
```
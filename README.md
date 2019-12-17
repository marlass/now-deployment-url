# ZEIT get deployment url

> ZEIT Now is a cloud platform for static sites and Serverless Functions

This action get a deployment url for this commit. Helps you to chain deploy job with later jobs that require access to that url and run for example in matrix

## Inputs

### `zeit-token`

**required** ZEIT now token.

### `zeit-team-id`

This is required if your deployment is made on team project. example: `team_asdf1234`

## Outputs

### `preview-url`

The url of deployment preview.

* This is a complete `.github/workflow/deploy.yml` example.

```yaml
name: get-url
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: marlass/now-deployment-url@v1
        with:
          zeit-token: ${{ secrets.ZEIT_TOKEN }}
          zeit-team-id: team_XXXXXXXXXXX
```

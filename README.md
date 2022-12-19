# Lambda storage cleanup

Node.js utility to clean up AWS Lambda storage by deleting (old) versions of functions.

Assumes to keep the most recent version(s), depending on the `--keep-count` value.

## Usage

Install dependencies.
```shell
yarn install
```

Run via CLI.
```shell
$ node index.js --help

Usage: lambda-storage-cleanup [options]

Options:
  -a, --access-key <access-key>  AWS access key id. Must provide AWS secret access key as well (default: from local configuration)
  -s, --secret-key <secret-key>  AWS secret access key. Must provide AWS access key id as well (default: from local configuration.
  -p, --profile <profile>        AWS profile. Optional (default: "default" from local configuration). (default: "default")
  -c, --keep-count <number>      Number of latest versions to keep. Older versions will be deleted (default: 1)
  -t, --tags <tags>              Optional. Filter by comma-separated list of tags (e.g. environment=dev,foo=bar) (default: "")
  --dry-run                      Dry run to show what versions will be deleted. No deletions will be executed.
  -r, --region <region>          AWS region to look for old Lambda versions (default: "us-east-1")
  -h, --help                     display help for command
```

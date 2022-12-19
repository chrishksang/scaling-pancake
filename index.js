const { program } = require('commander')
const LambdaClient = require('./src/lambda-client')
const LambdaStorageCleaner = require('./src/lambda-storage-cleaner')

async function lambdaStorageCleanup (options) {
  const client = LambdaClient(options)
  const cleaner = new LambdaStorageCleaner(client, options)
  const deletions = await cleaner.getAllFunctionVersionsToDelete()

  const deletionSize = deletions.reduce((acc, curr) => acc + (curr.CodeSize / 1024), 0) / 1024
  const versions = Object.keys(cleaner.functionVersions).map(key => cleaner.functionVersions[key]).flat()
  const fns = cleaner.functions

  if (deletions.length > 0) {
    console.log(`${deletions.length} versions of ${versions.length} total versions of ${fns.length} functions in ${options.region} to be deleted.`)
    console.log(`${deletionSize.toFixed(2)}MB storage would be freed up.`)

    if (options.dryRun) {
      return 0
    } else {
      await cleaner.deleteFunctionVersions(deletions)
      console.log(`${deletions.length} versions removed. ${deletionSize.toFixed(2)}MB storage freed up.`)
    }
  } else {
    console.log('Nothing to delete :)')
  }
}

program
  .name('lambda-storage-cleanup')
  .usage('[options]')
  .option('-a, --access-key <access-key>', 'AWS access key id. Must provide AWS secret access key as well (default: from local configuration)')
  .option('-s, --secret-key <secret-key>', 'AWS secret access key. Must provide AWS access key id as well (default: from local configuration.')
  .option('-p, --profile <profile>', 'AWS profile. Optional.', '')
  .option('-c, --keep-count <number>', 'Number of latest versions to keep. Older versions will be deleted', 1)
  .option('-t, --tags <tags>', 'Optional. Filter by comma-separated list of tags (e.g. environment=dev,foo=bar)', '')
  .option('--dry-run', 'Dry run to show what versions will be deleted. No deletions will be executed.')
  .option('-r, --region <region>', 'AWS region to look for old Lambda versions', 'us-east-1')
  .action(async (options) => {
    await lambdaStorageCleanup(options)
  })
  .parse(process.argv)

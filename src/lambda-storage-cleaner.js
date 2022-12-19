const { compareAnyTags, parseTags } = require('./utils')

class LambdaStorageCleaner {
  /**
   * @param {Lambda} client
   * @param {object} options
   */
  constructor (client, options = { keepCount: 1, tags: '' }) {
    this.client = client
    this.functions = []
    this.functionVersions = {}
    this.keepCount = parseInt(options.keepCount)
    this.tags = typeof options.tags === 'string' ? parseTags(options.tags) : {}
  }

  async listFunctions (params = {}, prev = []) {
    const result = [...prev]
    const response = await this.client.listFunctions(params).promise()
    const functions = response.Functions
    for (const index in functions) {
      result.push(functions[index])
    }
    if (typeof response.NextMarker === 'string') {
      return await this.listFunctions({ Marker: response.NextMarker }, result)
    } else {
      return result
    }
  }

  async listFunctionVersions (params = {}, prev = []) {
    const result = [...prev]
    const response = await this.client.listVersionsByFunction(params).promise()
    const versions = response.Versions
    for (const index in versions) {
      result.push(versions[index])
    }
    if (typeof response.NextMarker === 'string') {
      return await this.listFunctionVersions({ FunctionName: params.FunctionName, Marker: response.NextMarker })
    } else {
      return result
    }
  }

  async getFunctions () {
    if (this.functions.length === 0) {
      this.functions = await this.listFunctions()
    }
    if (Object.keys(this.tags).length > 0) {
      this.functions = await this.filterFunctionsByTags()
    }
    return this.functions
  }

  async getFunctionVersions (arn) {
    if (this.functionVersions[arn] === undefined) {
      this.functionVersions[arn] = await this.listFunctionVersions({ FunctionName: arn })
    }
    return this.functionVersions[arn]
  }

  async getFunctionVersionsToDelete (arn) {
    const functionVersions = await this.getFunctionVersions(arn)
    return functionVersions
      .sort((a, b) => new Date(b.LastModified) - new Date(a.LastModified))
      .slice(this.keepCount)
  }

  async getAllFunctionVersionsToDelete () {
    const allVersionsToDelete = []
    console.log('Fetching Lambda functions...')
    const functions = await this.getFunctions()
    console.log(`${functions.length} Lambda functions found...`)
    for (const fn of functions) {
      const versionsToDelete = await this.getFunctionVersionsToDelete(fn.FunctionArn)
      const functionVersions = await this.getFunctionVersions(fn.FunctionArn)
      console.log(`${functionVersions.length} versions of "${fn.FunctionName}" found, ${versionsToDelete.length} marked to delete ...`)
      for (const vn of versionsToDelete) {
        allVersionsToDelete.push(vn)
      }
    }
    return allVersionsToDelete
  }

  async deleteFunctionVersions (versions = []) {
    for (const vn of versions) {
      await this.deleteFunctionByArn(vn.FunctionArn)
    }
  }

  async deleteFunctionByArn (arn) {
    try {
      console.log(`Deleting "${arn}"`)
      await this.client.deleteFunction({ FunctionName: arn }).promise()
    } catch (err) {
      console.error(err)
    }
  }

  async filterFunctionsByTags () {
    const filtered = []
    for (const fn of this.functions) {
      const response = await this.client.listTags({ Resource: fn.FunctionArn }).promise()
      const tags = response.Tags
      const anyTagsMatch = compareAnyTags(this.tags, tags)
      if (!anyTagsMatch) {
        const index = this.functions.indexOf(fn)
        this.functions.splice(index, 1)
      } else {
        filtered.push(fn)
      }
    }
    return filtered
  }
}

module.exports = LambdaStorageCleaner

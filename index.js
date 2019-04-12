const R = require('ramda')

const jobsConfig = `
  x =>
  b => d
  a => b
  c => a
`
// result: x -> c -> a -> b -> d

const parseJobs = R.pipe(
  R.split('\n'),
  R.filter(R.identity),
  R.map(R.trim),
  R.map(R.split('=>')),
  R.map(R.map(R.trim)),
)

const mapDeps = R.reduce((sorted, depPair) => {
  const dependsOn = R.head(depPair)
  const dependedOn = R.last(depPair)

  if (!dependedOn) return [ dependsOn, ...sorted ]

  const dependsOnIndex = R.indexOf(dependsOn, sorted)
  const dependedOnIndex = R.indexOf(dependedOn, sorted)
  const alreadyDependsOn = R.gte(dependsOnIndex, 0)
  const alreadyDependedOn = R.gte(dependedOnIndex, 0)
  const isCircular = alreadyDependedOn && R.gt(dependsOnIndex, dependedOnIndex)
  const isEmpty = R.compose(R.not, R.length)

  if (isCircular) {
    throw new Error(`Circular dependency at ${depPair}`)
  }

  if (isEmpty(sorted)) return depPair

  if (R.both(alreadyDependedOn, !alreadyDependsOn)) {
    return [ dependsOn, ...sorted ]
  }

  return [ ...sorted, dependedOn ]
}, [])

const main = () => {
  const jobs = parseJobs(jobsConfig)
  const deps = mapDeps(jobs)
  console.log(R.reverse(deps))
}
main()

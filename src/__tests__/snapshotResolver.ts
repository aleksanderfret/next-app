const snapshotResolver = {
  resolveSnapshotPath: (testPath: string, snapshotExtension: string) =>
    testPath.replace('__tests__', '__snapshots__') + snapshotExtension,
  resolveTestPath: (snapshotFilePath: string, snapshotExtension: string) =>
    snapshotFilePath
      .replace('__snapshots__', '__tests__')
      .slice(0, -snapshotExtension.length),

  testPathForConsistencyCheck: 'src/__tests__/example.test.ts',
};

export default snapshotResolver;

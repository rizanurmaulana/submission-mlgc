const { Firestore } = require('@google-cloud/firestore');

const getData = async () => {
  const db = new Firestore({
    projectId: 'submissionmlgc-riza',
  });
  const snapshotData = await db.collection('predictions').get();

  const allData = snapshotData.docs.map((doc) => ({
    id: doc.id,
    history: doc.data(),
  }));

  return allData;
};

module.exports = getData;

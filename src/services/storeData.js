const { Firestore } = require('@google-cloud/firestore');

function storeData(id, data) {
  const db = new Firestore({
    projectId: 'submissionmlgc-riza',
  });

  const predictCollection = db.collection('predictions');
  return predictCollection.doc(id).set(data)
}

module.exports = storeData;

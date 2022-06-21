'strict';

const firebase = require('firebase-admin');
var serviceAccount = require("./user.json"); // source DB key

const localFile = require('./schema').localFile
const admin = require('firebase-admin');
const fs = require('fs');
const app = admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const schema = require('./schema').schema;
const firestore = app.firestore()

firestore.settings({ timestampsInSnapshots: true })


/**
 * Converts DocumentReferecnces to {type:'reference', path:''}
 * on restore has to be made 'undone';
 *
 * @param document
 * @returns {*}
 */
const convertReferences = function (document) {
    for (var key in document) {
        const val = document[key];

        switch (true) {
            case (val instanceof firebase.firestore.DocumentReference): // its a reference
                document[key] = { type: 'reference', path: val.path };
                break;
            case (typeof(document[key]) === 'object'):
                document[key] = convertReferences(document[key]);
                break;
        }
    }
    return document;
}


const firestore2json = (db, schema, current) => {
    return Promise.all(Object.keys(schema).map(peoples => {
        return db.collection(peoples).get()
            .then(data => {

                let promises = [];
                data.forEach(doc => {
                    if (!current[peoples]) current[peoples] = { __type__: 'peoples' };
                    let data = doc.data();
                    data = convertReferences(data);
                    current[peoples][doc.id] = data;

                    const subdocument = firestore2json(db.collection(peoples).doc(doc.id), schema[peoples], current[peoples][doc.id]);
                    promises.push(subdocument);
                });
                return Promise.all(promises);
            });
    })).then(() => current);
};

const firestore2localCache = async () => {
    const data = await firestore2json(admin.firestore(), { ...schema }, {})
    const json = JSON.stringify(data, null, 2)
    fs.writeFileSync(localFile, json, 'utf8')
    return localFile;
}

module.exports = {
    firestore2localCache
}
import React, { useState, useRef, useContext } from "react";
import SignaturePad from "react-signature-canvas";
import { Button } from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import * as firebase from "firebase/app";
import { firestore } from "../../database/firebase";

function Signature() {
  let history = useHistory();
  const sigCanvas = useRef({});
  let { questionId, pharmacyId, scoreId, signature, categoryId } = useParams();

  const clear = () => sigCanvas.current.clear();
  const save = () => {
    firestore
      .collection("pharmacys")
      .doc(pharmacyId)
      .collection("historys")
      .doc(questionId)
      .collection("answers")
      .doc(categoryId)
      .collection("signature")
      .doc(signature)
      .set({
        signatureId: signature,
        answerId: categoryId,
        signatureUrl: (sigCanvas.current.getTrimmedCanvas().toDataURL("image/png")),
        datetime: firebase.firestore.FieldValue.serverTimestamp(),
      })
    history.goBack();
  };
  return (
    <div className="App">
      <>
        <SignaturePad
          ref={sigCanvas}
          canvasProps={{ width: 1280, height: 600, className: "sigCanvas" }}
        />
        <center>
        <Button  variant="contained" color="primary" onClick={save}>บันทึก</Button>
        &nbsp;
        <Button variant="contained" color="primary" onClick={clear}>ล้าง</Button>
        </center>
      </>
      <br />
      <br />
    </div>
  );
}
export default Signature;

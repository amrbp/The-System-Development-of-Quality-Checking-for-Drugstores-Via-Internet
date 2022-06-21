import React, { useState, useEffect } from "react";
import Camera, { IMAGE_TYPES, FACING_MODES } from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import {
  useParams,
  useHistory,
  useRouteMatch,
  Route,
  Switch,
} from "react-router-dom";
import ImageView from "./ImagePreview";
import { firestore } from "../../database/firebase";

function Capture() {
  const [dataUrl, setDataUrl] = useState("");
  let history = useHistory();
  const [images, setImages] = useState([]);
  let { questionId, pharmacyId, categoryId, imageId } = useParams();
  const { path } = useRouteMatch();
  function handleTakePhotoAnimationDone(dataUrl) {
    setDataUrl(dataUrl);
    firestore
      .collection("pharmacys")
      .doc(pharmacyId)
      .collection("historys")
      .doc(questionId)
      .collection("answers")
      .doc(categoryId)
      .collection("images")
      .add({
        categoryId: imageId,
        answerId: categoryId,
        imageUrl: dataUrl,
        nameImage: nameImage[0],
      });
    history.goBack();
  }

  useEffect(() => {
    firestore
      .collection("questions")
      .doc(questionId)
      .collection("images")
      .where("imageId", "==", imageId)
      .onSnapshot((snapshot) => {
        setImages(
          snapshot.docs.map((doc) => {
            return {
              imageId: doc.id,
              image_name: doc.data().image_name,
            };
          })
        );
      });
  }, [questionId]);

  const nameImage = [];
  {
    images.map((img) => nameImage.push(img.image_name));
  }
  const isFullscreen = true;
  return (
    <div>
      <Switch>
        <Route exact path={path}>
          <div>
            {dataUrl ? (
              <ImageView dataUrl={dataUrl} isFullscreen={isFullscreen} />
            ) : (
              <Camera
                imageType={IMAGE_TYPES.JPG}
                onTakePhotoAnimationDone={handleTakePhotoAnimationDone}
                isFullscreen={isFullscreen}
                idealFacingMode={FACING_MODES.ENVIRONMENT}
              />
            )}
          </div>
        </Route>
      </Switch>
    </div>
  );
}

export default Capture;

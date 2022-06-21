import React, { useState, useEffect } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { firestore } from "../../database/firebase";
import Off from "./img/empty-checkbox.png";
import On from "./img/check-box.png";
import font from "../../font/THSarabun.ttf";
Font.register({ family: "THSarabun", format: "truetype", src: font });

const BORDER_COLOR = "#000000";
const BORDER_STYLE = "solid";
const COL1_WIDTH = 70;
const COLN_WIDTH = (100 - COL1_WIDTH) / 5;

const styles = StyleSheet.create({
  body: {
    paddingTop: 36,
    paddingBottom: 65,
    fontFamily: "THSarabun",
  },
  movieContainer: {
    backgroundColor: "#d1d2d4",
    display: "flex",
    width: 28,
    height: 43,
    marginTop: -39,
    marginLeft: "49%",
  },
  texthader: {
    fontSize: 14,
    marginBottom: 39,
    textAlign: "center",
    height: 20,
  },
  header: {
    marginTop: 34,
    height: 154,
    backgroundColor: "#6c6d70",
    textAlign: "center",
    color: "#ffffff",
    fontSize: 18,
  },
  textheader: {
    fontSize: 22,
    fontWeight: "bold",
  },
  textheaderder: {
    fontSize: 16,
    fontWeight: "bold",
  },
  hr: {
    height: 1,
    backgroundColor: "#ffffff",
    width: "80%",
    margin: "0 auto",
    marginTop: 12,
    marginLeft: 48,
  },
  bodyheader: {
    marginTop: 12,
  },
  bodymain: {
    marginTop: 5,
  },
  bodymainright: {
    marginTop: -16,
    marginLeft: 100,
    position: "relative",
  },
  bodymainrightend: {
    marginTop: -17,
    marginLeft: 50,
    position: "relative",
  },
  bodymainrights: {
    marginTop: -16,
  },
  bodymainrightend2: {
    marginTop: -16,
    marginLeft: 231,
  },
  bodymainright2: {
    marginTop: -16,
    marginLeft: 176,
  },
  bodymainup: {
    marginTop: -2,
  },
  textbody: {
    fontSize: 14,
    fontFamily: "THSarabun",
  },
  viewEnd: {
    marginTop: 70,
  },
  textbodyend: {
    fontSize: 14,
    fontFamily: "THSarabun",
  },
  textbodyends: {
    textIndent: 50,
    fontSize: 16,
    fontFamily: "THSarabun",
  },
  textbodynum: {
    fontSize: 14,
  },
  main: {
    marginTop: 32,
    marginLeft: 70,
  },
  mainbottom: {
    marginLeft: 30,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol1Header: {
    width: COL1_WIDTH + "%",
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderBottomColor: "#000",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#d1d2d4",
    height: 50,
  },
  tableCol2Header: {
    width: "30%",
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderBottomColor: "#000",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#6c6d70",
    color: "#ffffff",
  },
  tableCol2Headerend: {
    width: "30%",
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderBottomColor: "#000",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol2Headerend3: {
    width: "30%",
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderBottomColor: "#000",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#d1d2d4",
  },
  tableCol2Headerend2: {
    width: "70%",
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderBottomColor: "#000",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#d1d2d4",
  },
  tableColHeadersum: {
    width: "40%",
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderBottomColor: "#000",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#6c6d70",
    color: "#ffffff",
  },
  tableColHeadersumend: {
    width: "40%",
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderBottomColor: "#000",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColHeader: {
    width: COLN_WIDTH + "%",
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderBottomColor: "#000",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#d1d2d4",
    height: 50,
  },
  tableCol1: {
    width: COL1_WIDTH + "%",
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    textAlign: "left",
    flexGrow: 1,
  },
  tableColonly: {
    width: "100%",
    height: 24,
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#231f20",
    color: "#ffffff",
  },
  tableColEnd: {
    width: "25%",
    height: 24,
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#6c6d70",
    color: "#ffffff",
  },
  tableColEnds: {
    width: "25%",
    height: 24,
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#d1d2d4",
  },
  tableCol: {
    width: COLN_WIDTH + "%",
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    margin: 5,
    fontSize: 14,
    fontWeight: 900,
    textAlign: "center",
  },
  tableCellHeaderends: {
    margin: 5,
    fontSize: 14,
    fontWeight: 900,
    textAlign: "right",
    backgroundColor: "#d1d2d4",
  },
  tableCellHeadersum: {
    margin: 5,
    fontSize: 14,
    fontWeight: 900,
    textAlign: "center",
  },
  tableCellHeader1: {
    margin: 5,
    fontSize: 14,
    fontWeight: 900,
    textAlign: "center",
  },
  tableCellHeader2: {
    margin: 5,
    fontSize: 14,
    fontWeight: 900,
    textAlign: "center",
  },
  tableCellHeader2end: {
    margin: 5,
    fontSize: 14,
    fontWeight: 900,
    textAlign: "left",
  },
  tableCell: {
    fontSize: 14,
    textAlign: "left",
  },
  tableCellEnd: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
  },
  tableCell2: {
    fontSize: 14,
    textAlign: "center",
  },
  tableCellonly: {
    margin: 5,
    fontSize: 14,
  },
  images: {
    width: 13,
    marginVertical: 14,
    marginHorizontal: 10,
  },
  tablebody: {
    paddingTop: 58,
    paddingBottom: 63,
    paddingHorizontal: 35,
  },
  tablebody1: {
    paddingHorizontal: 30,
    marginTop: 10,
    fontFamily: "THSarabun",
  },
  tablebody2: {
    paddingHorizontal: 35,
  },
  end: {
    marginTop: 30,
    paddingHorizontal: 35,
  },
  position: {
    marginTop: -37,
    marginLeft: 30,
  },
  positionText: {
    marginLeft: 95,
    marginTop: -34,
  },
  positiontext2: {
    marginTop: 20,
    marginLeft: 38,
  },
  positionleft: {
    marginLeft: 243,
    marginTop: -72,
  },
  positiontextleft2: {
    marginTop: 20,
    marginLeft: 38,
  },
  sysy: {
    marginTop: 11,
  },
  borderUnder: {
    marginTop: 10,
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
    height: 270,
  },
  underText: {
    fontSize: 15,
    textAlign: "left",
    fontFamily: "THSarabun",
  },
});

export function Pdfs(props) {
  const [movies, setMovies] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [scores, setScores] = useState([]);
  const [historys, setHistorys] = useState([]);
  const [currentPost, setCurrentPost] = useState({});
  const [categorys, setCategorys] = useState([]);
  const [signature, setSignature] = useState([]);
  const [images, setImages] = useState([]);
  const [pharmacy, setPharmacy] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await firestore
          .collection("pharmacys")
          .doc(props.data[1])
          .get();
        let data = { title: "not found" };
        if (response.exists) {
          data = response.data();
        }
        setCurrentPost(data);

        firestore
          .collection("questions")
          .where("questionId", "==", props.data[0])
          .onSnapshot((snapshot) => {
            setQuestions(
              snapshot.docs.map((doc) => {
                return {
                  id: doc.id,
                  question_name: doc.data().question_name,
                };
              })
            );
          });

        firestore
          .collection("pharmacys")
          .where("id", "==", props.data[1])
          .onSnapshot((snapshot) => {
            setPharmacy(
              snapshot.docs.map((doc) => {
                return {
                  id: doc.id,
                  address: doc.data().address,
                  fax: doc.data().fax,
                  name: doc.data().name,
                  nameoperator: doc.data().nameoperator,
                  nameowner: doc.data().nameowner,
                  phone: doc.data().phone,
                  tel: doc.data().tel,
                };
              })
            );
          });

        firestore
          .collection("pharmacys")
          .doc(props.data[1])
          .collection("historys")
          .doc(props.data[0])
          .collection("answers")
          .doc(props.data[2])
          .collection("category_answers")
          .onSnapshot((snapshot) => {
            setScores(
              snapshot.docs.map((doc) => {
                return {
                  answerId: doc.data().answerId,
                  categoryId: doc.data().categoryId,
                  name: doc.data().id,
                  score: doc.data().score,
                  standard_score: doc.data().standard_score,
                  subquestionId: doc.data().subquestionId,
                  canCut: doc.data().canCut,
                  category_name: doc.data().category_name,
                };
              })
            );
          });

        firestore
          .collection("pharmacys")
          .doc(props.data[1])
          .collection("historys")
          .doc(props.data[0])
          .collection("answers")
          .doc(props.data[2])
          .collection("signature")
          .get()
          .then((response) => {
            const fetchedCinemas = [];
            response.docs.forEach((document) => {
              const fetchedCinema = {
                id: document.id,
                ...document.data(),
              };
              fetchedCinemas.push(fetchedCinema);
            });
            setSignature(fetchedCinemas);
          });

        firestore
          .collection("pharmacys")
          .doc(props.data[1])
          .collection("historys")
          .doc(props.data[0])
          .collection("answers")
          .doc(props.data[2])
          .collection("images")
          .onSnapshot((snapshot) => {
            setImages(
              snapshot.docs.map((doc) => {
                return {
                  img: doc.data().img,
                };
              })
            );
          });

        firestore
          .collection("pharmacys")
          .doc(props.data[1])
          .collection("historys")
          .doc(props.data[0])
          .collection("answers")
          .where("answersId", "==", props.data[2])
          .onSnapshot((snapshot) => {
            setMovies(
              snapshot.docs.map((doc) => {
                return {
                  answersId: doc.data().answersId,
                  category_answers: doc.data().category_answers,
                  comment: doc.data().comment,
                  datetime: doc.data().datetime,
                  images: doc.data().images,
                  signatures: doc.data().signatures,
                };
              })
            );
          });

        firestore
          .collection("pharmacys")
          .doc(props.data[1])
          .collection("finish")
          .where("categoryId", "==", props.data[2])
          .limit(1)
          .onSnapshot((snapshot) => {
            setHistorys(
              snapshot.docs.map((doc) => {
                return {
                  id: doc.id,
                  categoryId: doc.data().categoryId,
                  people_name: doc.data().people_name,
                  finishId: doc.data().finishId,
                  pass: doc.data().pass,
                  datetime: doc.data().datetime,
                  questionId: doc.data().questionId,
                  name: doc.data().name,
                };
              })
            );
          });

        firestore
          .collection("questions")
          .doc(props.data[0])
          .collection("categorys")
          .get()
          .then((response) => {
            const fetchedCinemas = [];
            response.docs.forEach((document) => {
              const fetchedCinema = {
                id: document.id,
                ...document.data(),
              };
              fetchedCinemas.push(fetchedCinema);
            });
            setCategorys(fetchedCinemas);
          });
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [props.data[0], props.data[1], props.data[2]]);

  {
    movies.map((s) => console.log(s));
  }
  const all = [];
  const result = [];
  const titles = [];
  const array1 = [];
  const array2 = [];
  const array3 = [];
  const array4 = [];
  const array5 = [];
  const title1 = [];
  const title2 = [];
  const title3 = [];
  const title4 = [];
  const title5 = [];
  const key1 = [];
  const key2 = [];
  const key3 = [];
  const key4 = [];
  const key5 = [];
  var total1 = 0;
  var total2 = 0;
  var total3 = 0;
  var total4 = 0;
  var total5 = 0;
  const avg = [];
  const avgsum = [];
  {
    scores.map((answer, index) => {
      answer.categoryId === "01001" &&
        answer.canCut === false &&
        array1.push(Number(answer.score));
      answer.categoryId === "01002" &&
        answer.canCut === false &&
        array2.push(Number(answer.score));
      answer.categoryId === "01003" &&
        answer.canCut === false &&
        array3.push(Number(answer.score));
      answer.categoryId === "01004" &&
        answer.canCut === false &&
        array4.push(Number(answer.score));
      answer.categoryId === "01005" &&
        answer.canCut === false &&
        array5.push(Number(answer.score));
    });
  }
  {
    scores.map((answer, index) => {
      answer.categoryId === "02001" &&
        answer.canCut === false &&
        array1.push(Number(answer.score));
      answer.categoryId === "02002" &&
        answer.canCut === false &&
        array2.push(Number(answer.score));
      answer.categoryId === "02003" &&
        answer.canCut === false &&
        array3.push(Number(answer.score));
      answer.categoryId === "02004" &&
        answer.canCut === false &&
        array4.push(Number(answer.score));
      answer.categoryId === "02005" &&
        answer.canCut === false &&
        array5.push(Number(answer.score));
    });
  }
  {
    scores.map((answer, index) => {
      answer.categoryId === "03001" &&
        answer.canCut === false &&
        array1.push(Number(answer.score));
      answer.categoryId === "03002" &&
        answer.canCut === false &&
        array2.push(Number(answer.score));
      answer.categoryId === "03003" &&
        answer.canCut === false &&
        array3.push(Number(answer.score));
      answer.categoryId === "03004" &&
        answer.canCut === false &&
        array4.push(Number(answer.score));
      answer.categoryId === "03005" &&
        answer.canCut === false &&
        array5.push(Number(answer.score));
    });
  }
  {
    scores.map((answer, index) => {
      answer.categoryId === "01001" &&
        answer.canCut === false &&
        title1.push(answer.category_name);
      answer.categoryId === "01002" &&
        answer.canCut === false &&
        title2.push(answer.category_name);
      answer.categoryId === "01003" &&
        answer.canCut === false &&
        title3.push(answer.category_name);
      answer.categoryId === "01004" &&
        answer.canCut === false &&
        title4.push(answer.category_name);
      answer.categoryId === "01005" &&
        answer.canCut === false &&
        title5.push(answer.category_name);
    });
  }
  {
    scores.map((answer, index) => {
      answer.categoryId === "02001" &&
        answer.canCut === false &&
        title1.push(answer.category_name);
      answer.categoryId === "02002" &&
        answer.canCut === false &&
        title2.push(answer.category_name);
      answer.categoryId === "02003" &&
        answer.canCut === false &&
        title3.push(answer.category_name);
      answer.categoryId === "02004" &&
        answer.canCut === false &&
        title4.push(answer.category_name);
      answer.categoryId === "02005" &&
        answer.canCut === false &&
        title5.push(answer.category_name);
    });
  }
  {
    scores.map((answer, index) => {
      answer.categoryId === "03001" &&
        answer.canCut === false &&
        title1.push(answer.category_name);
      answer.categoryId === "03002" &&
        answer.canCut === false &&
        title2.push(answer.category_name);
      answer.categoryId === "03003" &&
        answer.canCut === false &&
        title3.push(answer.category_name);
      answer.categoryId === "03004" &&
        answer.canCut === false &&
        title4.push(answer.category_name);
      answer.categoryId === "03005" &&
        answer.canCut === false &&
        title5.push(answer.category_name);
    });
  }

  {
    categorys.map((category) => {
      category.categoryId === "01001" && key1.push(category.categoryId);
      category.categoryId === "01002" && key2.push(category.categoryId);
      category.categoryId === "01003" && key3.push(category.categoryId);
      category.categoryId === "01004" && key4.push(category.categoryId);
      category.categoryId === "01005" && key5.push(category.categoryId);
    });
  }

  for (var i = 0; i < array1.length; i++) {
    total1 += array1[i];
  }
  for (var i = 0; i < array2.length; i++) {
    total2 += array2[i];
  }
  for (var i = 0; i < array3.length; i++) {
    total3 += array3[i];
  }
  for (var i = 0; i < array4.length; i++) {
    total4 += array4[i];
  }
  for (var i = 0; i < array5.length; i++) {
    total5 += array5[i];
  }

  result.push(
    {
      category_answer: (total1 / 100) * 100,
      category_name: title1.toString(),
    },
    {
      category_answer: (total2 / 100) * 100,
      category_name: title2.toString(),
    },
    {
      category_answer: (total3 / 100) * 100,
      category_name: title3.toString(),
    },
    {
      category_answer: (total4 / 100) * 100,
      category_name: title4.toString(),
    },
    {
      category_answer: (total5 / 100) * 100,
      category_name: title5.toString(),
    }
  );

  avg.push(Number(total1 + total2 + total3 + total4 + total5));
  avgsum.push(total1, total2, total3, total4, total5);

  const numberone_people = [];
  {
    signature.map((sig) => numberone_people.push(sig.id));
  }

  const sum = [];
  var sumTotal = 0;
  {
    movies.map((s) =>
      s.category_answers.map((question, index) =>
        sum.push(
          (Number(question.scoreCate) / Number(question.category_answer * 2)) *
            100
        )
      )
    );
  }
  for (var i = 0; i < sum.length; i++) {
    sumTotal += sum[i];
  }
  const sumTotal_ans = [];
  sumTotal_ans.push(sumTotal / sum.length);

  return (
    <Document>
      <Page style={styles.body}>
        <View style={styles.movieContainer}>
          <Text style={styles.texthader}>๔๑</Text>
        </View>
        <View style={styles.header}>
          <View style={styles.hr}></View>
          <View style={styles.bodyheader}>
            <Text style={styles.textheader}>
              บันทึกการประเมินวิธีปฏิบัติทางเภสัชกรรมชุมชน
            </Text>
            <Text style={styles.textheader}>ในสถานที่ขายยาแผนปัจจุบัน</Text>
            <Text style={styles.textheaderder}>
              ตามประกาศกระทรวงสาธารณสุข เรื่อง การกำหนดเกี่ยวกับสถานที่ อุปกรณ์
            </Text>
            <Text style={styles.textheaderder}>
              และวิธีปฏิบัติทางเภสัชกรรมชุมชน ในสถานที่ขายยาแผนปัจจุบัน
            </Text>
            <Text style={styles.textheaderder}>
              ตามกฎหมายว่าด้วยยา พ.ศ. ๒๕๕๗
            </Text>
          </View>
          <View style={styles.hr}></View>
        </View>
        <View style={styles.main}>
          <View style={styles.bodymain}>
            <Text style={styles.textbody}>
              วันที่ตรวจประเมิน
              .......................................................................................................
              เวลา.................................................
            </Text>
            <View
              style={{ position: "absolute", marginLeft: 100, marginTop: -2 }}
            >
              {historys.map((history) => (
                <Text style={styles.textbody}>
                  {new Date(history.datetime.seconds * 1000).toLocaleDateString(
                    "th-TH",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </Text>
              ))}
            </View>
            <View
              style={{ position: "absolute", marginLeft: 350, marginTop: -2 }}
            >
              {historys.map((history) => (
                <Text style={styles.textbody}>
                  {new Date(history.datetime.seconds * 1000).toLocaleTimeString(
                    "th-TH"
                  )}
                </Text>
              ))}
            </View>
          </View>
          <View style={styles.bodymain}>
            <Text style={styles.textbody}>
              ผู้ประเมิน ๑
              ...........................................................................................................................................................................
            </Text>
            <View
              style={{ position: "absolute", marginTop: -2, marginLeft: 80 }}
            >
              <Text style={styles.textbody}>
                {movies.map((im) =>
                  im.signatures.map(
                    (s) => s.status === "ผู้ประเมิน ๑" && s.people_name
                  )
                )}
              </Text>
            </View>
          </View>
          <View style={styles.bodymain}>
            <Text style={styles.textbody}>
              ผู้ประเมิน ๒
              ...........................................................................................................................................................................
            </Text>
            <View
              style={{ position: "absolute", marginTop: -2, marginLeft: 80 }}
            >
              <Text style={styles.textbody}>
                {movies.map((im) =>
                  im.signatures.map(
                    (s) => s.status === "ผู้ประเมิน ๒" && s.people_name
                  )
                )}
              </Text>
            </View>
          </View>
          <View style={styles.bodymain}>
            <Text style={styles.textbody}>
              เลขที่ใบอนุญาติ
              ..........................................................................
              ชื่อผู้รับอนุญาติ
              ................................................................
            </Text>
            <View
              style={{ position: "absolute", marginLeft: 100, marginTop: -2 }}
            >
              {pharmacy.map((p) => (
                <Text style={styles.textbody}>{p.id}</Text>
              ))}
            </View>
            <View
              style={{ position: "absolute", marginLeft: 310, marginTop: -2 }}
            >
              {pharmacy.map((p) => (
                <Text style={styles.textbody}>{p.nameowner}</Text>
              ))}
            </View>
          </View>
          <View style={styles.bodymain}>
            <Text style={styles.textbody}>
              โดยมี
              ..................................................................................................................เป็นผู้ดำเนินกิจการ
              (เฉพาะกรณีนิติบุคคล)
            </Text>
            <View
              style={{ position: "absolute", marginLeft: 70, marginTop: -2 }}
            >
              {pharmacy.map((p) => (
                <Text style={styles.textbody}>{p.nameoperator}</Text>
              ))}
            </View>
          </View>
          <View style={styles.bodymain}>
            <Text style={styles.textbody}>
              สถานประกอบการชื่อ
              ............................................................................................................................................................
            </Text>
            <View
              style={{ position: "absolute", marginLeft: 105, marginTop: -2 }}
            >
              {pharmacy.map((p) => (
                <Text style={styles.textbody}>{p.name}</Text>
              ))}
            </View>
          </View>
          <View style={styles.bodymain}>
            <Text style={styles.textbody}>
              ที่อยู่
              .......................................................................................................................................................................................
            </Text>
            <View
              style={{ position: "absolute", marginLeft: 70, marginTop: -2 }}
            >
              {pharmacy.map((p) => (
                <Text style={styles.textbody}>{p.address}</Text>
              ))}
            </View>
          </View>
          <View style={styles.bodymain}>
            <Text style={styles.textbody}>
              โทรศัพท์ ....................................................
              โทรสาร ................................................... มือถือ
              ..............................................
            </Text>
            <View
              style={{ position: "absolute", marginLeft: 60, marginTop: -2 }}
            >
              {pharmacy.map((p) => (
                <Text style={styles.textbody}>{p.tel}</Text>
              ))}
            </View>
            <View
              style={{ position: "absolute", marginLeft: 210, marginTop: -2 }}
            >
              {pharmacy.map((p) => (
                <Text style={styles.textbody}>{p.fax}</Text>
              ))}
            </View>
            <View
              style={{ position: "absolute", marginLeft: 350, marginTop: -2 }}
            >
              {pharmacy.map((p) => (
                <Text style={styles.textbody}>{p.phone}</Text>
              ))}
            </View>
          </View>

          <View style={styles.bodymain}>
            <Text style={styles.textbody}>
              ผู้มีหน้าที่ปฏิบัติการ..........คน ได้แก่
            </Text>
            <View
              style={{ position: "absolute", marginLeft: 79, marginTop: -2 }}
            >
              {movies.map((im) =>
                im.signatures.map(
                  (s) =>
                    s.status === "ผู้มีหน้าที่ปฏิบัติการ" && (
                      <Text style={styles.textbody}>{scores.length}</Text>
                    )
                )
              )}
            </View>
          </View>
          <View style={styles.bodymain}>
            <View style={styles.mainbottom}>
              <Text style={styles.textbody}>
                ๑
                .................................................................................
                ภ.....................
                เวลาปฏิบัติการ..............................น.
              </Text>
              <View
                style={{ position: "absolute", marginLeft: 48, marginTop: -2 }}
              >
                {movies.map((im) =>
                  im.signatures.map(
                    (s) =>
                      s.status === "ผู้มีหน้าที่ปฏิบัติการ" && (
                        <Text style={styles.textbody}>{s.people_name}</Text>
                      )
                  )
                )}
              </View>
            </View>
          </View>
          <View style={styles.bodymain}>
            <View style={styles.mainbottom}>
              <Text style={styles.textbody}>
                ๒
                .................................................................................
                ภ.....................
                เวลาปฏิบัติการ..............................น.
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.tablebody}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol1Header}>
                <Text style={styles.tableCellHeader1}>
                  ข้อกำหนดตามประกาศฯ เรื่อง{" "}
                  {questions.map((question) => question.question_name)}
                </Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader2}>ปรับปรุ่ง(๐)</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader2}>พอใช้(๑)</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader2}>ดี(๒)</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>ค่าน้ำหนักคะแนน</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>
                  คะแนนที่ได้ X ค่าน้ำหนัก
                </Text>
              </View>
            </View>
            {movies.map((p) =>
              p.category_answers.map((question, index) => (
                <View key={index}>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColonly}>
                      <Text style={styles.tableCell}>
                        {question.category_name}
                      </Text>
                    </View>
                  </View>
                  {question.sub_question.map((sub_, i) => (
                    <View style={styles.tableRow} key={i}>
                      <View style={styles.tableCol1}>
                        <Text style={styles.tableCell}>
                          {sub_.subquestion_name}
                        </Text>
                      </View>
                      <View style={styles.tableCol}>
                        {sub_.score === "0" ? (
                          <Image style={styles.images} src={On} />
                        ) : (
                          <Image style={styles.images} src={Off} />
                        )}
                      </View>
                      <View style={styles.tableCol}>
                        {sub_.score === "1" ? (
                          <Image style={styles.images} src={On} />
                        ) : (
                          <Image style={styles.images} src={Off} />
                        )}
                      </View>
                      <View style={styles.tableCol}>
                        {sub_.score === "2" ? (
                          <Image style={styles.images} src={On} />
                        ) : (
                          <Image style={styles.images} src={Off} />
                        )}
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell2}>{sub_.standard}</Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell2}>
                          {sub_.canCut === true
                            ? "ตัดคะแนน"
                            : Number(sub_.score) * Number(sub_.standard)}
                        </Text>
                      </View>
                    </View>
                  ))}
                  <View style={styles.tableRow}>
                    <View style={styles.tableColEnd}>
                      <Text style={styles.tableCellEnd}>
                        น้ำหนักรวมหมวดที่ ๑
                      </Text>
                    </View>
                    <View style={styles.tableColEnd}>
                      <Text style={styles.tableCellEnd}>
                        คะแนนรวม x น้ำหนักรวม (A)
                      </Text>
                    </View>
                    <View style={styles.tableColEnd}>
                      <Text style={styles.tableCellEnd}>
                        คะแนนรวมเต็ม x น้ำหนักรวม (B)
                      </Text>
                    </View>
                    <View style={styles.tableColEnd}>
                      <Text style={styles.tableCellEnd}>
                        ร้อยละ[(A/B) x 100]
                      </Text>
                    </View>
                  </View>

                  <View style={styles.tableRow} key={index}>
                    <View style={styles.tableColEnds}>
                      <Text style={styles.tableCellEnd}>
                        {question.category_answer}
                      </Text>
                    </View>
                    <View style={styles.tableColEnds}>
                      <Text style={styles.tableCellEnd}>
                        {Number(question.scoreCate)}
                      </Text>
                    </View>
                    <View style={styles.tableColEnds}>
                      <Text style={styles.tableCellEnd}>
                        {Number(question.category_answer) * 2}
                      </Text>
                    </View>
                    <View style={styles.tableColEnds}>
                      <Text style={styles.tableCellEnd}>
                        {(Number(question.scoreCate) /
                          Number(question.category_answer * 2)) *
                          100}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>

        <View style={styles.tablebody1}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol2Header}>
                <Text style={styles.tableCellHeadersum}>หมวดที่</Text>
              </View>
              <View style={styles.tableColHeadersum}>
                <Text style={styles.tableCellHeader2}>รายละเอียด</Text>
              </View>
              <View style={styles.tableCol2Header}>
                <Text style={styles.tableCellHeader2}>ร้อยละ</Text>
              </View>
            </View>
            {movies.map((s) =>
              s.category_answers.map((cate, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={styles.tableCol2Headerend}>
                    <Text style={styles.tableCellHeader}>
                      หมวดที่ {index + 1}
                    </Text>
                  </View>
                  <View style={styles.tableColHeadersumend}>
                    <Text style={styles.tableCellHeader2end}>
                      {cate.category_name}
                    </Text>
                  </View>
                  <View style={styles.tableCol2Headerend}>
                    <Text style={styles.tableCellHeader2}>
                      {(Number(cate.scoreCate) /
                        Number(cate.category_answer * 2)) *
                        100}
                    </Text>
                  </View>
                </View>
              ))
            )}
            <View style={styles.tableRow}>
              <View style={styles.tableCol2Headerend2}>
                <Text style={styles.tableCellHeaderends}>ร้อยละเฉลี่ย</Text>
              </View>
              <View style={styles.tableCol2Headerend3}>
                <Text style={styles.tableCellHeader2}>
                  {sumTotal_ans.map((s) => s)}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.end}>
          <View style={styles.tablebody1}>
            <Text style={styles.textbody}>สรุปผลการประเมิน</Text>
            {sumTotal_ans.map((s) =>
              Number(s) >= (Number(s) * 60) / 100 ? (
                <View style={{ position: "absolute", marginLeft: 200 }}>
                  <View>
                    <Image style={{ width: 13 }} src={On} />
                    <View style={{ position: "absolute", marginLeft: 16 }}>
                      <Text style={styles.textbody}>ผ่าน</Text>
                    </View>
                  </View>
                  <View style={{ marginLeft: 50, position: "absolute" }}>
                    <Image style={{ width: 13 }} src={Off} />
                    <View style={{ position: "absolute", marginLeft: 16 }}>
                      <Text style={styles.textbody}>ไม่ผ่าน</Text>
                    </View>
                  </View>
                </View>
              ) : (
                <View style={{ position: "absolute", marginLeft: 200 }}>
                  <View>
                    <Image style={{ width: 13 }} src={Off} />
                    <View style={{ position: "absolute", marginLeft: 16 }}>
                      <Text style={styles.textbody}>ผ่าน</Text>
                    </View>
                  </View>
                  <View style={{ marginLeft: 50, position: "absolute" }}>
                    <Image style={{ width: 13 }} src={Off} />
                    <View style={{ position: "absolute", marginLeft: 16 }}>
                      <Text style={styles.textbody}>ไม่ผ่าน</Text>
                    </View>
                  </View>
                </View>
              )
            )}
          </View>
          <View style={styles.tablebody1}>
            <Text style={styles.textbody}>
              ส่วนที่บกพร่อง / ขอให้แก้ไข ...{movies.map((s) => s.comment)}
            </Text>
          </View>
        </View>
        <View style={styles.end}>
          <View style={styles.tablebody1}>
            <Text style={styles.textbodyend}>
              ในการตรวจครั้งนี้
              ผู้ประเมินและคณะมิได้ทำให้ทรัพย์สินของผู้รับอนุญาต /
              ผู้ดำเนินกิจการ / ผู้มีหน้าที่ปฏิบัติการ รวมถึงผู้เกี่ยวข้อง
              สูญหายหรือเสียหายแต่อย่างใด ข้าพเจ้าได้อ่าน / อ่านให้ฟังแล้ว
              รับรองว่าถูกต้อง จึงได้ลงลายมือชื่อไว้ เป็นสำคัญ
            </Text>
          </View>
        </View>

        <View style={styles.end}>
          <View style={styles.sysy}>
            {movies.map((im) =>
              im.signatures.map(
                (s) =>
                  s.status === "ผู้รับอนุญาต / ผู้ดำเนินกิจการ" && (
                    <View style={styles.tablebody1}>
                      <View style={styles.tablebody1}>
                        <Text style={styles.textbody}>ลงชื่อ</Text>
                        <View style={styles.position}>
                          <Image
                            style={{ width: 55, height: 55 }}
                            src={s.signatureUrl}
                          />
                        </View>
                        <View style={styles.positionText}>
                          <Text style={styles.textbody}>{s.status}</Text>
                        </View>
                        <View style={styles.positiontext2}>
                          <Text style={styles.textbody}>{s.people_name}</Text>
                        </View>
                      </View>
                    </View>
                  )
              )
            )}

            <View style={styles.positionleft}>
              {movies.map((im) =>
                im.signatures.map(
                  (s) =>
                    s.status === "ผู้มีหน้าที่ปฏิบัติการ" && (
                      <View style={styles.tablebody1}>
                        <View style={styles.tablebody1}>
                          <Text style={styles.textbody}>ลงชื่อ</Text>
                          <View style={styles.position}>
                            <Image
                              style={{ width: 55, height: 55 }}
                              src={s.signatureUrl}
                            />
                          </View>
                          <View style={styles.positionText}>
                            <Text style={styles.textbody}>{s.status}</Text>
                          </View>
                          <View style={styles.positiontextleft2}>
                            <Text style={styles.textbody}>{s.people_name}</Text>
                          </View>
                        </View>
                      </View>
                    )
                )
              )}
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            {movies.map((im) =>
              im.signatures.map(
                (s) =>
                  s.status === "ผู้ประเมิน ๑" && (
                    <View style={styles.tablebody1}>
                      <View style={styles.tablebody1}>
                        <Text style={styles.textbody}>ลงชื่อ</Text>
                        <View style={styles.position}>
                          <Image
                            style={{ width: 55, height: 55 }}
                            src={s.signatureUrl}
                          />
                        </View>
                        <View style={styles.positionText}>
                          <Text style={styles.textbody}>{s.status}</Text>
                        </View>
                        <View style={styles.positiontext2}>
                          <Text style={styles.textbody}>{s.people_name}</Text>
                        </View>
                      </View>
                    </View>
                  )
              )
            )}
            {movies.map((im) =>
              im.signatures.map(
                (s) =>
                  s.status === "ผู้ประเมิน ๒" && (
                    <View style={styles.positionleft}>
                      <View style={styles.tablebody1}>
                        <View style={styles.tablebody1}>
                          <Text style={styles.textbody}>ลงชื่อ</Text>
                          <View style={styles.position}>
                            <Image
                              style={{ width: 55, height: 55 }}
                              src={s.signatureUrl}
                            />
                          </View>
                          <View style={styles.positionText}>
                            <Text style={styles.textbody}>{s.status}</Text>
                          </View>
                          <View style={styles.positiontextleft2}>
                            <Text style={styles.textbody}>{s.people_name}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  )
              )
            )}
          </View>
          <View style={{ marginTop: 10 }}>
            {movies.map((im) =>
              im.signatures.map(
                (s) =>
                  s.status === "พยาน ๑" && (
                    <View style={styles.tablebody1}>
                      <View style={styles.tablebody1}>
                        <Text style={styles.textbody}>ลงชื่อ</Text>
                        <View style={styles.position}>
                          <Image
                            style={{ width: 55, height: 55 }}
                            src={s.signatureUrl}
                          />
                        </View>
                        <View style={styles.positionText}>
                          <Text style={styles.textbody}>{s.status}</Text>
                        </View>
                        <View style={styles.positiontext2}>
                          <Text style={styles.textbody}>{s.people_name}</Text>
                        </View>
                      </View>
                    </View>
                  )
              )
            )}
            {movies.map((im) =>
              im.signatures.map(
                (s) =>
                  s.status === "พยาน ๒" && (
                    <View style={styles.positionleft}>
                      <View style={styles.tablebody1}>
                        <View style={styles.tablebody1}>
                          <Text style={styles.textbody}>ลงชื่อ</Text>
                          <View style={styles.position}>
                            <Image
                              style={{ width: 55, height: 55 }}
                              src={s.signatureUrl}
                            />
                          </View>
                          <View style={styles.positionText}>
                            <Text style={styles.textbody}>{s.status}</Text>
                          </View>
                          <View style={styles.positiontextleft2}>
                            <Text style={styles.textbody}>{s.people_name}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  )
              )
            )}
          </View>
          <View style={styles.viewEnd}>
            <Text style={styles.textbodyends}>
              ส่วนที่ 2 ภาพถ่ายสถานทีขายยาแผนปัจจุบัน ณ ปัจจุบัน
            </Text>

            {movies.map((im) =>
              im.images.map((i, index) => (
                <View key={index} style={{ marginTop: 15 }}>
                  <View style={styles.borderUnder}>
                    <Image
                      style={{
                        width: "80%",
                        height: "auto",
                        display: "table",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                      src={i.imageUrl}
                    />
                  </View>
                  <View style={{ marginTop: 10, marginLeft: 30 }}>
                    <Text style={styles.underText}>
                      {index + 1} {i.nameImage}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}

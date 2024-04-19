/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require('cors');

admin.initializeApp(); // 어드민 초기화. 클라우드 함수, 호스팅만 사용할 경우 따로 설정파일을 넘겨주지 않아도 됨
const app = express(); 
const memberApp = express.Router();

const db = admin.firestore();
const memberCollection = "members";
const messageCollection = "messages";

const corsOptions = {
    origin: '*',  // 클라이언트 주소
    methods: ['GET', 'POST', 'DELETE']  // 허용할 메서드 목록
};

// 해당 부분에 멤버 CRUD 라우트 설정
// 새로운 멤버 추가
memberApp.post("/members", async (req, res) => {
    try {
        const member = {
            name: req.body.name,
            mbti: req.body.mbti,
            number: req.body.number,
            introduce: req.body.introduce,
            blog: req.body.blog,
        };
        const memberDoc = await db.collection(memberCollection).add(member);
        res.status(200).send(`새로운 멤버 추가 ID: ${memberDoc.id}`);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// 기존 멤버 수정
memberApp.patch("/members/:membername", async (req, res) => {
    try {
        const updatedMemberDoc = await db
            .collection(memberCollection)
            .doc(req.params.membername)
            .update(req.body);
        res.status(204).send(`${updatedMemberDoc} 멤버 수정 완료`);
    } catch (error) {
        res.status(400).send(`멤버를 수정하는 도중 오류가 발생했습니다`);
    }
});

// ID로 멤버 불러오기
memberApp.get("/members/:membername", async (req, res) => {
    try {
        const memberDoc = await db
            .collection(memberCollection)
            .doc(req.params.membername)
            .get();

        res.status(200).send({ id: memberDoc.id, ...memberDoc.data() });
    } catch (error) {
        res.status(400).send("멤버를 불러오는데 실패하였습니다");
    }
});

// 아이디로 기존 멤버 삭제
memberApp.delete("/members/:membername", async (req, res) => {
    try {
        const deleteMemberDoc = await db
            .collection(memberCollection)
            .doc(req.params.membername)
            .delete();

        res.status(204).send(`정상적으로 삭제 ID: ${deleteMemberDoc.id}`);
    } catch (error) {
        res.status(400).send("멤버를 삭제하는데 실패하였습니다");
    }
});

// 등록된 멤버 모두 조회
memberApp.get("/members", async (req, res) => {
    try {
        const memberDocs = await db.collection(memberCollection).get();
        const members = memberDocs.docs.map((memberDoc) => ({
            id: memberDoc.id,
            ...memberDoc.data(),
        }));
        res.status(200).send(members);
    } catch (error) {
        res.status(400).send("전체 멤버를 불러오는데 실패하였습니다");
    }
});

// =============== 여기서부터 메세지 ================
memberApp.post("/messages", async (req, res) => {
    try {
        const parsed = JSON.parse(req.body);
        const message = {
            name: parsed.name,
            message: parsed.message,
            time: new Date()
        };
        const messageDoc = await db.collection(messageCollection).doc(parsed.name).set(message);
        res.status(200).header('Access-Control-Allow-Origin','*').send(`새로운 멤버 추가 ID: ${messageDoc.id}`);
    } catch (error) {
        res.status(400).header('Access-Control-Allow-Origin','*').send(error.message);
    }
});

// 기존 메시지 수정
memberApp.patch("/messages/:name", async (req, res) => {
    try {
        const parsed = JSON.parse(req.body);
        const updatedMDoc = await db
            .collection(messageCollection)
            .doc(parsed.name)
            .update(parsed);
        res.status(204).header('Access-Control-Allow-Origin','*').send(`${updatedMDoc} 메시지 수정 완료`);
    } catch (error) {
        res.status(400).header('Access-Control-Allow-Origin','*').send(`메시지를 수정하는 도중 오류가 발생했습니다`);
    }
});

  // ID로 메시지 불러오기
memberApp.get("/messages/:name", async (req, res) => {
    try {
        const mDoc = await db
            .collection(messageCollection)
            .doc(req.params.name)
            .get();

        res.status(200).header('Access-Control-Allow-Origin','*').send({ id: mDoc.id, ...mDoc.data() });
    } catch (error) {
        res.status(400).header('Access-Control-Allow-Origin','*').send("멤버를 불러오는데 실패하였습니다");
    }
});

  // 아이디로 기존 메시지 삭제
memberApp.delete("/messages/:name", async (req, res) => {
    try {
        console.log(req.params)
        const deleteMDoc = await db
            .collection(messageCollection)
            .doc(req.params.name)
            .delete();

        res.status(204).header('Access-Control-Allow-Origin','*').send(`정상적으로 삭제 ID: ${deleteMDoc.id}`);
    } catch (error) {
        res.status(400).header('Access-Control-Allow-Origin','*').send("멤버를 삭제하는데 실패하였습니다");
    }
});

  // 등록된 메시지 모두 조회
memberApp.get("/messages", async (req, res) => {
    try {
        const mDocs = await db.collection(messageCollection).get();
        const messages = mDocs.docs.map((mDoc) => ({
            id: mDoc.id,
            ...mDoc.data(),
        }));
        res.status(200).header('Access-Control-Allow-Origin','*').send(messages);
    } catch (error) {
        res.status(400).header('Access-Control-Allow-Origin','*').send("전체 멤버를 불러오는데 실패하였습니다");
    }
});

app.use(cors(corsOptions));
app.use(express.json()); // body-parser 설정
app.use("/api", memberApp); 

exports.memberAPI = functions.region("asia-northeast3").https.onRequest(app);

const express = require("express");
const chalk = require("chalk");

// middleware
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

// router
const usersRouter = require("./routes/users");
const linksRouter = require("./routes/links");

// database
const { urls } = require("./models");

const app = express();
const port = 3001;

// SECTION : session
app.use(
	session({
		secret: "@codestates",
		resave: false,
		saveUninitialized: true,
	})
);
/* NOTE
 * session(option)
 * secret - session hijacking을 막기위해 hash값에 추가로 들어가는 값 (Salt와 비슷한 개념)
 * resave - session을 언제나 저장할지 정하는 값
 * saveUninitialize: true - 세션이 저장되기 전에 uninitialized 상태로 만들어 저장
 */

// cookieParser() - 넘어온 Cookie 데이터를 관리하기 쉽게 JSON 객체로 변환해 주는 라이브러리
app.use(cookieParser());

// express.json() - body로 넘어온 데이터를 JSON 객체로 변환
app.use(express.json());

/*
 * express.urlencoded({ extended }) - 중첩 객체를 허용할지 말지를 결정하는 옵션
 * 참고 링크(https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0/45690436#45690436)
 */
app.use(express.urlencoded({ extended: false }));

/*
 * cors() - CORS를 대응하기 위한 라이브러리 ( Access-Control-Allow-Origin: * )
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
 */
app.use(
	cors({
		origin: ["http://localhost:3000"],
		methods: ["GET", "POST"],
		credentials: true,
	})
);

// ? POSTMAN을 통한 test에 필요할지도 모릅니다. logging을 활용하세요.
app.use(morgan("dev"));

// TODO : GET / 요청에 대한 응답을 작성해주세요. (api 구현을 가볍게 시작해보세요.)
app.get("/", (req, res) => {
	res.status(200).send("Success");
});

// TODO : req.params[] 확인해보기
app.get("/D*", (req, res) => {
	urls
		.findOne({
			where: {
				code: "D" + req.params[0], // req.params는 url중 도메인 명 다음부터 쌓인다 ( https://naver.com/params[0]/params[1]/params[2])
			},
		})
		.then((result) => {
			if (result) {
				result.update({
					// sequelize에서 반환되는 데이터는 단순히 결과값의 데이터 객체가 아니라 sequelize의 함수를 포함하고 있다.
					visits: result.visits + 1, // 다만 데이터에 접근할 경우에는 바로 접근 가능
				});
				res.redirect(result.url);
			} else {
				res.sendStatus(204); // No Content
			}
		})
		.catch((error) => {
			console.log(error);
			res.sendStatus(500); // Server Error
		});
});

// SECTION : router 연결
app.use("/user", usersRouter);
app.use("/links", linksRouter);

app.set("port", port);
app.listen(app.get("port"), () => {
	console.log(
		chalk(
			`         
        　    ∧∧
        　　（*･ω･）    app is listening in PORT ${app.get("port")}!!
        　 ＿|　⊃／(＿＿_
        ／　└-(＿＿＿_／
        ￣￣￣￣￣￣￣                                            `
		)
	);

	module.exports = app;
});

// chalk``.bgGreen.black.bold.italic.underline(
// 	`🥳🥳🥳🥳app is listening in PORT ${app.get("port")}`

"use strict";

const crypto = require("crypto");

module.exports = (sequelize, DataTypes) => {
	const users = sequelize.define(
		"users",
		{
			email: DataTypes.STRING,
			username: DataTypes.STRING,
			password: DataTypes.STRING,
		},
		{
			hooks: {
				beforeCreate: (data, option) => {
					// 새로운 sha(sum) 만들기
					var shasum = crypto.createHmac("sha512", "thisismysecretkey");
					// sha에 패스워드 섞기
					shasum.update(data.password);
					// 패스워드 업데이트하기
					data.password = shasum.digest("hex");
				},
				beforeFind: (data, option) => {
					if (data.where.password) {
						var shasum = crypto.createHmac("sha512", "thisismysecretkey");
						shasum.update(data.where.password);
						data.where.password = shasum.digest("hex");
					}
				},
			},
		}
	);
	users.associate = function (models) {
		// associations can be defined here
	};
	return users;
};

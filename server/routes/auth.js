import express from 'express';

const router = express.Router();


import {login, register, getInfo, refresh, logout} from "../controllers/auth.js"



router.route('/refresh').get(refresh)

router.route('/logout').post(logout)

router.route("/info").get(getInfo);

router.route("/register").post(register);

router.route("/login").post(login);




export default router;
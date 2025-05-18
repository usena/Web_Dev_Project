import express from "express";
import admin from "../firebaseAdmin.js";

const router = express.Router();

router.post("/sessionLogin", async (req, res) => {
  const { idToken } = req.body;
  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  try {
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
    res.cookie("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.send({ status: "success" });
  } catch (error) {
    res.status(401).send("UNAUTHORIZED");
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("session");
  res.send({ status: "logged out" });
});

export default router;

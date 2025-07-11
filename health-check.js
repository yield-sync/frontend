import express from "express";

express().get("/health", (req, res) => res.status(200).json({ status: "OK" })).listen(
	5173,
	() => console.log("Health check running on port 5173")
);
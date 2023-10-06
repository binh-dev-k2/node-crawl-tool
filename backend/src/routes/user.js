const express = require("express");
const route = express.Router();
const { VerifyToken, CheckAdmin } = require("../middleware/AuthMiddleware")


route.delete('/:id', [VerifyToken, CheckAdmin], async (req, res) => {
    const { id } = req.params
    try {
        const removed = await Todo.findByIdAndDelete(id)
        if (!removed) throw Error('Something went wrong ')
        res.status(200).json(removed)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = route;